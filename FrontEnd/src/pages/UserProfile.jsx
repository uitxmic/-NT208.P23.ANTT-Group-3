import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavigaBar';
import { jwtDecode } from 'jwt-decode';
import Deposit from '../components/Deposit';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                
                const decoded = jwtDecode(token);
                const userId = decoded.UserId; // Giả định token chứa userId


                // Gọi API để lấy thông tin người dùng
                const userResponse = await axios.post('http://127.0.0.1:3000/users/getUserById',
                    { UserId: userId }, // Gửi userId trong body
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const userData = userResponse.data[0];
                setUser(userData);

                // // Gọi API để lấy bài đăng của người dùng
                // const postsResponse = await axios.get('https://your-api-endpoint.com/api/user/posts', {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                // setPosts(postsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);
                 
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-20">
                <div className="flex items-center">
                    <img
                        src={user?.avatar || 'https://via.placeholder.com/100'}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full mr-6"
                    />
                    <div className="grid grid-cols-1 gap-2">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.Fullname || 'Unknown User'}</h2>
                        <p className="text-gray-600">Email: {user?.Email}</p>
                        <p className="text-gray-600">
                            Số dư: {user?.AccountBalance != null
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
                            <button className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 py-2 px-4 w-60 rounded-md hover:bg-blue-700 text-gray-200 transition duration-200">
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
            {/* Danh sách bài đăng của người dùng */}
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
        </div >
    );
}

export default Profile;