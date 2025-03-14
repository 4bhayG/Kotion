"use client";
// @ts-ignore
import {Navbar} from "@/app/(marketing)/Navbar";
import { cn } from "@/lib/utils";


import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings, Trash, Trash2, TrashIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ComponentRef, useEffect, useRef, useState } from "react";
import {useMediaQuery} from "usehooks-ts" ;
import UserItem from "./User-item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./Items";
import { toast } from "sonner";
import DocumentList from "@/components/document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrashBox } from "./Trash-box";
import { useSettings } from "@/hooks/use-settings";
// @ts-ignore
import {Navbar as Nav} from "../_components/navbar";
import { useSearch } from "@/hooks/use-Search";
import { useRouter } from "next/navigation";

const Navigation = () => {

    const search = useSearch();
    const router = useRouter();
    const settings = useSettings();
    const create = useMutation(api.documents.create);
    const params = useParams();

    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ComponentRef<"aside">>(null);
    const navBarRef = useRef<ComponentRef<"div">>(null);

    const [isReset , setisReset] = useState(false);
    const [collapsed , setCollapsed] = useState(false);

    const handleCreate = ()=>{
        const Promise = create({
            title : "Untitled"
        })
        .then((documentId)=>{router.push(`/documents/${documentId}`)});
        toast.promise(Promise , {
            loading : "Creating document" ,
            success : "Document created" ,  
            error : "Failed to create document"
        })
    }

    useEffect(()=>{
        if(isMobile)
        {
            collapse();
        }
        else
        {
            resetWidht();
        }
    } , [isMobile]);

    useEffect(()=>{
        if(isMobile)
        {
            collapse();
        }
    } , [pathname , isMobile]);



    const handleMouseDown = ( event : React.MouseEvent<HTMLDivElement , MouseEvent>) =>
    {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove" , handleMouseMove);
        document.addEventListener("mouseup" , handleMouseUp);
    
    }

    const handleMouseMove = (e : MouseEvent) => {
        if(!isResizingRef.current) return ;
        let newWidht = e.clientX;

        if( newWidht < 240) newWidht = 240;
        if(newWidht > 480 ) newWidht = 480;

        if(sidebarRef.current && navBarRef.current)
        {
            sidebarRef.current.style.width = `${newWidht}px`
            navBarRef.current.style.setProperty("left" , `${newWidht}px`);
            sidebarRef.current.style.setProperty("width" , `calc(100%-${newWidht}px)`);
        }
    }

    const resetWidht = () => {
        if(sidebarRef.current && navBarRef.current)
        {
            setCollapsed(false);
            setisReset(false);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navBarRef.current.style.setProperty("widht" , isMobile ? "0" : "calc(100% - 240px)");
            navBarRef.current.style.setProperty("left" , isMobile ? "100%" : "240px");
            setTimeout(()=> setisReset(false) , 300);
        }
    }

    const handleMouseUp = ()=>{
        isResizingRef.current = false;
        document.removeEventListener("mousemove" , handleMouseMove);
        document.removeEventListener("mouseup" , handleMouseUp);
    }

    const collapse = () => {
        if(sidebarRef.current && navBarRef.current)
        {
            setCollapsed(true);
            setisReset(true);

            sidebarRef.current.style.width = "0";
            navBarRef.current.style.setProperty("widht" ,"100%");
            navBarRef.current.style.setProperty("left" , "0");
            setTimeout(()=> setisReset(false) , 300);
        }
    }



    
    return ( 
        <>
            <aside
            ref={sidebarRef}
            className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isReset && "transition-all ease-in-out duration-300" ,
                isMobile && "w-0"
            )}>
            <div>
                <div
                onClick={collapse}
                role="button" className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100">
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <UserItem />
                <Item 
                label="Search" 
                icon={Search}
                isSearch = {true}
                onClick={search.onOpen}
                />
                <Item 
                label="Settings"
                icon={Settings}
                onClick={settings.onOpen}
                />

                <Item
                onClick = {handleCreate}
                label = "New page" 
                icon = {PlusCircle}
                />
            </div>

            


            
            <div className="mt-4">
                <DocumentList />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent 
                        className="p-0 w-72 " 
                        side={isMobile ? "bottom" : "right"}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>


                <div 
                onMouseDown={handleMouseDown}
                onClick={resetWidht}
                className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary right-0 top-0"/>
            </aside>   
            <div 
            ref={navBarRef}
            className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]" , isReset && "transition-all ease-in-out duration-300" , isMobile && "left-0 w-full")}
            >
                {!!params.documentId? (
                   <Nav
                   isCollapsed = {collapsed}
                   ResetWidth = {resetWidht}
                   />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                    {collapsed && <MenuIcon onClick={resetWidht} className="h-6 w-6 text-muted-foreground"/>}
                </nav>
                )}
                
            </div>     
        </>
     );
}
 
export default Navigation;