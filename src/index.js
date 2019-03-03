import { GraphQLServer } from 'graphql-yoga'

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
    published:true
},{
    id:'11',
    title:'GraphQL 201',
    body:'This is an advanced GraphQL post...',
    published:false
},{
    id:'12',
    title:'Programming Music',
    body:'',
    published:false
}

]


const typeDefs = `
    type Query {
        users(query:String):[User!]!
        posts(query:String):[Post!]!
        me: User!
        post: Post!
    }

    type User {
        id:ID!
        name:String!
        email:String!
        age:Int
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
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
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})