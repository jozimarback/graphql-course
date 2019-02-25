import {GraphQLServer} from 'graphql-yoga'

const typeDefs = `
    type Query {
        id:ID!
        name:String!
        age:Int!
        employed:Boolean!
        gpa:Float
    }
`

const resolvers={
    Query:{
        id(){
            return 'abc123'
        },
        name(){
            return 'Jozimar'
        },
        age(){
            return 30
        },
        employed(){
            return true
        },
        gpa(){
            return null
        }
    }
}


const server= new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})