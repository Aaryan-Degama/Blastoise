import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import { Outlet, useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Main",
  "/tierlist": "Tier Lists",
  // add more routes here as you build more pages
};

const App = () => {
  const location = useLocation(); 
  const title = pageTitles[location.pathname] || "Main"; 

  return (
    <div className="flex bg-black text-white h-screen w-full">
      
      {/* Sidebar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 py-[10px] overflow-hidden text-white">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2A2A2A]">
          <h1 className="text-lg font-semibold">{title}</h1> 
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 text-gray-400 flex-1">
            <Outlet />
          </div>
          <Footer />
        </div>
        
      </div>
    </div>
  );
};

export default App;