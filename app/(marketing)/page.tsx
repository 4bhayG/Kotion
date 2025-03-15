
import Heading from "./heading";
import Heroes from "./heroes";
import Footer from "./Footer";


const MarketingPage =()=> {
  return (
   
   <div className="min-h-full flex flex-col">
    <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 dark:bg-[#1F1F1F]">
      <Heading/>
      <Heroes />
      <Footer />
    </div>
   </div>
    
  );
}

export default MarketingPage;
