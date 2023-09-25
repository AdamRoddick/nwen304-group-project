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
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.querySelector('#loginUsername').value;
    const password = document.querySelector('#loginPassword').value;

    // Check if the email and password match a user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Login successful, redirect to index.html
        window.location.href = '../index.html';
    } else {
        // Login failed, display error message
        alert('Invalid username or password');
    }
}

// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
});