import React from 'react';
import { FaTachometerAlt, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white shadow-lg p-4">
      <div className="text-2xl font-bold text-blue-600 mb-8">DashStack</div>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center p-2 bg-blue-500 text-white rounded-lg">
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/posting-manager" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Posting Manager
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/shop-vouchers" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Shop Vouchers
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/user-vouchers" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Vouchers Manager
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;