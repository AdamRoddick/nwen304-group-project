const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const ejs = require('ejs');

// Require the Firebase Admin setup from the firebaseAdmin.js file
const admin = require('./firebaseAdmin');

// Firestore database reference
const db = admin.firestore();

const port = process.env.PORT || 3000; // Use the specified port or 3000 by default

// Define the path to your static files (CSS, JavaScript, images, etc.)
const publicDirectoryPath = path.join(__dirname, '/public');

// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));

//to use body parts
app.use(express.json());

//to use cors for frontend framework
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define a route to handle requests for your home page
app.get('/', (req, res) => {
    res.render('index', { title: 'OurSpace' });
});

app.get('/login', async(req, res) => {
    res.render('login', { title: 'OurSpace' });
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


// Define the login route to handle authentication
app.post('/api/login', (req, res) => {
    // Handle user authentication here, using Firebase Admin
    const username = req.body.username;
    const password = req.body.password;

    const customerRef = db.collection("Users");

    customerRef.get().then((QuerySnapshot) => {
        QuerySnapshot.forEach(document => {
            const data = document.data();
            if (data.Username === username && data.Password === password) {
                // Authentication successful, return a success response
                res.json({ success: true });
                return;
            }
        });

        // Authentication failed, return an error response
        res.json({ success: false });
    }).catch(error => {
        console.error('Error during login:', error);
        res.json({ success: false });
    });
});

app.post('/api/', (req, res) => {
    // Handle user information here, using Firebase Admin
    const username = req.body.Username;
    const customerRef = db.collection("Users");

    customerRef.get().then((querySnapshot) => {
        let found = false;
        querySnapshot.forEach((document) => {
            const data = document.data();
            //if (data.Username === username) {
                // Found user referenced
                found = true;
                console.log("Followers:", data.Followers);
            //}
        });

        if (!found) {
            console.log("Followers not found since user does not exist");
        }
        
        
    }).catch((error) => {
        console.error('Error during login:', error);
        
    });
});

exports.app = functions.https.onRequest(app);