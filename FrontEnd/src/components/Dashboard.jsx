import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './NavigaBar';
import SalesChart from './SalesChart';
import { FaUsers, FaBox, FaDollarSign, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Nội dung chính: Sidebar và Dashboard */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total User</p>
                  <h2 className="text-2xl font-bold">40,689</h2>
                  <p className="text-green-500">8.5% Up from yesterday</p>
                </div>
                <FaUsers className="text-4xl text-blue-200" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Order</p>
                  <h2 className="text-2xl font-bold">10293</h2>
                  <p className="text-green-500">1.3% Up from past week</p>
                </div>
                <FaBox className="text-4xl text-yellow-200" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Sales</p>
                  <h2 className="text-2xl font-bold">$89,000</h2>
                  <p className="text-red-500">4.3% Down from yesterday</p>
                </div>
                <FaDollarSign className="text-4xl text-green-200" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Pending</p>
                  <h2 className="text-2xl font-bold">2040</h2>
                  <p className="text-green-500">1.8% Up from yesterday</p>
                </div>
                <FaClock className="text-4xl text-orange-200" />
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