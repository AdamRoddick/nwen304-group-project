const postOperations = {
    posts:[],

    add(postObject) {
        this.posts.push(postObject);
    },

    remove(postObject) {
        this.posts.remove(postObject);
    }
}