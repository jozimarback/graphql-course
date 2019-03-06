import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const users = [{
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

const posts = [{
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

const comments = [{
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
        createUser(name:String!,email:String!,age:Int):User!
        createPost(title: String!, body: String!, published: Boolena!, author: ID!):Post!
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
            const emailTaken = users.some(u => u.email === args.email);
            if(emailTaken)
                throw new Error('Email taken.')
            
            const user = {
                id:uuidv4(),
                name:args.name,
                email:args.email,
                age:args.age
            }
            users.push(user);
            return user;
        },
        createPost(parent,args,ctx,info){
            const userExist = users.some(u => u.id === args.author);
            if(!userExist)
                throw new Error('User not found')
            const post = {
                id:uuidv4(),
                title:args.title,
                body:args.body,
                published:args.published,
                author:args.author
            }

            posts.push(post);
            return post;
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