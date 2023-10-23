class User {
    constructor(id, username, email, password, following) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.following = following || [];
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