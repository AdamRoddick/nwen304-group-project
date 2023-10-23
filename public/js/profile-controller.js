window.addEventListener("load", init);


function init() {
    bindEvents();

    // Initialize the postOperations.posts array with posts from Firestore
    fetch('/api/get-posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            postOperations.posts = posts || [];
            console.log(posts);
            displayExistingPosts();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });

    // Fetch user data from Firestore, excluding 'loggedUser'
    fetch('/api/get-users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(users => {
            userOperations.users = users || []; // Initialize with retrieved user data or an empty array
            console.log(users);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
        displayProfileUSername();


}

function displayProfileUSername() {
    fetch('/api/get-username')
   .then(response => response.json()) // Parse the response JSON
   .then(data => {
     if (data.username) {
       // Now, userDetails is a JavaScript object containing the user data
       // Set the username in your 'profile-username' element
       document.getElementById('profile-username').textContent = data.username;
     } else {
       console.error('User not found');
     }
   })
   .catch(error => {
     console.error('Error fetching user data:', error);
   });
}

function getCurrentUser() {
    return fetch('/api/get-username')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        });
}

function bindEvents() {

}

window.addEventListener("load", () => {
    init();
    displayExistingPosts();
    //displayFollowerUsers();
    //displayFollowingUsers();
});

function displayPost(post) {
    const postList = document.querySelector('.post-list');

    // Create a new post element
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Initialize user and time
    let user, time;

    // Fetch user data asynchronously
    getCurrentUser()
        .then(userData => {
            user = userData.username;

            // Create a new Date object to get the current date and time
            const currentDate = new Date();
            // Extract the current time components
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();
            // Format the time with leading zeros
            time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Construct the post HTML structure with user and time
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="images/default-avatar.jpg" alt="User Profile Picture" class="post-profile-picture">
                    <div class="post-header-info">
                        <h3 class="post-username">${user}</h3>
                        <p class="post-time">${time}</p>
                    </div>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-text">${post.text}</p>
                </div>
                <button class="post-button" id="edit-button">Post</button>
            `;

            // Add the new post to the post list
            postList.appendChild(postElement);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

// Function to initialize and display existing posts
function displayExistingPosts() {
    const postList = document.querySelector('.post-list');

    let user;
    getCurrentUser()
        .then(userData => {
            user = userData.username;
            // Loop through existing posts and display them
            for (const post of postOperations.posts) {


                if (post.user.username === user) {
                    displayPost(post);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });


}

function displayFollowingUser(user) {
    const userList = document.querySelector('.following-users');
    const userElement = document.createElement('div');
    userElement.classList.add('user');

    userElement.innerHTML = `
        <div class="recommended-user-profile">
            <img src="images/default-avatar.jpg" alt="Profile Picture" class="profile-picture">
            <div class="recommended-profile-text">
                <h4 id="recommended-profile-username-${user.username}">${user.username}</h4>
            </div>
        </div>
        <button class="unfollow-button" data-user-id="${user.id}">Unfollow</button>
    `;

    userList.appendChild(userElement);

    const unfollowButton = userElement.querySelector('.unfollow-button');
    unfollowButton.addEventListener('click', () => unfollowUser(user));
}

function unfollowUser(userToUnfollow) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Remove the userToUnfollow from the current user's following list
    currentUser.following = currentUser.following.filter(user => user.id !== userToUnfollow.id);

    // Save the updated user information in local storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Remove the displayed user from the following list
    const userElement = document.querySelector(`#recommended-profile-username-${userToUnfollow.username}`).parentElement.parentElement;
    userElement.remove();
    updateUsers(userToUnfollow.id, currentUser);
}

function updateUsers(userId, newUser) {
    const userIndex = userOperations.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        console.log("test");
        userOperations.users[userIndex] = newUser;
        localStorage.setItem('users', JSON.stringify(userOperations.users));
    }
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