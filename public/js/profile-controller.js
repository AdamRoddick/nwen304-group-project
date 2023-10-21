window.addEventListener("load", init);


function init() {
    bindEvents();

    // Initialize the postOperations.posts array with posts from localStorage
    postOperations.posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Initialize the postOperations.posts array with posts from localStorage
    userOperations.user = JSON.parse(localStorage.getItem('users')) || [];

}

function bindEvents() {

}

window.addEventListener("load", () => {
    init();
    displayExistingPosts();
    displayFollowerUsers();
    displayFollowingUsers();
});

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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Loop through existing posts and display them
    for (const post of postOperations.posts) {
        console.log(post);
        console.log(post.user.id + " : " + currentUser.id);
        if (post.userId === currentUser.id) {
            displayPost(post);
        }
    }
}

function displayFollowingUser(user) {
    const userList = document.querySelector('.following-users');

    const postElement = document.createElement('div');
    postElement.classList.add('user');

    postElement.innerHTML = `
        <div class="recommended-user-profile">
            <img src="images/default-avatar.jpg" alt="Profile Picture" class="profile-picture">
            <div class="recommended-profile-text">
                <h4 id="recommended-profile-username-${user.username}">${user.username}</h4>
            </div>
        </div>
    `;

    userList.appendChild(postElement);
}

function displayFollowingUsers() {
    const userList = document.querySelector('.following-users');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    for (const user of userOperations.users) {
        if (followsUser(currentUser, user)) {
            displayFollowingUser(user);
        }
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

function displayFollowerUser(user) {
    const userList = document.querySelector('.followers-users');

    const postElement = document.createElement('div');
    postElement.classList.add('user');

    postElement.innerHTML = `
        <div class="recommended-user-profile">
            <img src="images/default-avatar.jpg" alt="Profile Picture" class="profile-picture">
            <div class="recommended-profile-text">
                <h4 id="recommended-profile-username-${user.username}">${user.username}</h4>
            </div>
        </div>
    `;

    userList.appendChild(postElement);
}

function displayFollowerUsers() {
    const userList = document.querySelector('.followers-users');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    for (const user of userOperations.users) {
        if (followerUser(currentUser, user)) {
            displayFollowerUser(user);
        }
    }
}

function followerUser(user1, user2) {
    for (const user of user2.following) {
        if (user.id === user1.id) {
            console.log(user.id + " : " + user2.id);
            return true;
        }
    }
    return false;
}