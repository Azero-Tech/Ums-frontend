import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/UI/Sidebar';
import Dashboard from './Components/Pages/Dashboard';
import ProductTable from './Components/Pages/ProductTable';
import Measurement from './Components/Pages/Measurement';
import User from './Components/Pages/User';
import Clients from './Components/Pages/Clients';
import Branches from './Components/Pages/Branches';
import SizeType from './Components/Pages/SizeType';
import OrderProject from './Components/Pages/OrderProject';
import Query from './Components/Pages/Query';
import Student from './Components/Pages/Student';
import TailorLogs from './Components/Pages/TailorLogs';
import Header from './Components/UI/Header';

// Dummy components for demonstration
 

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen  bg-gray-50 text-black overflow-hidden">
        {/* Background Effects */}
        {/* <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div> */}

        {/* Sidebar */}
        <Sidebar />
         
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Header/>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="clients" element={<ProductTable />} />
            <Route path="measurement" element={<Measurement/>} />
            <Route path="user" element={<User/>} />
            <Route path="client" element={<Clients/>} />
            <Route path="branches" element={<Branches/>} />
            <Route path="type-size" element={<SizeType/>} />
            <Route path="order-project" element={<OrderProject/>} />
            <Route path="query" element={<Query/>} />
            <Route path="student" element={<Student/>} />
            <Route path="tailorlogs" element={<TailorLogs/>} />










            
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
