"use client";
import {
    Dialog ,
    DialogContent ,
    DialogHeader
} from "@/components/ui/dialog" ;

import { SingleImageDropzone } from "../single-image-dropzone";

import { useCoverImage } from "@/hooks/use-cover-image";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = ()=> {

  const params = useParams();
  const [file , setFile] = useState<File>();

  const [submiting , setSubmiting] = useState(false); 
  const { edgestore }  = useEdgeStore();

  const update = useMutation(api.documents.update);

  const onClose = ()=>{
    setFile(undefined);
    setSubmiting(false);
    coverImage.onClose();
}

  const onChange = async (newFile ? : File) => {

      if(newFile)
      {
        
        setSubmiting(true);
        setFile(newFile);

        
        console.log("File Upload Gonna Start");
        

        
          
          const  res  = await edgestore.publicFiles.upload({
            file: newFile  ,
            options : {
              replaceTargetUrl : coverImage.url
            }
          });
        
        
        console.log("FILE ULOADED " , res);
        await update({
          id : params.documentId as Id<"documents"> ,
          coverImage : res.url 
        });
         
         
        
      }

      onClose();
  };

 

    const coverImage = useCoverImage();
    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-center text-lg font-semibold">
              Cover Image
            </h2>
            <div>
              <SingleImageDropzone className="w-full outline-none"
              disabled={submiting}
              value={file}
              onChange={onChange}

              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
}