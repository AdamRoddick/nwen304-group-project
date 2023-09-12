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
}