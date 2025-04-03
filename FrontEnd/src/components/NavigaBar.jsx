import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell } from 'react-icons/fa';
import UserBalance from './UserBalance';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo và tên ứng dụng để quay về main */}
      <div className="flex items-center space-x-2">
        <img src="../assets/logo.png" alt="Logo" className="w-10 h-10" />
        <Link to="/" className="text-xl font-bold text-gray-800">
          VoucherHub
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-10 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Phần bên phải: Thông báo, Ngôn ngữ, Số dư, Login/Sign Up hoặc Logout */}
      <div className="flex items-center space-x-4">
        {/* Biểu tượng thông báo */}
        <div className="relative">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            6
          </span>
        </div>

        {/* Lựa chọn ngôn ngữ */}
        <div className="flex items-center space-x-2">
          <img src="https://flagcdn.com/16x12/gb.png" alt="UK Flag" className="w-5 h-5" />
          <select className="border-none focus:outline-none">
            <option>English</option>
            <option>Vietnamese</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Hiển thị số dư bằng component UserBalance */}
        <UserBalance setBalance={setBalance} />
        {isLoggedIn && (
          <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">Balance:</span>
            <span className="text-sm font-semibold">
              ${balance !== null ? balance : 'Loading...'}
            </span>
          </div>
        )}
        
        {/* Hiển thị Login/Sign Up nếu chưa đăng nhập, hoặc Logout nếu đã đăng nhập */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-500">
              Login
            </Link>
            <Link to="/signup" className="text-gray-600 hover:text-blue-500">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-blue-500"
          >
            Logout
          </button>
        )}

        {/* Menu người dùng (biểu tượng avatar) */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/30"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;