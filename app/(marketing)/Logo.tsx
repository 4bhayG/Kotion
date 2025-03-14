import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets : ['latin'] ,
    weight : ['400' , '600']
})


const Logo = () => {
    return ( 
        <div className="hidden md:flex items-center gap-x-2">
            <Image 
            // Todo : Add Logo Png of Kotion
            alt="Logo"
            src={"/logo.png"}
            height={"40"}
            width={"40"}
            className="dark:hidden"
            />
            <Image 
            // Todo : Add Logo Png of Kotion Dark Logo
            alt="Logo"
            src={"/logo.png"}
            height={"40"}
            width={"40"}
            className="hidden dark:block"
            />
            <p className={cn("font-semibold" , font.className)}>
                Kotion
            </p>
        </div>
     );
}
 
export default Logo;