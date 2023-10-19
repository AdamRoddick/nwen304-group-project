window.addEventListener("load", init);

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

    // Check if password meets requirement, and returns the evaluations
    //const meetsRequirement = passwordOperations.evaluateRequirements(password);
    //const meetsRequirementString = passwordOperations.checkRequirements(password);

    //const evaluateStrength = passwordOperations.checkComplexity(password);


    const id = generateUniqueId();

    // document.querySelector('#registerPasswordStrength').value = evaluateStrength;

    // Create a new user object
    /*if (!meetsRequirement) {
        alert(meetsRequirementString);
        return;
    } else {
        const newUser = new User(id, username, email, password);
    }*/
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

    // Redirect to index.html
    window.location.href = '/';
}

// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
});

function generateUniqueId() {
    // Generate a timestamp (numeric portion of the current time)
    var timestamp = new Date().getTime();
    // Generate a random 4-digit number
    var random = Math.floor(Math.random() * 10000);
    // Combine the timestamp and random number to create a unique ID
    var uniqueId = timestamp.toString() + random.toString();
    return uniqueId;
}