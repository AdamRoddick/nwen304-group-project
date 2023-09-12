window.addEventListener("load", init);

function init() {
    bindEvents();
}

function bindEvents() {
    document.querySelector('#post-button').addEventListener('click', addPost);
}

function addPost() {
    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    const user = "John Smith" //Placeholder name
    const time = getCurrentTime();
}

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