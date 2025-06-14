import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Helmet } from "react-helmet";

const Log_in = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('vi'); // Mặc định là Tiếng Việt
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // Quản lý trạng thái dropdown

  const navigate = useNavigate();

  // Hàm xử lý đăng nhập bằng Username/Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ Username, Password }),
      });
      console.error('Login response:', response);

      if (!response.ok) {
        throw new Error(text.invalidCredentials || 'Invalid credentials');
      }

      const data = await response.text(); // Expecting a plain text response
      if (data !== 'Đăng nhập thành công!') {
        throw new Error(text.errorMessage || 'Login failed');
      }

      const roleResponse = await fetch(`${API_BASE_URL}/session/userRoleId`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (!roleResponse.ok) {
        throw new Error('Failed to fetch user role');
      }

      const roleData = await roleResponse.json();
      if (roleData.UserRoleId === 1) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || text.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng nhập với Google
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/googlecloud/signInWithGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Đảm bảo cookie session được gửi về
        body: JSON.stringify({ tokenId: credentialResponse.credential }),
      });

      const data = await response.json();
      if (data.state === 'success') {
        const roleResponse = await fetch(`${API_BASE_URL}/session/userRoleId`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        });

        if (!roleResponse.ok) {
          throw new Error('Failed to fetch user role');
        }

        const roleData = await roleResponse.json();
        if (roleData.UserRoleId === 1) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(data.error || text.googleLoginFailed);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || text.googleLoginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    setError(text.googleLoginFailed);
    setLoading(false);
  };

  // Dịch ngôn ngữ
  const getText = () => {
    return language === 'vi' ? {
      title: 'Đăng Nhập',
      username: 'Tên người dùng',
      password: 'Mật khẩu',
      placeholderUsername: 'Nhập tên người dùng',
      placeholderPassword: 'Nhập mật khẩu',
      button: 'Đăng Nhập',
      loggingIn: 'Đang đăng nhập...',
      invalidCredentials: 'Tên người dùng hoặc mật khẩu không đúng',
      errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
      googleLoginFailed: 'Đăng nhập bằng Google thất bại',
      noAccount: 'Chưa có tài khoản?',
      signUp: 'Đăng Ký',
      forgotPassword: 'Quên mật khẩu?',
    } : {
      title: 'Login',
      username: 'Username',
      password: 'Password',
      placeholderUsername: 'Enter your username',
      placeholderPassword: 'Enter your password',
      button: 'Login',
      loggingIn: 'Logging in...',
      invalidCredentials: 'Invalid username or password',
      errorMessage: 'An error occurred. Please try again later.',
      googleLoginFailed: 'Google login failed',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      forgotPassword: 'Forgot Password?',
    };
  };

  const text = getText();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Mua bán voucher, mã giảm giá, coupon | VoucherHub</title>
        <meta name="description" content="Đăng nhập để sử dụng các dịch vụ ưu đãi, bảo mật, tiện lợi tại VoucherHub." />
        <meta name="keywords" content="đăng nhập, login, ưu đãi, voucherhub" />
        <meta property="og:title" content="Đăng nhập | Mua bán voucher, mã giảm giá, coupon | VoucherHub" />
        <meta property="og:description" content="Đăng nhập để sử dụng các dịch vụ ưu đãi, bảo mật, tiện lợi tại VoucherHub." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voucherhub.id.vn/login" />
        <link rel="canonical" href="https://voucherhub.id.vn/login" />
        {/* Schema WebPage */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Đăng nhập",
            "description": "Đăng nhập để sử dụng các dịch vụ ưu đãi, bảo mật, tiện lợi tại VoucherHub.",
            "url": "https://voucherhub.id.vn/login"
          }
        `}</script>
      </Helmet>

      <GoogleOAuthProvider clientId={googleClientId}>
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

          {/* Nội dung chính: Form đăng nhập */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{text.title}</h1>

              {/* Hiển thị thông báo lỗi nếu có */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                  {error}
                </div>
              )}

              {/* Form đăng nhập Username/Password */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-600 mb-2">
                    {text.username}
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={text.placeholderUsername}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-600 mb-2">
                    {text.password}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder={text.placeholderPassword}
                    required
                  />
                </div>

                {/* Liên kết "Quên mật khẩu" */}
                <div className="mb-4 text-right">
                  <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
                    {text.forgotPassword}
                  </Link>
                </div>

                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white transition duration-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  disabled={loading}
                >
                  {loading ? text.loggingIn : text.button}
                </button>
              </form>



              {/* Nút Đăng nhập với Google */}
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  disabled={loading}
                />
              </div>

              {/* Liên kết đến trang Sign Up */}
              <p className="text-center mt-4 text-gray-600">
                {text.noAccount}{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  {text.signUp}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Log_in;