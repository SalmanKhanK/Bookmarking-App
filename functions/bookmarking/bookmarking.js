const { ApolloServer, gql } = require('apollo-server-lambda')

var faunadb=require("faunadb")
q=faunadb.query;

const typeDefs = gql`
  type Query {
    allBook: [Book!]
   }
  type Mutation {
    addBook(title:String!,url:String!,description:String!): Book
    deletBook(id: ID!): Book
  }
  type Book {
    id: ID!
    title: String!
    url: String!
    description:String!
  }
`
var adminClient=new faunadb.Client({secret:"fnAD92ORUHACB-5Rlv7tS-tNSyVyreWPPP20141u"});
const resolvers = {
  Query: {
    allBook: async() => {
        try{
          const result = await adminClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index('collectbooks'))),
              q.Lambda(x => q.Get(x))
            )
          )
          console.log(result.data)
          return result.data.map(v => {
            return {
              id: v.ref.id,
              title: v.data.title,
              url: v.data.url,
              description:v.data.description
            }
          })
  
        }
        catch(err){
          console.log(err)
        }
    },   
  },
  Mutation:{
      addBook:async(_,{title,url,description})=>{
            try{
              const result = await adminClient.query(
                q.Create(
                  q.Collection('allBooks'),
                  {
                    data: {
                      title,
                      url,
                      description
                    }
                  },
                )
              )
              return result.data.data
            }
            catch(err){
               console.log(err)
            }
      },
      deletBook: async(_,{id})=>{
        try{
          const result=await adminClient.query(
            q.Delete(q.Ref(q.Collection("allBooks"),id))
          )
          console.log(result)
          return result.data;
        }
        catch(err){
             console.log(err)
        }
      }  

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
