// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/UI/Sidebar';
import Header from './Components/UI/Header';

// Pages Components
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
import Login from './Components/UI/Login';
import Signup from './Components/UI/Signup';
import Mapping from './Components/Pages/Mapping';
import ProtectedRoute from './Components/ProtectedRoute';
import TialorDhasboard from './Components/Tailor/TialorDhasboard';
import Main from './Components/UI/Main';
import Project from './Components/Tailor/Project';
import ProductPage from './Components/Tailor/ProductPage';
 

const App = () => {
  return (
    <BrowserRouter>
     <Routes>
    
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
       
            </Routes>
    
      <div>

        {/* Sidebar */}
      

        {/* Main Content Area */}
       
        

          <Routes>

            <Route
            // element={
            //   <ProtectedRoute allowedRoles={["super-admin"]} />
            // }
              path="/" element={<Main />} 
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ProductTable />} />
            <Route path="/measurement" element={<Measurement />} />
            <Route path="/user" element={<User />} />
            <Route path="/client" element={<Clients />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/type-size" element={<SizeType />} />
            <Route path="/order-project" element={<OrderProject />} />
            <Route path="/query" element={<Query />} />
            <Route path="/student" element={<Student />} />
            <Route path="/mapping" element={<Mapping />} />
            <Route path="/project" element={<Project />} />
            <Route path="/products/:id" element={<ProductPage />} />

            <Route path="/tailorlogs" element={<TailorLogs />} />
            </Route>
            <Route
            // element={
            //   <ProtectedRoute allowedRoles={[ "Tailor"]} />
            // }
          >
            <Route path="/tailor" element={<TialorDhasboard />} />
            
            </Route>
          </Routes>
        
      </div>
    </BrowserRouter>
  );
};

export default App;
