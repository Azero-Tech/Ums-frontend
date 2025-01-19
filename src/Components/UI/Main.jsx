import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
// import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Header from './Header'
// import SideMenu from './SideMenu'

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className='flex flex-1 h-screen'>
      {/* Fixed Menu on the left */}
      <div className='lg:w-[16rem]'>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      {/* Main Content Area */}
      <div className=' flex-1 flex w-full flex-col'>
        <Header className=''isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className='flex-1  mx-auto  md:max-w-screen-lg lg:max-w-screen-2xl min-w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Main