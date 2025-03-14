import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc , Id } from "./_generated/dataModel";
import { use } from "react";


export const getSidebar = query({
    args : {
        parentDocument : v.optional(v.id("documents"))
    } ,

    handler : async (ctx , args) => {

        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;

        // Finding docs via index


        const documents = await ctx.db.query("documents")
        .withIndex("by_user_parent" , (q)=> {
            return q.eq("userId", userId)
                .eq("parentDocument", args.parentDocument);
        })
        .filter((q) => 
        q.eq(q.field("isArchived") , false))

        .order("desc")

        .collect();

        return documents;


}})

export const create = mutation({
    args  : {
        title : v.string() ,
        parentDocument : v.optional(v.id("documents"))
    } ,
    handler : async(ctx , args) => {

            const identity = await ctx.auth.getUserIdentity();

            if(!identity)
            {
                throw new Error("Not Authenticated");
            }

            const userId = identity.subject;
            const document = await ctx.db.insert("documents" , {
                title : args.title ,
                parentDocument : args.parentDocument ,
                userId : userId ,
                isArchived : false ,
                isPublished : false
            });

            return document;
    }
    
});


export const archiveFunc = mutation({
    args : {
        id : v.id("documents")
    },
    handler : async (ctx , args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) 
        {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject ;
        
        const exsistingDocument = await ctx.db.get(args.id);
        if(!exsistingDocument)
        {
            throw new Error("Not Found");
        }
        if(exsistingDocument.userId !== userId)
        {
            throw new Error("unAuthorised Access");
        }
        console.log("Reached Here..");
        // Recc function to Archive all child documents
        const reccursiveArchive = async(documentId : Id<"documents">)=>{ 
            const children = await ctx.db.query("documents") 
            .withIndex("by_user_parent" , (q)=> (
                q.eq("userId" , userId)
                .eq("parentDocument" , documentId)
            ))
            .collect();

            for(const child of children)
            {
                await ctx.db.patch(child._id , {
                    isArchived : true
                })

                 await reccursiveArchive(child._id);
            }
         }

         console.log("Gonna Call Archive")
        const documents = await ctx.db.patch(args.id , {
            isArchived : true
        }) ;

        // also archive its child documents
        reccursiveArchive(args.id);
        


    }
});

export const getArchived = query({
    handler : async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) 
        {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject ;

        const docs = await ctx.db.query("documents")
        .withIndex("by_user" , (q)=> q.eq("userId" , userId) )
        .filter((q)=> q.eq(q.field("isArchived") , true))
        .order("desc")
        .collect();
        

        return docs ;
    }
});

export const Restore = mutation({
    args : {
        id : v.id("documents")
    } ,
    handler : async ( ctx , args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) 
        {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject ;

        const docsExsist = await ctx.db.get(args.id);

        if(!docsExsist)
        {
            throw new Error("Not Found")
        }

        if( docsExsist.userId !== userId )
        {
            throw new Error("Unauthorised")
        }

        const options: Partial<Doc<"documents">> = {
            isArchived : false
        }

        const recursiveRestore = async (documentId:Id<'documents'>) => {
            const children = await ctx.db.query('documents')
            .withIndex('by_user_parent', (q) => (
              q.eq('userId',userId).eq('parentDocument',documentId)
            ))
            .collect()
      
            for (const child of children) {
              await ctx.db.patch(child._id,{
                isArchived:false
              })
      
              await recursiveRestore(child._id)
            }
          }


       if(docsExsist.parentDocument)
        {
            const parent = await ctx.db.get(docsExsist.parentDocument);

            if(parent?.isArchived)
            {
                options.parentDocument = undefined ;
            }
        } 
        
       const updatedDoc =  await ctx.db.patch(args.id , options);

        recursiveRestore(args.id);

        return updatedDoc;
    }
})


export const Remove = mutation({
    args : {
        id : v.id("documents")
     } ,
     handler : async (ctx , args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) 
        {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject ;

        const existDoc = await ctx.db.get(args.id);

        if(!existDoc)
        {
            throw new Error("Not Found");
        }

        if(existDoc.userId !== userId)
        {
            throw new Error("Not Authorised to do stuff")
        }

        const deletedDoc = await ctx.db.delete(args.id);



        return deletedDoc;

     }
});

export const getSearch = query({
    handler:async (ctx) => {
     
      const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error('Not authenticated')
      }
  
      const userId = identity.subject
      
     const documents = await ctx.db.query("documents")
     .withIndex("by_user" , (q) => q.eq("userId" , userId))
     .filter((q)=> 
    q.eq(q.field("isArchived") , false)
    )
    .order("desc")
    .collect();

    
      return documents;
    }
  })


  export const getById = query({
    args : {
        documentId : v.id("documents")
    } ,
    handler : async ( ctx , args) =>{
        const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error('Not authenticated')
      }
  
      const userId = identity.subject;

      const docs = await ctx.db.get(args.documentId);

      if(!docs)
      {
        throw new Error("Not Found");
      }

      if(docs.isPublished && !docs.isArchived)
      {
        return docs;
      }

      if(docs.userId !== userId)
        {
            throw new Error("Not Authorised to do stuff")
        }

        return docs;

    }
  });


  export const update = mutation({
    args:{
      id:v.id('documents'),
      title:v.optional(v.string()),
      content:v.optional(v.string()),
      coverImage:v.optional(v.string()),
      icon:v.optional(v.string()),
      isPublished:v.optional(v.boolean())
    },
    handler:async (context,args) => {
      const identity = await context.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Unauthenticated")
      }
  
      const userId = identity.subject
  
      const {id,...rest} = args ;
  
      const existingDocument = await context.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found")
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error('Unauthorized')
      }
  
      const document = await context.db.patch(args.id,{
        ...rest
      })
  
      return document
    }
  })


    export const removeIcon = mutation({
    args:{id:v.id('documents')},
    handler:async (context,args) => {
      const identity = await context.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Unauthenticated")
      }
  
      const userId = identity.subject
  
       const existingDocument = await context.db.get(args.id)
  
      if (!existingDocument) {
        throw new Error('Not found')
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized")
      }
  
      const document = await context.db.patch(args.id,{
        icon : undefined
      })
  
      return document;
    } 
  });


export  const removeCoverImage = mutation({
  args:{id:v.id('documents')},
  handler:async (context,args) => {
    const identity = await context.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthenticated")
    }

    const userId = identity.subject

     const existingDocument = await context.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const document = await context.db.patch(args.id,{
      coverImage : undefined
    })

    return document;
  } 
  })
  
