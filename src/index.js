import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let users = [{
    id:'1',
    name:'Jozimar',
    email:'jozimar@mail.com',
    age:29
},{
    id:'2',
    name:'Sarah',
    email:'sarah@mail.com'
},{
    id:'3',
    name:'Mike',
    email:'mike@mail.com'
}]

let posts = [{
    id:'10',
    title:'GraphQL 101',
    body:'This is an advanced GraphQL post...',
    published:true,
    author:'1'
},{
    id:'11',
    title:'GraphQL 201',
    body:'This is an advanced GraphQL post...',
    published:false,
    author:'1'
},{
    id:'12',
    title:'Programming Music',
    body:'',
    published:false,
    author:'2'
}]

let comments = [{
    id: '102',
    text:'This worked well for me. Thanks!',
    author:'3',
    post:'10'
},{
    id: '103',
    text:'Glad you enjoyed it.',
    author:'1',
    post:'10'
},{
    id: '104',
    text:'This didnot work.',
    author:'2',
    post:'11'
},{
    id: '105',
    text:'Nevermind. I got it to work',
    author:'2',
    post:'11'
}];

const typeDefs = `
    type Query {
        users(query:String):[User!]!
        posts(query:String):[Post!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data:CreateUserInput!):User!
        deleteUser(id:ID!):User!
        createPost(data: CreatePostInput!):Post!
        createComment(data:CreateCommentInput!):Comment!
    }

    input CreateUserInput {
        name:String!
        email:String!
        age:Int
    }

    input CreatePostInput {
        title: String! 
        body: String! 
        published: Boolean! 
        author: ID!
    }

    input CreateCommentInput {
        text:String!
        author:ID!
        post:ID!
    }

    type User {
        id:ID!
        name:String!
        email:String!
        age:Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author: User!
        comments:[Comment!]!
    }

    type Comment {
        id:ID!
        text:String!
        author: User!
        post:Post!
    }
`

const resolvers = {
    Query: {
        users(parent,args,ctx,info){
            if(!args.query){
                return users;
            }
            return users.filter((user) => user.email.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent,args,ctx,info){
            if(!args.query){
                return posts;
            }
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            })
        },
        comments(parent,args,ctx,info){
            return comments;
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
                body:'',
                published:false
            }
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            const emailTaken = users.some(u => u.email === args.data.email);
            if(emailTaken)
                throw new Error('Email taken.')
            
            const user = {
                id:uuidv4(),
                ...args.data
            }
            users.push(user);
            return user;
        },
        deleteUser(parent,args,ctx,info){
            const userIndex = users.findIndex((user) => user.id === args.id);
            if(userIndex === -1)
                throw new Error('User not found');

            const deletedUsers = users.splice(userIndex,1);
            posts = posts.filter(post => {
                const match = post.author === args.id;
                if(match){
                    comments = comments.filter(comment => comment.post !== post.id)
                }
                return !match;
            });
            comments = comments.filter(comment => comment.author != args.id)
            return deletedUsers[0];

        },
        createPost(parent,args,ctx,info){
            const userExist = users.some(u => u.id === args.data.author);
            if(!userExist)
                throw new Error('User not found')
            const post = {
                id:uuidv4(),
                ...args.data
            }

            posts.push(post);
            return post;
        },
        createComment(parent,args,ctx,info){
            const userExistis = users.some(u => u.id === args.data.author);
            const postExistis = posts.some(p => p.id === args.data.post && p.published);

            if(!userExistis || !postExistis){
                throw new Error('Unable to find user and post')
            }

            const comment = {
                id:uuidv4(),
                ...args.data
            };
            comments.push(comment);
            return comment;
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find((user) => user.id === parent.author);
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment) => comment.id === parent.post);
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user) => user.id === parent.author);
        },
        post(parent,args,ctx,info){
            return posts.find((post) => post.id == parent.post);
        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post) => post.author === parent.id); 
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment) => comment.author === parent.id);
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})