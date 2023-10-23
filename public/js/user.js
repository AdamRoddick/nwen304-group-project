class User {
    constructor(id, username, email, password, following) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.status = 'Post your status!';
        this.following = following || [];
    }

    // Function to update the user's status
    updateStatus(newStatus) {
        this.status = newStatus;
    }
    

    followUser(user) {
        this.following.push(user);
    }

    unfollowUser(user) {
        const index = this.following.indexOf(user);
        if (index !== -1) {
            this.following.splice(index, 1);
        }
    }
}