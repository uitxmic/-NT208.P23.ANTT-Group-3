import React, { useState } from 'react';
import { FaTachometerAlt, FaBox, FaUsers, FaChartLine } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ language }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const getText = () => {
    return language === 'vi'
      ? {
          title: 'Admin DashStack',
          dashboard: 'Tổng quan',
          postManager: 'Quản lý bài đăng',
          voucherManager: 'Quản lý voucher',
          userManager: 'Quản lý người dùng',
          revenueManager: 'Quản lý giao dịch',
        }
      : {
          title: 'Admin DashStack',
          dashboard: 'Overview',
          postManager: 'Post Management',
          voucherManager: 'Voucher Management',
          userManager: 'User Management',
          revenueManager: 'Revenue Management',
        };
  };

  const text = getText();

  return (
    <div className="w-64 h-full bg-white shadow-lg p-4">
      <div className="text-2xl font-bold text-blue-600 mb-8">{text.title}</div>
      <ul>
        <li className="mb-4">
          <Link
            to="/admin"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/admin' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTachometerAlt className="mr-2" /> {text.dashboard}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/admin/posting-manager"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/admin/posting-manager' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> {text.postManager}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/admin/voucher-manager"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/admin/voucher-manager' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> {text.voucherManager}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/admin/user-manager"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/admin/user-manager' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaUsers className="mr-2" /> {text.userManager}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/admin/transaction-manager"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/admin/transaction-manager' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaChartLine className="mr-2" /> {text.revenueManager}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;