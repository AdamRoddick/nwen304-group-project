const userOperations = {
    users:[],

    add(userObject) {
        this.users.push(userObject);
    },

    remove(userObject) {
        this.users.remove(userObject);
    }
}