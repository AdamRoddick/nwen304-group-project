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


// Define the login route to handle authentication(WORKING!!!!!!!!!!)
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const customerRef = db.collection('Users');
    const loggedUserRef = db.collection('Users').doc('loggedUser'); // Specify the document ID

    customerRef.get()
        .then((querySnapshot) => {
            let authenticated = false;

            querySnapshot.forEach((document) => {
                const data = document.data();
                if (data.Username === username && data.Password === password) {
                    // Authentication successful, return a success response
                    authenticated = true;
                    res.json({ success: true });

                    // Create a new document in Firestore for the logged-in user
                    loggedUserRef.set({
                        Username: username,
                        Password: password
                    })
                        .then(() => {
                            console.log('Logged-in user added to Firestore');
                        })
                        .catch((error) => {
                            console.error('Error adding logged-in user to Firestore:', error);
                        });
                }
            });

            if (!authenticated) {
                // Authentication failed, return an error response
                res.json({ success: false });
            }
        })
        .catch((error) => {
            console.error('Error during login:', error);
            res.json({ success: false });
        });
});

app.post('/api/register', async (req, res) => {
    // Handle user authentication here, using Firebase Admin
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const addData = {
        Username: username,
        Password: password,
        Email: email,
    }
    const customerRef = db.collection("Users");

    try {
        const response = await db.collection("Users").add(addData);
        res.json({ success: true });
    } catch (error) {
        console.error('Error during registration:', error);
        res.json({ success: false });
    }
});

app.post('/api/db', async (req, res) => {
    try {
        const userRef = db.collection('Users').doc('loggedUser'); // Specify the document ID
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const username = userData.Username;
            res.json({ success: true, username });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user data from Firestore:', error);
        res.json({ success: false, message: 'An error occurred' });
    }
});

app.get('/api/get-username', async (req, res) => {
    // You need to have some way to identify the currently logged-in user, such as a session token or user ID.
    // Assuming you have a variable to identify the user, replace 'userIdentifier' with the actual identifier.

    const userIdentifier = 'loggedUser';

    const userDoc = await db.collection('Users').doc(userIdentifier).get();

    if (userDoc.exists) {
        const userData = userDoc.data();
        const username = userData.Username;
        res.json({ username });
    } else {
        res.json({ username: null }); 
    }
});



exports.app = functions.https.onRequest(app);