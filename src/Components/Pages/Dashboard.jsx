import React, { useEffect, useState } from "react";
import {
  AiOutlineUser,
  AiOutlineProject,
  AiOutlineBranches,
  AiOutlineFileDone,
  AiOutlineTeam,
} from "react-icons/ai";
import { adminDashboard, tailorDashboard } from "../../apis/authApi";
import { useAuth } from "../context/AuthProvider";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState([]);
  const { user,setIsLoading } = useAuth();
  useEffect(() => {
    setIsLoading(true)
    if (user?.role === "super-admin") {
      adminDashboard()
        .then((res) => {
          setDashboard(res.data);
          setIsLoading(false)
        })
        .catch((err) => console.log(err));
    } else {
      tailorDashboard()
        .then((res) => {
          setDashboard(res.data);
          setIsLoading(false)
        })
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <>
      {user?.role === "super-admin" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 mt-12   section ">
          {/* Manage Users */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.tailors || 0}
              </p>
              <h3 className="text-md font-semibold text-nowrap text-blue-600">
                Total Tailors
              </h3>
            </div>
            <div className="text-blue-600 flex items-center justify-center">
              <AiOutlineUser size={40} />
            </div>
          </div>
          {/* Manage Master Project */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.industries || 0}
              </p>
              <h3 className="text-md font-semibold  text-nowrap text-green-600">
                Total Institutions
              </h3>
            </div>
            <div className="text-green-600 flex items-center justify-center">
              <AiOutlineProject size={40} />
            </div>
          </div>
          {/* Total Branches */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.branches}
              </p>
              <h3 className="v font-semibold  text-nowrap text-yellow-600">
                Total Branches
              </h3>
            </div>
            <div className="text-yellow-600 flex items-center justify-center">
              <AiOutlineBranches size={40} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.products || 0}
              </p>
              <h3 className="text-md font-semibold text-nowrap text-blue-600">
                Total Products
              </h3>
            </div>
            <div className="text-blue-600 flex items-center justify-center">
              <AiOutlineUser size={40} />
            </div>
          </div>
          {/* Manage Order Project */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.orders || 0}
              </p>
              <h3 className="text-md font-semibold  text-nowrap text-purple-600">
                Total Order Project
              </h3>
            </div>
            <div className="text-purple-600 flex items-center justify-center">
              <AiOutlineFileDone size={40} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 mt-12   section ">
          {/* Manage Users */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {dashboard.orders || 0}
              </p>
              <h3 className="text-md font-semibold text-nowrap text-blue-600">
                Total Projects
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
