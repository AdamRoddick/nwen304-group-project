window.addEventListener("load", init);

function init() {
    bindEvents();
}

let auto = autoGen();

function bindEvents() {
    document.querySelector('#post-button').addEventListener('click', addPost);
}

function addPost() {
    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    const user = "John Smith" //Placeholder name
    const time = getCurrentTime();
    const id = generateUniqueId();

    //Create a new post object and add to posts list
    const newPost = new Post(id, user, title, text, time);
    postOperations.add(newPost);


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

function generateUniqueId() {
    // Generate a timestamp (numeric portion of the current time)
    var timestamp = new Date().getTime();
    // Generate a random 4-digit number
    var random = Math.floor(Math.random() * 10000);
    // Combine the timestamp and random number to create a unique ID
    var uniqueId = timestamp.toString() + random.toString();
    return uniqueId;
  }