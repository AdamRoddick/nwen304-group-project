var admin = require("firebase-admin");

var serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nwen304-groupproject-9db15-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const functions = require('firebase-functions');

const http = require('http');
const express = require('express');
const app = express();

//const sessions = require('express-session');
const { initializeApp } = require('firebase-admin/app');

//firestore database
const db = admin.firestore();
let customerRef = db.collection("Login Details");
customerRef.get().then((QuerySnapshot) => {
    QuerySnapshot.forEach(document => {
        console.log(document.data());
    })
})

const path = require('path');
const ejs = require('ejs');
const { QuerySnapshot } = require("firebase-admin/firestore");


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
    const firestore = firebase.firestore();
    const loginCollection = firestore.collection('Login Details');
  
    loginCollection.get()
      .then(QuerySnapshot => {
        const loginDetails = [];
        QuerySnapshot.forEach(document => {
          const data = document.data();
          loginDetails.push({
            username: data.Username,
            password: data.Password,
          });
        });
        res.json(loginDetails);
      })
      .catch(error => {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).json({ error: 'Server error' });
      });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'OurSpace' });
});
  

app.get('/profile', (req, res) => {

    // Retrieve the username from local storage

    res.render('profile', {
        title: 'OurSpace',
        username: 'Username' //Database should fetch the actual username and other stuff
    });
});


exports.app = functions.https.onRequest(app);