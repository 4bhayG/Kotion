"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface props{
    params : {
        documentId : Id<"documents">
    }
}
const DocumentIdPage = async ({ params} : props) => {

    const document = useQuery(api.documents.getById , {
        documentId : await params.documentId
    });

    if( document ===  undefined)
    {  
        return <div>
        Loading
       </div> 
       
    }
    if(document === null)
    {
        return <div>Not Found</div>
    }
    return (
        <div className="pb-40">
      <Cover url={document.coverImage}/>
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar initialData={document}/>
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
    )
}