import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    DropdownMenu, DropdownMenuTrigger,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useUser } from "@clerk/nextjs";

interface ItemProps {
    icon: LucideIcon,
    label: string,
    onClick?: () => void,
    id?: Id<"documents">,
    documentIcon?: string,
    active?: boolean,
    expanded?: boolean,
    isSearch?: boolean,
    level?: number,
    onExpand?: () => void
}



const Item = ({
    icon: Icon, label, onClick
    , active, documentIcon, expanded, isSearch, level = 0, onExpand, id
}: ItemProps) => {

    const { user } = useUser();

    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archiveFunc);


    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        event.stopPropagation();
        if(!id){ return ;}

        const promise = archive({id});
        toast.promise(promise , {
            loading : "Moving to Trash" ,
            success : "Success creating a new Note" ,
            error : "Failed to archive note"
        })

    }

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;
        const Promise = create({
            title: "Untitled",
            parentDocument: id
        })
            .then((documentId) => {
                if (!expanded) {
                    onExpand?.();

                }

                router.push( `documents/${documentId}`);
            });

        toast.promise(Promise, {
            loading: "Creating a new Note ...",
            success: "New note Created",
            error: "Error creating a new note"
        })

    }

    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onExpand?.(); // call func if given
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;


    return (
        <div
            onClick={onClick}
            role="button"
            // mathemattics to make dynamic indentation
            style={
                { paddingLeft: level ? `${level * 12 + 12}px` : "12px" }
            }
            className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium"
                , active && "bg-primary/5 text-primary")}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon
                        className="h-4 w-4 mr-2 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {
                documentIcon ? (
                    <div className="shrink-0 mr-2 text-[18px]">
                        {documentIcon}
                    </div>
                ) : (
                    <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
                )
            }

            <span className="truncate">
                {label}
            </span>


            {
                isSearch && (
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">Ctrl + K</span>
                    </kbd>
                )
            }
            {
                !!id && (
                    <div className="ml-auto flex items-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
              hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
                                <DropdownMenuItem onClick={onArchive}>
                                    <Trash className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="text-xs text-muted-foreground p-2">
                                    Last edited by: {user?.fullName}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            role="button"
                            onClick={onCreate}
                        >
                            <PlusIcon className="h-4 w-4 text-muted-foreground"></PlusIcon>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
    return (
        <div
            style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};



export default Item;  