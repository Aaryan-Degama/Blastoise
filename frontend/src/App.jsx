import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import { Outlet } from "react-router-dom";


const App = () => {
  return (
    <div className="flex bg-black text-white h-screen w-full">
      
      {/* Sidebar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 py-[10px] overflow-hidden text-white">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2A2A2A]">
          <h1 
          className="text-lg font-semibold">Main</h1>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          
          {/* The Home page for now afterwards will implement routers for page change */}
          <div className="p-6 text-gray-400 flex-1">
            <Outlet />
          </div>
          
          {/* Footer */}
          <Footer />
          
        </div>
        
      </div>
    </div>
  );
};

export default App;