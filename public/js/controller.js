let inactivityTimeout;
const timeoutTime = 1800000; //30 minute minute timeout (1,800,000ms)

window.addEventListener("load", function () {
    inactivityTimeout = setTimeout(redirectToLogin, timeoutTime);

    // Add event listeners to reset the timer on user activity
    document.addEventListener("mousemove", resetInactivityTimeout);
    document.addEventListener("keydown", resetInactivityTimeout);

    init();
});

function resetInactivityTimeout() {
    // Reset the inactivity timer whenever there is user activity
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(redirectToLogin, timeoutTime);
}

function redirectToLogin() {
    fetch('/delete-logged-user', { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                // Document deleted successfully on the server
                window.location.href = '/login'; // Redirect the user
            } else {
                console.error('Failed to delete the user on the server');
            }
        })
        .catch(error => {
            console.error('Error during the server request:', error);
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

    // Initialize the postOperations.posts array with posts from Firestore
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

    //displayRecommendedUsers();
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

    getCurrentUser() // Fetch the user data asynchronously
        .then(user => {
            const time = getCurrentTime();

            const postData = {
                title,
                text,
                time,
                user: user, // Use the entire user object
            };

            fetch('/api/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then(response => {
                    if (response.ok) {
                        // Post created successfully, handle the response as needed
                        return response.json();
                    } else {
                        console.error('Failed to create the post on the server');
                    }
                })
                .then(data => {
                    // Handle the response data, which may contain the newly created post ID, if needed
                    console.log('New Post ID:', data.postId);
                    postOperations.posts.push({
                        title,
                        text,
                        user: user,
                        time,
                    });
                    // Call displayPost and pass the post object
                    displayPost({
                        title,
                        text,
                        user: user,
                        time,
                    });
                })
                .catch(error => {
                    console.error('Error during the server request:', error);
                });

            // Clear input fields
            document.querySelector('#post-title').value = '';
            document.querySelector('#post-text').value = '';
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


function displayPost(post) {
    const postList = document.querySelector('.post-list');

    // Create a new post element
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Extract the user and time from the post object
    const user = post.user.username; // Get the username from the user object in the post
    const time = post.time;

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
    getCurrentUser()
        .then(currentUser => {
            if (currentUser && currentUser.username) {
                const userList = document.querySelector('.recommended-users');

                // Filter out users who don't match the current user (by username)
                //only recommend the 5 most recently created users (Users at a similar time)
                const nonMatchingUsers = userOperations.users.filter(user => user !== currentUser.username).slice(-5);

                // Display the filtered list of users
                for (const username of nonMatchingUsers) {
                    const user = { username }; // Create a user object with the username
                    displayUser(user);

                    // Add an event listener to the "Follow" button for each recommended user
                    const followButton = document.getElementById(`follow-button-${username}`);
                    followButton.addEventListener('click', () => followUser(currentUser, user));
                }
            } else {
                console.log('User not logged in');
            }
        })
        .catch(error => {
            console.error('Error fetching current user data:', error);
        });
}



// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    //init();
    //displayExistingPosts();
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
     fetch('/api/get-username')
    .then(response => response.json()) // Parse the response JSON
    .then(data => {
      if (data.username) {
       
        // Now, userDetails is a JavaScript object containing the user data
        // Set the username in your 'side-profile-username' element
        document.getElementById('side-profile-username').textContent = data.username;
      } else {
        console.error('User not found');
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}

function createCurrentUserObject() {
    // Replace this URL with the actual endpoint URL
    const endpointUrl = '/api/get-username';

    fetch(endpointUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Retrieve the response as text
        })
        .then((data) => {
            try {
                // Parse the received string into a JSON object
                const jsonObject = JSON.parse(data);

                // 'jsonObject' now contains the JSON data
                return jsonObject;
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function logoutUser() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
        // DELETE request to the server to delete the 'loggedUser' document
        fetch('/delete-logged-user', { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    // Document deleted successfully on the server
                    window.location.href = '/login'; // Redirect the user
                } else {
                    console.error('Failed to delete the user on the server');
                }
            })
            .catch(error => {
                console.error('Error during the server request:', error);
            });
    }
}

function loginUser() {
    window.location.href = '/login';
}

function checkCurrentUser() {
    getCurrentUser().then(user => {
        const sideProfileUsername = document.getElementById('side-profile-username');
        const logoutBtn = document.getElementById('logout-button');
        const loginBtn = document.getElementById('login-button');
        const createPost = document.getElementById('create-post');

        if (user && user.username) {
            sideProfileUsername.textContent = user.username;
            logoutBtn.style.display = 'block';
            loginBtn.style.display = 'none';
            createPost.style.display = 'block';
        } else {
            sideProfileUsername.textContent = 'Guest';
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'block';
            createPost.style.display = 'none';
        }
    });
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
