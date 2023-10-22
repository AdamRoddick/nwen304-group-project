class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.status = 'Post your status!';
    }

    // Function to update the user's status
    updateStatus(newStatus) {
        this.status = newStatus;
    }
}