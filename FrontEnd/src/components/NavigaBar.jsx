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
  const isLoggedIn = !!localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State cho số lượng item trong giỏ hàng

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoggedIn) return;

      try {
        const token = localStorage.getItem('access_token');
        console.log(token);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/users/getUserById`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
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

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/notification/get5latestnoti`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể lấy thông báo.');
        }

        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.is_read).length);
      } catch (err) {
        console.error('Lỗi khi lấy thông báo:', err);
      }
    };

    fetchUserInfo();
    fetchNotifications();
  }, [isLoggedIn]);

  // Fetch cart item count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isLoggedIn) {
        setCartItemCount(0); // Reset khi không đăng nhập
        return;
      }
      try {
        const token = localStorage.getItem('access_token');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/cart/getCart`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCartItemCount(data.length || 0); // data là một mảng các cart items
        } else {
          // Có thể log lỗi hoặc set count về 0 nếu không lấy được
          console.error('Không thể lấy số lượng giỏ hàng');
          setCartItemCount(0);
        }
      } catch (err) {
        console.error('Lỗi khi lấy số lượng giỏ hàng:', err);
        setCartItemCount(0);
      }
    };

    fetchCartCount();
    // Thêm một listener để cập nhật số lượng giỏ hàng khi có thay đổi từ các trang khác
    // Ví dụ: sử dụng custom event
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
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
      const token = localStorage.getItem('access_token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/notification/markAsRead/${notificationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className="bg-gradient-to-r from-pink-100 to-white shadow-lg p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-40">
      {/* Trái */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
      <div className="relative w-1/3">
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
      <div className="flex items-center space-x-6">
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

        {/* Biểu tượng Lịch sử mua hàng */}
        <Link to="/purchase-history" className="relative group">
          <FaHistory className="h-6 w-6 text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
        </Link>


        {/* Ngôn ngữ */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="text-blue-700 hover:text-blue-900 focus:outline-none flex items-center space-x-2"
          >
            <img
              src={language === 'vi' ? 'https://flagcdn.com/w40/vn.png' : 'https://flagcdn.com/w40/gb.png'}
              alt="flag"
              className="w-6 h-4 rounded-sm shadow-sm"
            />
            <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
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
        <UserBalance setBalance={setBalance} />
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-pink-200 text-blue-700 px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium">{text.balanceLabel}</span>
              <span className="text-sm font-semibold">{balance != null
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
                <span className="text-blue-700 font-medium">{userInfo?.Username || 'Người dùng'}</span>
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