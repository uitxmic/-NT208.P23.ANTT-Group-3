import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './NavigaBar';
import SalesChart from './SalesChart';
import Ad from './Ad';
import { FaUsers, FaBox, FaDollarSign, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="flex w-full flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính: Sidebar và Dashboard */}
      <div className="flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Header */}

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <div className='flex-col gap-4 mb-8 bg-white p-6 rounded-lg shadow-lg w-1/2 align-center'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='grid-col-2'>
                <Ad />
              </div>
            </div>         
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sales Details</h2>
              <select className="border p-2 rounded-lg">
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
            <SalesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;