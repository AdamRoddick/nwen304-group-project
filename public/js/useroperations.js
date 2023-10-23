const userOperations = {
    users: [],

    add(userObject) {
        this.users.push(userObject);
        localStorage.setItem('users', JSON.stringify(this.users));
    },

    remove(userObject) {
        this.users.remove(userObject);
        localStorage.setItem('users', JSON.stringify(this.users));
    }
};