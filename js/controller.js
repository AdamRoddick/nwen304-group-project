window.addEventListener("load", init);

function init() {
    bindEvents();
}

function bindEvents() {
    document.querySelector('#post-button').addEventListener('click', addPost);
}

function addPost() {
    const text = document.querySelector('#post-button').value;
}