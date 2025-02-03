import React from 'react';
import logo from "../../Assets/logo.jpeg";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { MdMenu } from 'react-icons/md';

// import adminImage from "../../Assets/admin.jpeg"; // Add your admin image here

const Header = ({isSidebarOpen, setIsSidebarOpen}) => {
  const {user} = useAuth()
  return (
    <header className="w-[95%] mt-3 mx-auto bg-white shadow-md rounded-sm">
      <div className="flex items-center justify-between p-3"> {/* Reduced padding */}
        {/* Left side: Logo */}
        {/* <img src={logo} alt="Logo" className="h-8 object-contain" /> Reduced logo height */}
        {!isSidebarOpen && <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className=' text-primary text-3xl flex justify-center items-center'>
        <MdMenu />
        </button>}
        <h1 className="text-primary text-lg md:text-2xl capitalize font-medium mr-auto">BUZZ UMS</h1>

        {/* Right side: Admin Image */}
        <Link
          to="/"
          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition duration-300 ease-in-out"
        >
          <img
            src="" // Add Admin Image source here
            // alt=""
            className="h-6 w-6 rounded-full object-cover border border-gray-300"  
          />
          <div>
            <p className="text-xs font-semibold capitalize text-gray-800">{user?.name}</p> {/* Reduced text size */}
            <p className="text-xs text-gray-600 uppercase">{user?.role}</p> {/* Reduced sub-text size */}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
