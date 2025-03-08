"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Heading = () => {
    const { isAuthenticated , isLoading } = useConvexAuth();
    
    return (  
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas , Documents & Plans. Unified. Welcome to <span className="underline">Kotion</span> 
            </h1>
            <h3 className="text-base sm:test-xl md:text-2xl font-medium">
                Kotion is the connected workspace where better , faster works happens.
            </h3>
            {
                isLoading && (
                    <div className="flex flex-col items-center justify-center">
                        <Spinner size={"lg"} />
                    </div>
                )
            }
            {
                isAuthenticated && !isLoading && (
                    <Button asChild>
                        <Link href={"/documents"}>
                            Enter Kotion
                            <ArrowRight className="h-4 w-4 ml-2"/>
                        </Link>
                    </Button>
                )
            }
            {
                !isAuthenticated && !isLoading && (
                    <SignInButton>
                        <Button size={"lg"}>
                            Join Kotion
                        </Button>
                    </SignInButton>
                )
            }

           
        </div>
    );
}
 
export default Heading;