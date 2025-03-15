"use client";


import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import Toolbar from "@/app/(main)/_components/toolbar";
import Cover from "@/app/(main)/_components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/Editor";
import { useParams } from "next/navigation";



export default function DocumentIdPage(){

  const params = useParams();
  const documentId = params.documentId as Id<"documents"> ;

  const update = useMutation(api.documents.update);

 
  const document = useQuery(api.documents.getById, { documentId });

  if (document === undefined) {
    return (
      <div>
        <Cover.skeleton /> 
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

 
  if (document === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-bold">Document Not Found</p>
      </div>
    );
  }


  const onChange = (val: string) => {
    update({ id: documentId, content: val });
  };

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-3xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
}
