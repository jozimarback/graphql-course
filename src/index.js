import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

const resolvers = {
    Query: {
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users;
            }
            return users.filter((user) => user.email.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts;
            }
            return db.posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments;
        },
        me() {
            return {
                id: '123099',
                name: 'Jozimar',
                email: 'jozimar@email.com',
                age: 29
            }
        },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    },
    Mutation: {
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
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => user.id === parent.author);
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => comment.id === parent.post);
        }
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => user.id === parent.author);
        },
        post(parent, args, { db }, info) {
            return db.posts.find((post) => post.id == parent.post);
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter((post) => post.author === parent.id);
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => comment.author === parent.id);
        }
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})