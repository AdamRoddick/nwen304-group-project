window.addEventListener("load", init);

function init() {
    bindEvents();

    // Initialize the postOperations.posts array with posts from localStorage
    postOperations.posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Initialize the postOperations.posts array with posts from localStorage
    userOperations.user = JSON.parse(localStorage.getItem('users')) || [];
}

//let auto = autoGen();

function bindEvents() {
    document.querySelector('#post-button').addEventListener('click', addPost);
    document.querySelector('#register-form').addEventListener('submit', registerUser);
    document.querySelector('#login-form').addEventListener('submit', loginUser);
}

function addPost(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    const user = "John Smith"; // Placeholder name
    const time = getCurrentTime();
    const id = generateUniqueId();

    // Create a new post object
    const newPost = new Post(id, user, title, text, time);

    // Add the new post to the array
    postOperations.add(newPost);

    // Update the posts in localStorage
    localStorage.setItem('posts', JSON.stringify(postOperations.posts));

    // Display the new post on the website
    displayPost(newPost);

    // Clear input fields
    document.querySelector('#post-title').value = '';
    document.querySelector('#post-text').value = '';
}

function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('#registerUsername').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const id = generateUniqueId();

    // Create a new user object
    const newUser = new User(id, username, email, password);

    // Add the new user to the array
    userOperations.add(newUser);

    // Update the users in localStorage
    localStorage.setItem('users', JSON.stringify(userOperations.users));

    // Clear input fields
    document.querySelector('#registerUsername').value = '';
    document.querySelector('#registerEmail').value = '';
    document.querySelector('#registerPassword').value = '';

    // Redirect to index.html
    window.location.href = '../index.html';
}

function loginUser(event) {
    console.log('loginUser function called');
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('#loginUsername').value;
    const password = document.querySelector('#loginPassword').value;

    // Check if the email and password match a user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Login successful, redirect to index.html
        window.location.href = '../index.html';
    } else {
        // Login failed, display error message
        console.error('Invalid email or password');
    }
}


function displayPost(post) {
    const postList = document.querySelector('.post-list');

    // Create a new post element
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Construct the post HTML structure
    postElement.innerHTML = `
        <div class="post-header">
            <img src="images/default-avatar.jpg" alt="User Profile Picture" class="post-profile-picture">
            <div class="post-header-info">
                <h3 class="post-username">${post.user}</h3>
                <p class="post-time">${post.time}</p>
            </div>
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-text">${post.text}</p>
        </div>
    `;

    // Add the new post to the post list
    postList.appendChild(postElement);
}

// Function to initialize and display existing posts
function displayExistingPosts() {
    const postList = document.querySelector('.post-list');

    // Loop through existing posts and display them
    for (const post of postOperations.posts) {
        displayPost(post);
    }
}

// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
    displayExistingPosts();
});

function getCurrentTime() {
    // Create a new Date object to get the current date and time
    var currentDate = new Date();
    // Extract the current time components
    var hours = currentDate.getHours();     // Get the current hour (0-23)
    var minutes = currentDate.getMinutes(); // Get the current minute (0-59)
    var seconds = currentDate.getSeconds(); // Get the current second (0-59)
    // Format the time with leading zeros
    var formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    // Return the formatted time as a string
    return formattedTime;
}

function generateUniqueId() {
    // Generate a timestamp (numeric portion of the current time)
    var timestamp = new Date().getTime();
    // Generate a random 4-digit number
    var random = Math.floor(Math.random() * 10000);
    // Combine the timestamp and random number to create a unique ID
    var uniqueId = timestamp.toString() + random.toString();
    return uniqueId;
}