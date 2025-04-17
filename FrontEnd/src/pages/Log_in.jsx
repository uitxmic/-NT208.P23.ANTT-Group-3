import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; // Thêm Google OAuth
import Navbar from '../components/NavigaBar';

const Log_in = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Hàm xử lý đăng nhập bằng Username/Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, Password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      if (data.state === 'success') {
        localStorage.setItem('access_token', data.access_token);
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/googlecloud/signInWithGoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokenId: credentialResponse.credential }), 
      });

      const data = await response.json();
      if (data.state === 'success') {
        localStorage.setItem('access_token', data.access_token);
        navigate('/'); 
      } else {
        throw new Error(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    setError('Google login failed');
    setLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId="269747751566-9p1a31qjqacmtf57h78c1fkl0b97ggrc.apps.googleusercontent.com">
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Nội dung chính: Form đăng nhập */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

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
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full p-3 rounded-lg text-white transition duration-300 ${
                  loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
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
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Log_in;