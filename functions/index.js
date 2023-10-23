const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
// Require the Firebase Admin setup from the firebaseAdmin.js file
const admin = require('./firebaseAdmin');
const passport = require('passport');

// Firestore database reference
const db = admin.firestore();

const port = process.env.PORT || 3000; // Use the specified port or 3000 by default

// Define the path to your static files (CSS, JavaScript, images, etc.)
const publicDirectoryPath = path.join(__dirname, '/public');

require('./auth');
app.use(session({
    secret: 'cats',
    resave: false,             // Add this line
    saveUninitialized: false,  // Add this line
}));
app.use(passport.initialize());
app.use(passport.session());


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

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    }));

app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello! ${req.user.displayName}`);
});

app.get('/logout/google', (req, res) => {
    req.logout();
    res.send('Logged out of Google Auth');
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
        Latitude: 0,
        Longitude: 0,
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

app.delete('/delete-logged-user', async (req, res) => {
    try {
        // Reference to the 'Users' collection
        const usersCollection = db.collection('Users');

        // Reference to the 'loggedUser' document
        const loggedUserDoc = usersCollection.doc('loggedUser');

        // Delete the 'loggedUser' document
        await loggedUserDoc.delete();

        res.status(204).send(); // Send a 204 No Content response on successful deletion
    } catch (error) {
        console.error('Error deleting the document:', error);
        res.status(500).json({ error: 'An error occurred while deleting the document' });
    }
});

app.get('/api/get-posts', async (req, res) => {
    try {
        const postsCollection = db.collection('Posts');
        const postsQuerySnapshot = await postsCollection.get();

        const posts = [];
        postsQuerySnapshot.forEach((doc) => {
            const post = doc.data();
            posts.push(post);
        });

        res.json(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
});

app.get('/api/get-users', async (req, res) => {
    try {
        const usersCollection = db.collection('Users');
        const querySnapshot = await usersCollection.get();
        const users = [];

        querySnapshot.forEach((doc) => {
            if (doc.id !== 'loggedUser') {
                const userData = doc.data();
                users.push(userData.Username);
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.post('/api/create-post', (req, res) => {
    const postsCollection = db.collection('Posts');
    const { title, text, user, time} = req.body;

    if (!title || !text || !user || !time) {
        return res.status(400).json({ message: 'Missing required data' });
    }

    const newPost = {
        title,
        text,
        user,
        time,
    };

    // Add the new post to Firestore
    postsCollection.add(newPost)
        .then((docRef) => {
            return res.status(201).json({ message: 'Post created successfully', postId: docRef.id });
        })
        .catch((error) => {
            return res.status(500).json({ message: 'Error creating the post', error: error.message });
        });
});

exports.app = functions.https.onRequest(app);