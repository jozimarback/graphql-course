import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
        me: User!
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