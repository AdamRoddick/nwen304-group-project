window.addEventListener("load", init);

function init() {
    bindEvents();

    // Initialize the postOperations.posts array with posts from localStorage
    userOperations.user = JSON.parse(localStorage.getItem('users')) || [];
}

//let auto = autoGen();

function bindEvents() {
    document.querySelector('#login-form').addEventListener('submit', loginUser);
}

function loginUser(event) {
    var { QuerySnapshot } = require('@google-cloud/firestore');
    var index = require('index.js');
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('#loginUsername').value;
    const password = document.querySelector('#loginPassword').value;

    /*// Check if the email and password match a user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Login successful, redirect to index.html
        window.location.href = '/';
    } else {
        // Login failed, display error message
        alert('Invalid username or password');
    }*/

    // Reference to "Login Details" collection in Firestore
    const customerRef = index.db.collection("Login Details");
    if(){
        console.debug("db collection notEmpty");
    }

    // Query Firestore to check if the username and password match
    customerRef.get().then((QuerySnapshot) => {
        QuerySnapshot.forEach(document => {
            const data = document.data();
            const user = data.Username;
            const pass = data.Password;

            if(user == username){
                if(pass == password){
                    window.location.href = '/';
                }
            }else{
                alert('Invalid username or password');
            }
        })
    })
}

// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
});