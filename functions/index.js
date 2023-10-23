const functions = require('firebase-functions');
const express = require('express');
const app = express();
const session = require('express-session');
const cookie = require('cookie-session');
const FireBaseStore = require('connect-session-firebase')(require(session));
const http = require('http');
const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyAcL_a8tS4bvMXFAr6oHJcWHkyjVFiYzb4",
    authDomain: "nwen304-groupproject-9db15.firebaseapp.com",
    databaseURL: "https://nwen304-groupproject-9db15-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nwen304-groupproject-9db15",
    storageBucket: "nwen304-groupproject-9db15.appspot.com",
    messagingSenderId: "780741013383",
    appId: "1:780741013383:web:d216a031f2cccbddc22d22",
    measurementId: "G-TCLDG0Y66G"
};

// Initialise Firebase and ServiceAccount registration
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nwen304-groupproject-9db15-default-rtdb.asia-southeast1.firebasedatabase.app"
})

// Configure the session and cookie
const sessionConfig = {
    store: new FireBaseStore({
        database: admin.database()
    }),
    secret: 'boogieWonderland',
    resave: false,
    saveUnintialized: true,
    cookie: { 
        secure: true,
        maxAge: 86400000 // 24 hours
    },
};

const cookieConfig = {
    name: 'session',
    keys: ['boogieWonderland'],
    secure: true,
    maxAge: 86400000 // 24 hours
};

app.use(session(sessionConfig));
//app.use(express.json());

//const sessions = require('express-session');
const { initializeApp } = require('firebase-admin/app');

const path = require('path');
const ejs = require('ejs');


const port = process.env.PORT || 3000; // Use the specified port or 3000 by default

// Define the path to your static files (CSS, JavaScript, images, etc.)
const publicDirectoryPath = path.join(__dirname, '/public');

// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define routes to handle requests for pages
app.get('/login', (req, res) => {
    res.render('login', { title: 'OurSpace' });
});

app.post('/login', (req, res) => {
    // Check if the email and password match a user in Firebase
    admin.auth().getUserByEmail(req.body.email)
        .then((userRecord) => {
            // Login successful, redirect to index.html
            req.session.user = userRecord;
            res.redirect('/');
        })
        .catch((error) => {
            // Login failed, display error message
            res.render('login', { title: 'OurSpace', error: error });
        });
});

app.get('/logout', (req, res) => {
    // destroys the session and will unset the req.session property
    // security purposes
    req.session.destroy();
    res.redirect('/');
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'OurSpace' });
});


app.get('/', (req, res) => {
    if (req.session.user) { // if a user is logged in, pass user data to the view
        res.render('index', { title: 'OurSpace', user: req.session.user });
    } else {
        res.render('index', { title: 'OurSpace' });
    }
});

exports.app = functions.https.onRequest(app);