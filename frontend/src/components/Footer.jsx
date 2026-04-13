import React from 'react';

function Footer() {
  return (
    <footer className="flex justify-center items-center px-6 py-4 border-t border-[#2A2A2A] text-sm text-gray-400 gap-8 text-[18px]">
      
      {/* Left Side - Copyright */}
      

      {/* Right Side - Links */}
      <div className="flex space-x-6">
        <div>
          &copy; {new Date().getFullYear()} &nbsp;&nbsp; Blastoise - All rights reserved
        </div>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Members
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Members
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          67
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Terms of Service
        </a>
        <a href="#" className="hover:text-white transition-colors duration-200">
          Contact Us
        </a>
      </div>
      
    </footer>
  );
}

export default Footer;