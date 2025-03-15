"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Toolbar from "@/app/(main)/_components/toolbar";
import Cover from "@/app/(main)/_components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/Editor";

const DocumentIdPage = () => {
  // Get params from the URL using Next.js hook
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;
  
  const update = useMutation(api.documents.update);
  // Fetch document data
  const document = useQuery(api.documents.getById, { documentId });
  
  // Handle loading state
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
    return <div className="text-center text-red-500 font-bold">Document Not Found</div>;
  }
  
  const onChange = (val: string) => {
    update({
      id: documentId,
      content: val,
    });
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
};

export default DocumentIdPage;