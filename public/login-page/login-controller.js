window.addEventListener("load", init);

function init() {
  bindEvents();
}

function bindEvents() {
  document.querySelector('#login-form').addEventListener('submit', loginUser);
}

function loginUser(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const username = document.querySelector('#loginUsername').value;
  const password = document.querySelector('#loginPassword').value;

  // Make an AJAX request to the server's login API endpoint
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/'; // Successful login, redirect to home page
      } else {
        alert('Invalid username or password'); // Display an error message
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
    });
}


// Call the function to display existing posts when the page loads
window.addEventListener("load", () => {
    init();
});