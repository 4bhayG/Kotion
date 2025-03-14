"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { 
    CommandDialog,
    CommandGroup,
    CommandItem,
    CommandEmpty,
    CommandList,
    CommandInput
} from "./ui/command";

import { useSearch } from "@/hooks/use-Search";

export const SearchCommand = () => {
    const { user } = useUser();
    const router = useRouter();
    
    // Ensure Hooks are called unconditionally
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);
    const toggle = useSearch((store) => store.toggle);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle(); // Open/close search box with Ctrl + K
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [toggle]);

    // Fetch documents (ensure useQuery is used correctly)
    const documents = useQuery(api.documents.getSearch);

    // Only return `null` after all Hooks have been called
    if (!mounted) return null;

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    };

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder={`Search ${user?.fullName}'s Kotion`} />
            <CommandList>
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map((doc) => (
                        <CommandItem
                            key={doc._id}
                            value={`${doc._id}-${doc.title}`}
                            onSelect={() => onSelect(doc._id)}
                        >
                            {doc.icon ? (
                                <p className="mr-2 text-[18px]">{doc.icon}</p>
                            ) : (
                                <File className="mr-2 h-4 w-4" />
                            )}
                            <span>{doc.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
