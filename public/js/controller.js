let inactivityTimeout;

window.addEventListener("load", function () {
    inactivityTimeout = setTimeout(redirectToLogin, 3000);

    // Add event listeners to reset the timer on user activity
    document.addEventListener("mousemove", resetInactivityTimeout);
    document.addEventListener("keydown", resetInactivityTimeout);

    init();
});

function resetInactivityTimeout() {
    // Reset the inactivity timer whenever there is user activity
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(redirectToLogin, 3000);
}

function redirectToLogin() {
    window.location.href = '/login';
    localStorage.removeItem('currentUser');
}


function init() {
    bindEvents();

    // Initialize the postOperations.posts array with posts from localStorage
    postOperations.posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Initialize the postOperations.posts array with posts from localStorage
    userOperations.user = JSON.parse(localStorage.getItem('users')) || [];

    displaySideProfileUSername();
    checkCurrentUser();
}

//let auto = autoGen();

function bindEvents() {
    document.querySelector('#post-button').addEventListener('click', addPost);
    document.querySelector('#logout-button').addEventListener('click', logoutUser);
    document.querySelector('#login-button').addEventListener('click', loginUser);
    document.querySelector('#profile-button').addEventListener('click', gotoProfile);
}

function addPost(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    const user = JSON.parse(localStorage.getItem('currentUser')).username;
    const time = getCurrentTime();
    const id = generateUniqueId();
    const userId = JSON.parse(localStorage.getItem('currentUser')).id;

    // Create a new post object
    const newPost = new Post(id, user, title, text, time, userId);

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

function displayUser(user) {
    const userList = document.querySelector('.recommended-users');

    const postElement = document.createElement('div');
    postElement.classList.add('user');

    postElement.innerHTML = `
        <div class="recommended-user-profile">
            <img src="images/default-avatar.jpg" alt="Profile Picture" class="profile-picture">
            <div class="recommended-profile-text">
                <h4 id="recommended-profile-username-${user.username}">${user.username}</h4>
            </div>
            <button class="recommended-user-follow-button" id="follow-button-${user.username}">Follow</button>
        </div>
    `;

    userList.appendChild(postElement);
}


// Function to initialize and display existing posts
function displayExistingPosts() {
    const postList = document.querySelector('.post-list');

    // Loop through existing posts and display them
    for (const post of postOperations.posts) {
        displayPost(post);
    }
}

// Function to initialize and display recommended users
function displayRecommendedUsers() {
    const userList = document.querySelector('.recommended-users');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    for (const user of userOperations.users) {
        if (user.id !== currentUser.id && !followsUser(currentUser, user)) {
            displayUser(user);

            // Add an event listener to the "Follow" button for each recommended user
            const followButton = document.getElementById(`follow-button-${user.username}`);
            followButton.addEventListener('click', () => followUser(currentUser, user));
        }
    }
}


// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
    displayExistingPosts();
    displayRecommendedUsers();
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

function displaySideProfileUSername() {
    const userDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (userDetails) {
        document.getElementById('side-profile-username').textContent = userDetails.username;
    }
}

function logoutUser() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
        localStorage.removeItem('currentUser');
        window.location.href = '/register';
    }
}

function loginUser() {
    window.location.href = '/login';
}

function checkCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    const logoutBtn = document.getElementById('logout-button');
    const loginBtn = document.getElementById('login-button');
    const createPost = document.getElementById('create-post');
    if (currentUser) {
      logoutBtn.style.display = 'block';
      loginBtn.style.display = 'none';
      createPost.style.display = 'block';
    } else {
      logoutBtn.style.display = 'none';
      loginBtn.style.display = 'block';
      createPost.style.display = 'none';
    }
  }

  function followUser(currentUser, userToFollow) {
    // Add the userToFollow to the currentUser's following list
    currentUser.following.push(userToFollow);

    // Update the following list in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update the button text to show that the user is now following
    const followButton = document.getElementById(`follow-button-${userToFollow.username}`);
    followButton.textContent = 'Following';
    followButton.disabled = true; // Optionally, disable the button to prevent multiple follows

    pushCurrentUser();
}

//ensure that the user in currentUser has the same properties as itself in other places (users list)
function pushCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    for (const user of userOperations.users) {
        if (user.id === currentUser.id) {
            updateUsers(user.id, currentUser);
        }
    }
}

function updateUsers(userId, newUser) {
    const userIndex = userOperations.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        console.log("test");
        userOperations.users[userIndex] = newUser;
        localStorage.setItem('users', JSON.stringify(userOperations.users));
    }
  }

function followsUser(user1, user2) {
    for (const user of user1.following) {
        if (user.id === user2.id) {
            console.log(user.id + " : " + user2.id);
            return true;
        }
    }
    return false;
}

function gotoProfile() {
    window.location.href = '/profile';
}
