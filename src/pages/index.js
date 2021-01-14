import React,{useState} from "react"
import {useQuery,useMutation} from '@apollo/client'
import gql from 'graphql-tag'
const Get_Books=gql
`
    {
      allBook{
          id
          title 
          url
          description
        }
     }
`;
const Add_Books=gql
`
    mutation addBook($title: String!, $url: String!, $description: String!){
        addBook(title: $title, url: $url, description: $description){
              title
              url
              description
        }
    }
`;
const DeletTodo=gql
`
     mutation deletBook($id: ID!){
      deletBook(id:$id){
          title
          url
          description
       }
     }
`
const IndexPage = () => {
    const [titlevalue,SetTitle]=useState("");
    const [urlvalue,SetUrl]=useState("");
    const [desc,SetDesc]=useState("");
   const {error,loading,data}=useQuery(Get_Books)

   const [addBook]=useMutation(Add_Books)
   const [deletBook]=useMutation(DeletTodo)
   const handleSubmit=(event)=>{
    event.preventDefault();
    console.log(titlevalue,urlvalue,desc)
    addBook({
        variables: {
          title:titlevalue,
          url: urlvalue,
          description:desc
            
        },
        refetchQueries: [{ query: Get_Books }]
    })
    SetTitle("")
    SetDesc("")
    SetUrl("")
   };
   const handleDelete=(id)=>{
          console.log(id,"id")
          deletBook({
            variables: {
              id:id,
            },
            refetchQueries: [{ query: Get_Books }]
        }) 
   }
      if(error){
        return <h1>Error</h1>
      }
      if(loading){
        return <h1>Loading...</h1>
      }
      console.log(data)
   return (
    <div>
      Hello
      <form onSubmit={handleSubmit}> 
          <input type="text"
                 name="Title"
          value={titlevalue}
          onChange={(ev)=>SetTitle(ev.target.value)}
          placeholder="Enter Title"
          />
          <input type="text"
          name="Url" 
          value={urlvalue}
          onChange={(ev)=>SetUrl(ev.target.value)} 
          placeholder="Enter Url"/>
          <input type="text" 
          name="Desc"
          value={desc}
          onChange={(ev)=>SetDesc(ev.target.value)} 
          placeholder="Enter Description"
          />
           <input type="submit" value="Submit" />
      </form>
      <div>
          {
            data.allBook.map((book,key)=>{
              console.log(book)
              return(
                <div key={key}>
                  <h1>{book.title}</h1>
                  <p>{book.url}</p>
                  <p>{book.description}</p>
                  <button onClick={()=>handleDelete(book.id)}>Delete</button>
                </div>
              )
            })
          }
      </div>
    </div>
  )
}

export default IndexPage
