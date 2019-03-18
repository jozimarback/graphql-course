import uuidv4 from 'uuid/v4'

const mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(u => u.email === args.data.email);
        if (emailTaken)
            throw new Error('Email taken.')

        const user = {
            id: uuidv4(),
            ...args.data
        }
        db.users.push(user);
        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id);
        if (userIndex === -1)
            throw new Error('User not found');

        const deletedUsers = db.users.splice(userIndex, 1);
        posts = db.posts.filter(post => {
            const match = db.post.author === args.id;
            if (match) {
                comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match;
        });
        comments = db.comments.filter(comment => comment.author != args.id)
        return deletedUsers[0];

    },
    createPost(parent, args, { db }, info) {
        const userExist = db.users.some(u => u.id === args.data.author);
        if (!userExist)
            throw new Error('User not found')
        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);
        return post;
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)
        if (postIndex === -1)
            throw new Error('Post not found')
        const deletedPosts = db.posts.splice(postIndex, 1);
        comments = db.comments.filter(comment => comment.post !== args.id);
        return deletedPosts[0];
    },
    createComment(parent, args, { db }, info) {
        const userExistis = db.users.some(u => u.id === args.data.author);
        const postExistis = db.posts.some(p => p.id === args.data.post && p.published);

        if (!userExistis || !postExistis) {
            throw new Error('Unable to find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (commentIndex === -1)
            throw new Error('Comment not found')
        const deletedComments = db.comments.splice(commentIndex, 1);
        return deletedComments[0]
    }
};

export {mutation as default}