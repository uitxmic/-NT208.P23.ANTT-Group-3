import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaBars } from 'react-icons/fa'; // Thêm FaBars cho nút hamburger
import UserBalance from './UserBalance';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoggedIn) return;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:3000/users/getUserById', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể lấy thông tin người dùng.');
        }

        const data = await response.json();
        const userData = data[0];
        if (userData) {
          setUserInfo(userData);
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleMouseLeaveParent = () => {
    const id = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
    setTimeoutId(id);
  };

  const handleMouseLeaveDropdown = () => {
    const id = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
    setTimeoutId(id);
  };

  const handleMouseEnterDropdown = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-100 to-white shadow-lg p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-40">
      {/* Phần bên trái: Nút hamburger và Logo */}
      <div className="flex items-center space-x-4">
        {/* Nút hamburger */}
        <button
          onClick={toggleSidebar}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Logo và tên ứng dụng */}
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
          <div className="flex items-center space-x-4">
            {/* Số dư */}
            <div className="flex items-center space-x-1 bg-pink-200 text-blue-700 px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium">Balance:</span>
              <span className="text-sm font-semibold">
                ${balance !== null ? balance : '0'}
              </span>
            </div>

            {/* Avatar và Username với Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={handleMouseLeaveParent}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src={userInfo?.Avatar || 'https://via.placeholder.com/40'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full shadow-sm"
                />
                <span className="text-blue-700 font-medium">
                  {userInfo?.Username || 'User'}
                </span>
              </div>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  onMouseEnter={handleMouseEnterDropdown}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                  >
                    Hồ sơ của tôi
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoggedIn && (
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
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;