import React, { useState } from 'react'; // Thêm useState
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import Navbar from '../components/NavigaBar';

const Log_in = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Hàm xử lý khi người dùng nhấn nút đăng nhập
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
        // Lưu access_token vào localStorage
        localStorage.setItem('access_token', data.access_token);
        navigate('/');
      if (data.state === 'success') { 

        navigate('/sidebar');
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

  return (
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

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={Username} // Gán giá trị từ state
                onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi người dùng nhập
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={Password} // Gán giá trị từ state
                onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi người dùng nhập
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Nút Login */}
            <button
              type="submit"
              className={`w-full p-3 rounded-lg text-white transition duration-300 ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading} // Vô hiệu hóa nút khi đang loading
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

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
  );
};

export default Log_in;