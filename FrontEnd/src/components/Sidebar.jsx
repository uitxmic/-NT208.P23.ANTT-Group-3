import React, { useState } from 'react';
import { FaTachometerAlt, FaBox, FaNewspaper } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ language }) => {
  const [show, setShow] = useState(false);
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Dịch ngôn ngữ
  const getText = () => {
    return language === 'vi'
      ? {
          title: 'DashStack',
          dashboard: 'Bảng điều khiển',
          postingManager: 'Quản lý đăng bài',
          shopVouchers: 'Mã giảm giá cửa hàng',
          userVouchers: 'Quản lý mã giảm giá',
          newsManager: 'Quản lý tin tức',
        }
      : {
          title: 'DashStack',
          dashboard: 'Dashboard',
          postingManager: 'Posting Manager',
          shopVouchers: 'Shop Vouchers',
          userVouchers: 'Vouchers Manager',
          newsManager: 'News Manager',
        };
  };

  const text = getText();

  return (
    <div className="w-64 h-full bg-white shadow-lg p-4">
      <div className="text-2xl font-bold text-blue-600 mb-8"></div>
      <ul>
        <li className="mb-4">
          <Link
            to="/dashboard"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTachometerAlt className="mr-2" /> {text.dashboard}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/posting-manager"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/posting-manager' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> {text.postingManager}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/shop-vouchers"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/shop-vouchers' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> {text.shopVouchers}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/user-vouchers"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/user-vouchers' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBox className="mr-2" /> {text.userVouchers}
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/news"
            className={`flex items-center p-2 rounded-lg ${
              location.pathname === '/news' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaNewspaper className="mr-2" /> {text.newsManager}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;