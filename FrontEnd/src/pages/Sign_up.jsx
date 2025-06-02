import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

const Sign_up = () => {
  const [Username, setUsername] = useState('');
  const [Fullname, setFullname] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [language, setLanguage] = useState('vi'); // Mặc định là Tiếng Việt
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // Quản lý trạng thái dropdown

  const navigate = useNavigate();

  // Hàm xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kiểm tra mật khẩu khớp
    if (Password !== ConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/users/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, Fullname, Password, Email, PhoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      console.log('Response data:', data);
      if (data[0] && data[0].Message === 'User Created') {
        navigate('/login');
      } else if (data[0] && data[0].Message === 'Created Failed') {
        setError(data[0].ErrorDetail || 'Registration failed');
      } else if (data[0].Id == -1) {
        setError(data[0].Message);
      }
      else {
        setError('Registration failed');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Dịch ngôn ngữ
  const getText = () => {
    return language === 'vi' ? {
      title: 'Đăng Ký',
      username: 'Tên người dùng',
      fullname: 'Họ và tên',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      email: 'Email',
      phoneNumber: 'Số điện thoại',
      placeholderUsername: 'Nhập tên người dùng',
      placeholderFullname: 'Nhập họ và tên',
      placeholderPassword: 'Nhập mật khẩu',
      placeholderConfirmPassword: 'Nhập lại mật khẩu',
      placeholderEmail: 'Nhập email',
      placeholderPhone: 'Nhập số điện thoại (10 chữ số)',
      button: 'Đăng Ký',
      haveAccount: 'Đã có tài khoản?',
      login: 'Đăng nhập',
    } : {
      title: 'Sign Up',
      username: 'Username',
      fullname: 'Fullname',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      phoneNumber: 'Phone Number',
      placeholderUsername: 'Enter your username',
      placeholderFullname: 'Enter your full name',
      placeholderPassword: 'Enter your password',
      placeholderConfirmPassword: 'Confirm your password',
      placeholderEmail: 'Enter your email',
      placeholderPhone: 'Enter your phone number (10 digits)',
      button: 'Sign Up',
      haveAccount: 'Already have an account?',
      login: 'Login',
    };
  };

  const text = getText();

  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản | VoucherHub</title>
        <meta name="description" content="Đăng ký tài khoản miễn phí để mua bán, trao đổi voucher, coupon, mã giảm giá uy tín tại VoucherHub." />
        <meta name="keywords" content="đăng ký, tạo tài khoản, mua bán voucher, coupon, ưu đãi, voucherhub" />
        <meta property="og:title" content="Đăng ký tài khoản | VoucherHub" />
        <meta property="og:description" content="Đăng ký tài khoản miễn phí để mua bán, trao đổi voucher, coupon, mã giảm giá uy tín tại VoucherHub." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voucherhub.id.vn/signup" />
        <link rel="canonical" href="https://voucherhub.id.vn/signup" />
        {/* Schema WebPage */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Đăng ký tài khoản",
            "description": "Đăng ký tài khoản miễn phí để mua bán, trao đổi voucher, mã giảm giá, coupon uy tín, giá rẻ tại VoucherHub.",
            "url": "https://voucherhub.id.vn/signup"
          }
        `}</script>
      </Helmet>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header với logo và nút ngôn ngữ */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          {/* Placeholder để căn giữa logo */}
          <div></div>

          {/* Logo và tên */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">S</span>
            </div>
            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 hover:text-pink-400 transition-colors duration-200"
            >
              VoucherHub
            </Link>
          </div>

          {/* Nút chọn ngôn ngữ ở bên phải */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="text-blue-700 hover:text-blue-900 focus:outline-none"
            >
              {language === 'vi' ? 'Tiếng Việt' : 'English'}
            </button>
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setLanguage('vi');
                    setShowLanguageDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  English
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Nội dung chính: Form đăng ký */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">{text.title}</h1>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Form đăng ký */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-600 mb-1">
                  {text.username}
                </label>
                <input
                  type="text"
                  id="username"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={text.placeholderUsername}
                  required
                />
              </div>

              <div>
                <label htmlFor="fullname" className="block text-gray-600 mb-1">
                  {text.fullname}
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={Fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={text.placeholderFullname}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-600 mb-1">
                  {text.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={text.placeholderPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">
                  {text.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={text.placeholderConfirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-600 mb-1">
                  {text.email}
                </label>
                <input
                  type="email"
                  id="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={text.placeholderEmail}
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-gray-600 mb-1">
                  {text.phoneNumber}
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={PhoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={text.placeholderPhone}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full p-3 rounded-lg text-white transition duration-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                disabled={loading}
              >
                {loading ? 'Signing up...' : text.button}
              </button>
            </form>

            {/* Liên kết đến trang Login (Footer) */}
            <p className="text-center mt-4 text-gray-600">
              {text.haveAccount}{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                {text.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sign_up;