// Firebase
const functions = require('firebase-functions');

const http = require('http');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://nwen304-groupproject-9db15-default-rtdb.asia-southeast1.firebasedatabase.app'
});


// For hosting the application
const express = require('express');
const app = express();

// For parsing authentcation requests
const bodyParser = require('body-parser');

// For security 
// Cross Site Request Forgery
const {doubleCsrf} = require('csrf-csrf');

const doubleCsrfOptions = {
    cookie: {
      httpOnly: true,
      secure: true, // only sends over https
      sameSite: 'strict', // only sends on same site
    },
    header: 'X-CSRF-TOKEN',
    // ignore methods and paths that we don't check csrf tokens for
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignorePaths: ['/login', '/register'],
    // define error messages and status codes
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    // specifies the key under which the session secret is stored in the session
    sessionKey: 'csrfSecret',
    // defines the lengths of the generated secret and salt
    secretLength: 16,
    saltLength: 16,
    // don't automatically clear it
    clearInvalid: false,
    // provides additional options for the CSRF token cookie. It sets the cookie path, 
    // ensures it is httpOnly, secure, and has a strict SameSite attribute.
    cookieConfig: {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  };

const {
    invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
    validateRequest, // Also a convenience if you plan on making your own middleware.
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf(doubleCsrfOptions);

//const {doubleCsrfProtection} = doubleCsrf(doubleCsrfOptions);

const csrfMiddleware = doubleCsrfProtection();

// For sessions and cookies
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

//
const { initializeApp } = require('firebase-admin/app');
const ejs = require('ejs');

// Define the path to your static files (CSS, JavaScript, images, etc.)
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '/public');
// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));

// Use the Parsers and CSRF
app.use(bodyParser.json());
app.use(cookieParser()); // automatically works with cookies
app.use(csrfMiddleware); // sets and checks csrf related cookies

// Sets a cookie for csrf token
app.all('*', (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.generateToken(req, res));
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Define a route to handle requests for your home page
app.get('/', (req, res) => {
    res.render('index', { title: 'OurSpace' });
});

app.get('/home', (req, res) => {
    const sessionCookie = req.cookies.session || '';
    
    admin.auth().verifySessionCookie(sessionCookie, true)
    .then(() => {
        res.render('index', { title: 'OurSpace' });
    }).catch((error) => {
        res.redirect('/login');
        // can change this later for another catch
        // only index due to the fact that we want to be able to see the home page
        // could handle within index
    });
});

app.post('/login', (req, res) => {
    const idToken = req.body.idToken.toString();
    const expirary = 60 * 60 * 24 * 5 * 1000; // 5 days

    admin.auth().createSessionCookie(idToken, { expirary })
        .then((sessionCookie) => {
            const options = { maxAge: expirary, httpOnly: true }; //httponly so can only be accessed by server
            res.cookie('session', sessionCookie, options);
            res.end(JSON.stringify({ status: 'success' }));
        }, (error) => {
            res.status(401).send('UNAUTHORIZED REQUEST!');
    });
});

// handle the cookie clear of the session, based on being logged out
app.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'OurSpace' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'OurSpace' });
});


exports.app = functions.https.onRequest(app);