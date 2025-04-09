import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import UserBalance from './UserBalance'; // Giả sử bạn đã có component này

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-pink-100 to-white shadow-lg p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      {/* Logo và tên ứng dụng */}
      <div className="flex items-center space-x-2">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-pink-400 transition-colors duration-200"
        >
          VoucherHub
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-10 border border-blue-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
      </div>

      {/* Phần bên phải */}
      <div className="flex items-center space-x-6">
        {/* Biểu tượng thông báo */}
        <div className="relative group">
          <FaBell className="text-blue-600 text-xl group-hover:text-blue-800 transition-colors duration-200" />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center shadow-md">
            6
          </span>
        </div>

        {/* Lựa chọn ngôn ngữ */}
        <div className="flex items-center space-x-2">
          <img
            src="https://flagcdn.com/w40/gb.png"
            alt="UK Flag"
            className="w-6 h-4 rounded-sm shadow-sm"
          />
          <select className="border border-blue-200 bg-white text-blue-700 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200">
            <option>English</option>
            <option>Vietnamese</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Hiển thị số dư */}
        <UserBalance setBalance={setBalance} />
        {isLoggedIn && (
          <div className="flex items-center space-x-1 bg-pink-200 text-blue-700 px-4 py-2 rounded-full shadow-md">
            <span className="text-sm font-medium">Balance:</span>
            <span className="text-sm font-semibold">
              ${balance !== null ? balance : '0'}
            </span>
          </div>
        )}

        {/* Login/Sign Up hoặc Logout */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-200"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-blue-600 font-medium hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;