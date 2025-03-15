'use client'

import {PartialBlock} from '@blocknote/core'
import {useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from "@blocknote/mantine";


interface EditorProps{
  onChange:(value:string) => void
  initialContent?:string
  editable?:boolean
}


import "@blocknote/core/fonts/inter.css";

import "@blocknote/mantine/style.css";
import { useEdgeStore } from '@/lib/edgestore';
 

export default function Editor({
  onChange ,
  initialContent ,
  editable
} : EditorProps) {

    const { edgestore} = useEdgeStore();

    const handleUpload = async (file:File) => {
      const response = await edgestore.publicFiles.upload({file})
  
      return response.url
    }
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent : initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined ,
    uploadFile : handleUpload
  });
 
  
  return <BlockNoteView editor={editor} editable={editable} onChange={()=>{
    const data = JSON.stringify(editor.document);
    onChange(data);
  }} />;
}