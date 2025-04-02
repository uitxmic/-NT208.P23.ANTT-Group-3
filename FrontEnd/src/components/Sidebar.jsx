import React from 'react';
import { FaTachometerAlt, FaBox, FaHeart, FaEnvelope, FaList, FaCalendar, FaClipboardList, FaUsers, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <div className="text-2xl font-bold text-blue-600 mb-8">DashStack</div>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center p-2 bg-blue-500 text-white rounded-lg">
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaHeart className="mr-2" /> Favorites
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaEnvelope className="mr-2" /> Inbox
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaList className="mr-2" /> Order Lists
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Product Stock
          </Link>
        </li>
        <li className="mt-6 text-gray-500 uppercase text-sm">Pages</li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Pricing
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaCalendar className="mr-2" /> Calendar
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaClipboardList className="mr-2" /> To-Do
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaUsers className="mr-2" /> Contact
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> Invoice
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaBox className="mr-2" /> UI Elements
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaUsers className="mr-2" /> Team
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FaTable className="mr-2" /> Table
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;