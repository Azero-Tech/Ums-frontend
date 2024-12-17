import React from 'react';
import { AiOutlineUser , AiOutlineProject, AiOutlineBranches, AiOutlineFileDone, AiOutlineTeam } from 'react-icons/ai';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 mt-12   section ">
      {/* Manage Users */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">4</p>
          <h3 className="text-md font-semibold text-nowrap text-blue-600">Manage Users</h3>
        </div>
        <div className="text-blue-600 flex items-center justify-center">
          <AiOutlineUser  size={40} />
        </div>
      </div>

      {/* Manage Master Project */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">2</p>
          <h3 className="text-md font-semibold  text-nowrap text-green-600">Manage Master Project</h3>
        </div>
        <div className="text-green-600 flex items-center justify-center">
          <AiOutlineProject size={40} />
        </div>
      </div>

      {/* Total Branches */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">3</p>
          <h3 className="v font-semibold  text-nowrap text-yellow-600">Total Branches</h3>
        </div>
        <div className="text-yellow-600 flex items-center justify-center">
          <AiOutlineBranches size={40} />
        </div>
      </div>

      {/* Manage Order Project */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">5</p>
          <h3 className="text-md font-semibold  text-nowrap text-purple-600">Manage Order Project</h3>
        </div>
        <div className="text-purple-600 flex items-center justify-center">
          <AiOutlineFileDone size={40} />
        </div>
      </div>

      {/* Student */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">5</p>
          <h3 className="text-md font-semibold  text-nowrap text-red-600">Students</h3>
        </div>
        <div className="text-red-600 flex items-center justify-center">
          <AiOutlineTeam size={40} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;