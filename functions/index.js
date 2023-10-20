const functions = require('firebase-functions');

const http = require('http');
const express = require('express');
const app = express();

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

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'OurSpace' });
});


exports.app = functions.https.onRequest(app);