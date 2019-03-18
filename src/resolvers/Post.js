const post = {
    author(parent, args, { db }, info) {
        return db.users.find((user) => user.id === parent.author);
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => comment.id === parent.post);
    }
}
export {post as default}