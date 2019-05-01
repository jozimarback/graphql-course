import uuidv4 from 'uuid/v4'
import { type } from 'os';

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
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find(user => user.id === id)
        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) {
                throw new Error('Email taken')
            }
            user.email = data.email
        }
        if (typeof data.name === 'string') {
            user.name = data.name
        }
        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }
        return user;
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
        if (args.data.publish) {
            pubsub.publish('post', {
                post: {
                    data: post,
                    mutation: 'CREATED'
                }
            });
        }
        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const post = db.post.find((post) => post.id === id);
        const originalPost = { ...post };
        if (!post) {
            throw new Error('Post not found')
        }
        if (typeof data.title == 'string') {
            post.title = data.title;
        }
        if (typeof data.body == 'string') {
            post.body = data.body;
        }
        if (typeof data.published == 'boolean') {
            post.published = data.published;
            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)
        if (postIndex === -1)
            throw new Error('Post not found')
        const [post] = db.posts.splice(postIndex, 1);
        comments = db.comments.filter(comment => comment.post !== args.id);
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
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
        pubsub.publish(`comment ${args.data.post}`, { comment })
        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (commentIndex === -1)
            throw new Error('Comment not found')
        const deletedComments = db.comments.splice(commentIndex, 1);
        return deletedComments[0]
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id == id);
        if (!comment) {
            throw new Error('Comment not found')
        }
        if (typeof data.text === 'string') {
            comment.text = data.text;
        }
        return comment;
    }
};

export { mutation as default }