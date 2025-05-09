import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API để lấy 20 bài đăng gần đây nhất
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posting/get20LastestPostings');
                setPosts(response.data); // Giả định API trả về mảng bài đăng
                setLoading(false);
            } catch (err) {
                setError('Không thể tải bài đăng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Hiển thị trạng thái loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // Hiển thị danh sách bài đăng
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Bài đăng gần đây
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        {/* Hình ảnh bài đăng */}
                        {post.VouImg ? (
                            <img
                                src={post.VouImg}
                                alt={post.Postname}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Không có hình ảnh</span>
                            </div>
                        )}
                        {/* Nội dung bài đăng */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {post.Postname}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {post.Content}
                            </p>
                            <p className="text-blue-600 font-bold mt-2">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(post.Price*1000)}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                Đăng ngày:{' '}
                                {new Date(post.Date).toLocaleDateString('vi-VN')}
                            </p>
                            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostsList;