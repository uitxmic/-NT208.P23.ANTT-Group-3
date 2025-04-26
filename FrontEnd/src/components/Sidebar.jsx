import React from 'react';
import { FaTachometerAlt, FaBox, FaHeart, FaEnvelope, FaList, FaCalendar, FaClipboardList, FaUsers, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng
import { useState } from 'react';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button
      class="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
      type="button"
      data-twe-collapse-init
      data-twe-target="#navbarSupportedContent1"
      aria-controls="navbarSupportedContent1"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span
        className="[&>svg]:w-7 [&>svg]:stroke-black/50 dark:[&>svg]:stroke-neutral-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipR ule="evenodd" />
        </svg>
      </span>
    </button>
      <div className="w-64 bg-white shadow-lg p-4">
        <div className="text-2xl font-bold text-blue-600 mb-8">DashStack</div>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="flex items-center p-2 bg-blue-500 text-white rounded-lg">
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="posting-manager" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FaBox className="mr-2" /> Posting Manager
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
    </div>
  );
};

export default Sidebar;