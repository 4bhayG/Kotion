"use client";

import { Doc } from "@/convex/_generated/dataModel";

import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { Image, Smile, X } from "lucide-react";
import { ComponentRef, useRef, useState } from "react";
import { init } from "next/dist/compiled/webpack/webpack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import TextAreaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps{
  initialData : Doc<"documents">
  preview ? : boolean
}

const Toolbar = (
  {
    initialData ,
    preview
  } : ToolbarProps
) => {

  const inputRef = useRef<ComponentRef<"textarea">>(null);

  const [isEditing , setisEditing] = useState(false);
  const [val , setVal] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableInput = () =>{
    if(preview) return ;
    setisEditing(true);

    setTimeout(()=>{
      setVal(initialData.title);
      inputRef.current?.focus();
    } , 0);
  };

  const disableInput = () => {
    setisEditing(false);
  };

  const onInput = (val : string) => {
      setVal(val);
      update({
        id : initialData._id ,
        title : val || "Untitled"
      });
  };

  const onKeyDown = (event : React.KeyboardEvent<HTMLTextAreaElement>) =>
  {
    if( event.key == "Enter")
    {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = ( icon : string) => {
    update({
      id : initialData._id ,
      icon 
    });

  }

  const onRemoveIcon = ()=>{
    removeIcon({
      id : initialData._id
    })
  };

  const coverImage = useCoverImage();




  return ( 
    <div className="pl-[54px] group relative">
      {
        !!initialData.icon && !preview && (
          <div className="flex items-center gap-x-2 group/icon pt-6">
            <IconPicker
              onChange={onIconSelect}
            >
              <p className="text-6xl hover:opacity-75 transition"></p>
                {initialData.icon}
            </IconPicker>
            <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      }
      {
        !!initialData.icon && preview && (
          <p className="text-6xl pt-6">
              {initialData.icon}
          </p>
        )
      }
      <div className="opacity-0 group-hover:opacity-100 glex items-center gap-x-1 py-4">
        {
          !initialData.icon && !preview && (
            <IconPicker asChild onChange={onIconSelect}>
              <Button className="text-muted-foreground text-xs"
              variant={"outline"}
              size={"sm"}
              >
                <Smile className="w-4 h-4 mr-2" />
                Add Icon
              </Button>
            </IconPicker>
          )
        }
        {
          !initialData.coverImage && !preview && (
            <Button className="text-muted-foreground text-xs"
            onClick={coverImage.onOpen}
            size={"sm"}
            variant={"outline"}
            >
              <Image className="h-4 w-4 mr-2" />
              Add Cover
            </Button>
          )
        }

      </div>
      {
        isEditing && !preview ? (
          <TextAreaAutosize ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={val}
          onChange={(e)=>{onInput(e.target.value)}}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          />
        ) : (
          <div className="pb-[11.5px] text-5xl font-bol break-words
          outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          onClick={enableInput}
          >
            {initialData.title}
          </div>
        )
      }
    </div>
   );
}
 
export default Toolbar;
