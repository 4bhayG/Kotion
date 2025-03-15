import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";

import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";

import { Skeleton } from "@/components/ui/skeleton";

interface CoverProps {
    url ? : string ,
    preview ? : boolean
}

const Cover = (
    {
        url , preview
    } : CoverProps
) => {


    const CoverImage = useCoverImage();
    const RemoveCoverImage = useMutation(api.documents.removeCoverImage);
    const params = useParams();

    const onRemove = async ()=> {
        if(url)
        {
            await edgestore.publicFiles.delete({
                url : url 
            })
        }

        RemoveCoverImage({
            id : params.documentId as Id<"documents">
        })
    }

    const { edgestore } = useEdgeStore();



    return ( 
        <div className={cn("relative w-full h-[35vh] group" , !url && "h-[12vh]" , url && "bg-muted")}>
            { !!url && (
                <Image
                src={url}
                fill
                alt="Cover"
                className="object-cover"
                />
            )}
            {
                url && !preview && (
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2" >
                        <Button
                        onClick={()=>{
                            CoverImage.onReplace(url);
                        }}
                        className="text-muted-foreground text-xs "
                        variant={"outline"}
                        size={"sm"}
                        >
                            Change Cover
                        </Button>
                        <Button
                        onClick={onRemove}
                        className="text-muted-foreground text-xs "
                        variant={"outline"}
                        size={"sm"}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove 
                        </Button>

                    </div>
                )
            }
        </div>
     );
}




Cover.skeleton = function CoverSkeleton (){
    return (
        <Skeleton className="w-full h-[12vh]" />
    )
}
 
export default Cover;
