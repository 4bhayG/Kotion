import Image from "next/image";

const Heroes = () => {
    return ( 
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                    <Image 
                    fill
                    src={"/documents.png"}
                    className="object-contain dark:hidden"
                    alt="Documents"
                    />
                    <Image 
                    fill
                    src={"/documents-dark.png"}
                    className="object-contain hidden dark:block"
                    alt="Documents"
                    />
                </div>
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    <Image 
                    fill
                    src={"/reading.png"}
                    alt="Reading"
                    className="object-contain dark:hidden"
                    />
                    <Image 
                    fill
                    src={"/reading-dark.png"}
                    alt="Reading"
                    className="object-contain hidden dark:block"
                    />
                </div>
            </div>
        </div>
     );
}
 
export default Heroes;