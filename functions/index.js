// Firebase
const functions = require('firebase-functions');

const http = require('http');

// For hosting the application
const express = require('express');
const app = express();

// For parsing authentcation requests
const bodyParser = require('body-parser');

// For security 
// Cross Site Request Forgery
const csrf = require('csurf');
const csrfMiddleware = csrf({ cookie: true });

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
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Define a route to handle requests for your home page
app.get('/', (req, res) => {
    res.render('index', { title: 'OurSpace' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'OurSpace' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'OurSpace' });
});


exports.app = functions.https.onRequest(app);