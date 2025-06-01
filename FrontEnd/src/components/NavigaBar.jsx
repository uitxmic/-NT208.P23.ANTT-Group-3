import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaBars, FaShoppingCart, FaHistory } from 'react-icons/fa';
import UserBalance from './UserBalance';
import SearchFilterModal from './SearchFilterModal';

const Navbar = ({
  toggleSidebar,
  isSidebarOpen,
  language,
  setLanguage,
  showLanguageDropdown,
  setShowLanguageDropdown,
}) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/users/getUserById`, {
          method: 'GET',
          credentials: 'include', // Use session-based authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Unable to fetch user info.');
        }

        const data = await response.json();
        const userData = data[0];
        if (userData) {
          setUserInfo(userData);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_BASE_URL}/session`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(() => {
      navigate('/login');
    });
  };

  const handleMouseLeaveDropdown = () => {
    const id = setTimeout(() => {
      setIsNotificationDropdownOpen(false);
    }, 300);
    setTimeoutId(id);
  };

  const handleMouseEnterDropdown = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsNotificationDropdownOpen(true);
  };

  const markAsRead = async (notificationId) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/notification/markAsRead/${notificationId}`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(
          notifications.map((notif) =>
            notif.noti_id === notificationId ? { ...notif, is_read: 1 } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Lỗi khi đánh dấu thông báo:', err);
    }
  };

  const getText = () => {
    return language === 'vi'
      ? {
        title: 'VoucherHub',
        searchPlaceholder: 'Tìm kiếm',
        balanceLabel: 'Số dư:',
        profile: 'Hồ sơ của tôi',
        logout: 'Đăng xuất',
        login: 'Đăng nhập',
        signup: 'Đăng ký',
        noNotifications: 'Không có thông báo',
        viewAll: 'Xem tất cả', // Thêm text cho "Xem tất cả"
      }
      : {
        title: 'VoucherHub',
        searchPlaceholder: 'Search',
        balanceLabel: 'Balance:',
        profile: 'My Profile',
        logout: 'Logout',
        login: 'Login',
        signup: 'Sign Up',
        noNotifications: 'No notifications',
        viewAll: 'View All', // Thêm text cho "Xem tất cả"
      };
  };

  const text = getText();

  return (
    <div className="bg-gradient-to-r from-pink-100 to-white shadow-lg p-3 flex flex-wrap justify-between items-center fixed top-0 left-0 right-0 z-40">
      {/* Trái */}
      <div className="flex items-center space-x-4"> {/* Order 1 by default */}
        <button
          onClick={toggleSidebar}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200" // Consider md:hidden if sidebar is only for mobile
        >
          <FaBars className="text-2xl" />
        </button>
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-pink-400 transition-colors duration-200"
        >
          {text.title}
        </Link>
      </div>

      {/* Tìm kiếm */}
      {/* Full width on small screens, 1/3 on medium up. Appears last on small screens due to order-3. */}
      <div className="relative w-full md:w-1/3 order-3 mt-2 md:mt-0 md:order-2">
        <input
          type="text"
          placeholder={text.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-blue-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          onFocus={() => setIsFilterOpen(true)}
        />

        {/* Biểu tượng tìm kiếm */}
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
        {isFilterOpen && (
          <SearchFilterModal
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      {/* Phải */}
      {/* Takes full width on small screens (below md), auto width on medium up. Allows internal items to wrap. */}
      {/* Order 2 on small screens (appears after Left), order 3 on medium up (appears after Search). */}
      <div className="flex items-center flex-wrap justify-end space-x-2 sm:space-x-3 md:space-x-4 order-2 mt-2 md:mt-0 md:order-3 w-full md:w-auto">
        {/* Thông báo */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnterDropdown}
          onMouseLeave={handleMouseLeaveDropdown}
        >
          <button className="text-blue-600 text-xl hover:text-blue-800 transition-colors duration-200 relative">
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2 w-2 shadow-md" />
            )}
          </button>

          {isNotificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notif) => (
                    <div
                      key={notif.noti_id}
                      className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200 ${notif.is_read ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (notif.noti_type === 'order') {
                          navigate(`/notification/${notif.noti_id}`);
                          setIsNotificationDropdownOpen(false);
                        }
                        else if (!notif.is_read) {
                          markAsRead(notif.noti_id);
                        }
                      }
                      }
                    >
                      <div className="flex items-start space-x-2">
                        {notif.image_url && (
                          <img
                            src={notif.image_url}
                            alt="Notification"
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{notif.noti_title}</p>
                          <p className="text-sm">{notif.noti_content}</p>
                          <p className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/notification"
                    className="block w-full text-center px-4 py-2 text-blue-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    {text.viewAll}
                  </Link>
                </>
              ) : (
                <div className="px-4 py-2 text-gray-800">{text.noNotifications}</div>
              )}
            </div>
          )}
        </div>

        {/* Biểu tượng giỏ hàng */}
        <Link to="/cart" className="relative group">
          <FaShoppingCart className="h-6 w-6 text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-md">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Biểu tượng Lịch sử mua hàng - Hidden on extra-small screens, shown from sm upwards */}
        <Link to="/purchase-history" className="relative group hidden sm:inline-flex items-center">
          <FaHistory className="h-6 w-6 text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
        </Link>


        {/* Ngôn ngữ */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="text-blue-700 hover:text-blue-900 focus:outline-none flex items-center space-x-1 sm:space-x-2"
          >
            <img
              src={language === 'vi' ? 'https://flagcdn.com/w40/vn.png' : 'https://flagcdn.com/w40/gb.png'}
              alt="flag"
              className="w-5 h-3 sm:w-6 sm:h-4 rounded-sm shadow-sm"
            />
            <span className="hidden sm:inline">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            <span className="sm:hidden">{language === 'vi' ? 'VN' : 'EN'}</span> {/* Abbreviation for very small screens */}
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setLanguage('vi');
                  setShowLanguageDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <img src="https://flagcdn.com/w40/vn.png" alt="vn" className="w-6 h-4 rounded-sm" />
                <span>Tiếng Việt</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <img src="https://flagcdn.com/w40/gb.png" alt="uk" className="w-6 h-4 rounded-sm" />
                <span>English</span>
              </button>
            </div>
          )}
        </div>

        {/* Số dư và người dùng */}
        <div className="hidden sm:inline-flex items-center"> {/* Hide UserBalance component on extra-small screens */}
          <UserBalance setBalance={setBalance} />
        </div>
        {(userInfo !== null) ? (
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <div className="items-center space-x-1 bg-pink-200 text-blue-700 px-2 py-1 sm:px-3 sm:py-2 rounded-full shadow-md hidden sm:flex"> {/* Hide balance text on extra-small screens */}
              <span className="text-xs sm:text-sm font-medium">{text.balanceLabel}</span>
              <span className="text-xs sm:text-sm font-semibold">{balance != null
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  balance * 1000
                )
                : '0 ₫'}</span>
            </div>
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                const id = setTimeout(() => setIsDropdownOpen(false), 300);
                setTimeoutId(id);
              }}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <span className="text-blue-700 font-medium text-sm sm:text-base">{userInfo?.Username || 'Người dùng'}</span>
              </div>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  onMouseEnter={() => {
                    if (timeoutId) clearTimeout(timeoutId);
                  }}
                  onMouseLeave={() => {
                    const id = setTimeout(() => setIsDropdownOpen(false), 300);
                    setTimeoutId(id);
                  }}
                >
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                  >
                    {text.profile}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                  >
                    {text.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-200"
            >
              {text.login}
            </Link>
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:bg-blue-100 px-3 py-1 rounded-md transition-all duration-200"
            >
              {text.signup}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;