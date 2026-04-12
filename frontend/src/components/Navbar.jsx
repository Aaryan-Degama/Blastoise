import React, { useState } from "react";
import {
  Home,
  Layers,
  BarChart2,
  Bookmark,
  Search,
  Settings,
} from "lucide-react";
// Make sure this path matches where you stored the image
import blastoiseLogo from "../assets/blastoise_logo.png"; 

const Navbar = () => {
  const [active, setActive] = useState("Main");

  const menu = [
    { name: "Main", icon: <Home size={22} /> },
    { name: "Collections", icon: <Layers size={22} /> },
    { name: "Tier Lists", icon: <BarChart2 size={22} /> },
    { name: "Wishlist", icon: <Bookmark size={22} /> },
    { name: "Search", icon: <Search size={22} /> },
    { name: "Settings", icon: <Settings size={22} /> },
  ];

  return (
    // Changed pt-8 to pt-12 to push the logo further down from the top edge
    <div className="h-screen w-[84px] bg-[#121212] flex flex-col items-center pt-12 pb-6 border-r border-[#2A2A2A]">
      
      {/* Blastoise Logo - Increased bottom margin to mb-12 */}
      <div className="mb-12">
        <img 
          src={blastoiseLogo} 
          alt="Blastoise" 
          style={{
            width: "56px",
            height: "56px",
            objectFit: "contain",
            borderRadius: "50%",
            paddingTop: '10px'
          }}
        />
      </div>

      {/* Menu Items - Increased gap-8 to gap-12 to space icons further apart */}
      <div className="flex flex-col gap-12 w-full"
      style={{
      }}>
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            className="flex flex-col items-center cursor-pointer group"
            style={{
              paddingTop: '15px'
            }}
          >
            {/* Icon */}
            <div
              className={`transition-colors duration-200 ${
                active === item.name 
                  ? "text-[#1480d9]" 
                  : "text-[#737373] group-hover:text-gray-300" 
              }`}
            >
              {item.icon}
            </div>
            
            {/* Text Label */}
            <span 
              className={`mt-1.5 text-[11px] font-medium transition-colors duration-200 ${
                active === item.name 
                  ? "text-[#1480d9]" 
                  : "text-[#737373] group-hover:text-gray-300"
              }`}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Navbar;