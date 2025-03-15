"use client";


import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {  useQuery } from "convex/react";

import Toolbar from "@/app/(main)/_components/toolbar";
import Cover from "@/app/(main)/_components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/Editor";

interface props {
    params: {
        documentId: Id<"documents">
    }
}


const DocumentIdPage = ({ params }: props) => {

    

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    if (document === undefined) {
        return (
            <div>
                 <Cover.skeleton />
                 <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10 ">
                    <div className="sapce-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-14 w-[80%]" />
                        <Skeleton className="h-14 w-[40%]" />
                        <Skeleton className="h-14 w-[60%]" />
                    </div>
                 </div>
            </div>
           
        )

    }

    if (document === null){
        return <div>Not Found</div>
    }


   
    return (
        <div className="pb-40">
            <Cover
            preview ={true}
            url = {document.coverImage }
            />
            <div className="md:max-w-3xl lg:max-w-3xl mx-auto">
                <Toolbar 
                preview={true}
                initialData={document}
                />
                <Editor
                    editable={false}
                    onChange = {()=>{}}
                    initialContent = {document.content}
                />
            </div>
        </div>

    )
};

export default DocumentIdPage;