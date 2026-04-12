import Navbar from "./components/Navbar";
// import Footer from "./components/Footer"; 


const App = () => {
  return (
    <div className="flex bg-black text-white h-screen w-full">
      
      {/* Sidebar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden text-white"
      style={{
        paddingLeft: '20px',
        color: 'white'
      }}>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2A2A2A]">
          <h1 
          className="text-lg font-semibold">Main</h1>

          
        </div>

        {/* Content - Added overflow-y-auto so ONLY this part scrolls */}
        <div className="flex-1 p-6 text-gray-400 overflow-y-auto">
          Content goes here...
          {/* Like the content will be like Movie cards from components */}
        </div>
        
      </div>
    </div>
  );
};

export default App;