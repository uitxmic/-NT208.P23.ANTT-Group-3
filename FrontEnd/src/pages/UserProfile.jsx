// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Deposit from '../components/Deposit';
import Layout from '../components/Layout';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/users/getUserById`, {
          method: 'GET',
          credentials: 'include', // Use session-based authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('API Error:', errorData);
          throw new Error(errorData.message || 'Không thể tải thông tin hồ sơ.');
        }

        const data = await response.json();
        console.log('API Response:', data);

        const userData = data[0];
        if (!userData) {
          throw new Error('Không tìm thấy thông tin người dùng.');
        }

        console.log('User Data:', userData);
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', err);
        setError(err.message || 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center">
          {error}
          <button
            onClick={() => navigate('/login')}
            className="ml-2 text-blue-500 underline"
          >
            Đăng nhập lại
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-20">
        <div className="flex items-center">
          <img
            src={user?.Avatar || 'https://www.tenforums.com/attachments/user-accounts-family-safety/322690d1615743307-user-account-image-log-user.png'} // Sửa thành user.Avatar
            alt="Avatar"
            className="w-24 h-24 rounded-full mr-6"
          />
          <div className="grid grid-cols-1 gap-2">
            <h2 className="text-2xl font-bold text-gray-800">{user?.Fullname || 'Unknown User'}</h2>
            <p className="text-gray-600">Email: {user?.Email}</p>
            <p className="text-gray-600">
              Số dư:{' '}
              {user?.AccountBalance != null
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  user.AccountBalance * 1000
                )
                : '0 ₫'}
            </p>
            <p className="text-gray-600">Số điện thoại: {user?.PhoneNumber || 'Chưa cập nhật'}</p>
            <p className="text-gray-600">Xếp hạng trung bình: {user?.AvgRate || '0.0'}</p>
            <p className="text-gray-600">
              Trạng thái xác thực: {user?.IsVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            </p>
            <div className="flex space-x-4 mt-4">

              <button className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 py-2 px-4 w-60 rounded-md hover:bg-blue-700 text-gray-200 transition duration-200"
                onClick={() => navigate('/update-profile')}
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                className="mt-4 bg-gradient-to-r from-pink-400 to-yellow-300 py-2 px-4 w-60 rounded-md hover:bg-blue-700 text-white transition duration-200"
                onClick={() => navigate('/deposit')}
              >
                Nạp tiền vào hệ thống
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bài đăng của bạn</h3>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="mb-4">
                <h4 className="text-lg font-semibold text-blue-600">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Bạn chưa có bài đăng nào.</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;