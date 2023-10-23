window.addEventListener("load", init);

var latitude;
var longitude;

function init() {
    bindEvents();
    // Initialize the postOperations.posts array with posts from localStorage
    userOperations.user = JSON.parse(localStorage.getItem('users')) || [];
}

//let auto = autoGen();

function bindEvents() {
    document.querySelector('#register-form').addEventListener('submit', registerUser);
}

function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('#registerUsername').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const confirm = document.querySelector('#confirmPassword').value;

    // Check if password meets requirement, and returns the evaluations

    const meetsRequirement = passwordOperations.evaluateRequirements(password);

    if (!meetsRequirement) {
        alert(passwordOperations.checkRequirements(password));
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }
    console.log(latitude + " - " + longitude);
    const userData = {
        username: username,
        email: email,
        password: password,

        latitude: latitude,
        longitude: longitude,
    };

    fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Registration was successful; you can handle success here
                // You might want to redirect the user to a different page
                alert('Registration successful!');
                window.location.href = '/'
            } else {
                // Registration failed; you can handle the failure here
                alert('Registration failed. Please try again.');
                window.location.href = '/register';
            }
        })
        .catch((error) => {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        });

    /*const id = generateUniqueId();

    const newUser = new User(id, username, email, password);

    // Add the new user to the array
    userOperations.add(newUser);

    // Update the users in localStorage
    localStorage.setItem('users', JSON.stringify(userOperations.users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Clear input fields
    document.querySelector('#registerUsername').value = '';
    document.querySelector('#registerEmail').value = '';
    document.querySelector('#registerPassword').value = '';
    document.querySelector('#confirmPassword').value = '';

    // Redirect to index.html
    window.location.href = '/';*/
}

// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
});

/**
 * Checks for the password complexity in the input field
 * 
 * @param {*} input 
 */
function checkPasswordComplexity(input) {
    const password = input.value
    const passwordComplexity = document.querySelector('#registerPasswordStrength');
    // Call the checkComplexity function from passwordOperations.js
    // and pass the password as an argument
    const passwordStrength = passwordOperations.checkComplexity(password);
    passwordComplexity.textContent = `Password Strength: ${passwordStrength}`;
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

// Add a function to get the user's location
function getLocation() {
    // Check if the Geolocation API is supported in the user's browser
    if ("geolocation" in navigator) {
        // Request permission to access the user's location
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude);

        }, function (error) {
            // Handle errors if the user denies access or if there's an issue with geolocation
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                default:
                    console.log("An unknown error occurred.");
            }
        });
    } else {
        console.log("Geolocation is not supported in this browser.");
    }
}

function updateUserLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            resolve();
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
