import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FaStar, FaShoppingBag, FaBox, FaUserPlus, FaCalendarAlt } from 'react-icons/fa'; // Thêm biểu tượng khác
import { Helmet } from 'react-helmet';

const SellerPost = () => {
    const { UserId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect for fetching the seller's posts
    useEffect(() => {
        const fetchSellerPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                console.log('API_BASE_URL:', API_BASE_URL);
                console.log('UserId from params:', UserId);
                const token = localStorage.getItem('access_token');
                console.log('Token:', token);

                if (!token) {
                    setError('Vui lòng đăng nhập để tiếp tục.');
                    setLoading(false);
                    return;
                }

                if (!UserId) {
                    setError('UserId không được cung cấp.');
                    setLoading(false);
                    return;
                }

                // Fetch seller posts
                const response = await axios.get(`${API_BASE_URL}/posting/getSellerPostings/${UserId}?page=1&limit=10`, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Seller Posts Response:', response.data);
                const data = response.data;
                let allPosts = [];

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item && Array.isArray(item.result) && item.result.length > 0) {
                            allPosts = allPosts.concat(item.result);
                        }
                    });
                }

                if (allPosts.length > 0) {
                    setPosts(allPosts);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error('Error fetching seller posts:', err.response ? err.response.data : err.message);
                setError('Không thể tải bài đăng của người bán. Vui lòng thử lại sau.');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (UserId) {
            fetchSellerPosts();
        } else {
            setLoading(false);
            setError('No UserId provided.');
        }
    }, [UserId]);

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 pt-20 text-center">
                    Đang tải...
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 pt-20 text-center text-red-500">
                    Lỗi: {error}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Helmet>
                <title>Bài đăng của người bán | VoucherHub</title>
                <meta name="description" content="Xem danh sách bài đăng, sản phẩm, voucher, coupon của người bán trên VoucherHub." />
                <meta name="keywords" content="bài đăng người bán, sản phẩm, voucher, coupon, ưu đãi, voucherhub" />
                <meta property="og:title" content="Bài đăng của người bán | VoucherHub" />
                <meta property="og:description" content="Xem danh sách bài đăng, sản phẩm, voucher, coupon của người bán trên VoucherHub." />
                <meta property="og:type" content="profile" />
                <meta property="og:url" content={UserId ? `https://voucherhub.id.vn/seller/${UserId}` : "https://voucherhub.id.vn/seller"} />
                <link rel="canonical" href={UserId ? `https://voucherhub.id.vn/seller/${UserId}` : "https://voucherhub.id.vn/seller"} />
            </Helmet>
            <div className="container mx-auto px-4 py-8 pt-20">
                {/* Seller Information Section */}
                {posts.length > 0 && (
                    <div className="border rounded-lg p-6 mb-12 shadow-lg bg-white relative"> {/* Enhanced styling */}
                        <div className="flex items-center mb-4">
                            <img
                                src={posts[0].VouImg || 'https://via.placeholder.com/150'}
                                alt={`${posts[0].UserName || 'Người bán'}'s avatar`}
                                className="w-16 h-16 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {posts[0].UserName || 'Người bán không xác định'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-700">
                                <FaStar className="text-yellow-500 mr-2 text-xl" />
                                <span>Đánh Giá:</span>
                                <span className="font-semibold ml-2 text-lg">{posts[0].AvgRate || 'Chưa có'}</span>
                                {posts[0].AvgRate > 0 && <span className="ml-1 text-yellow-500">({posts[0].AvgRate}/5)</span>}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaShoppingBag className="text-blue-500 mr-2 text-xl" />
                                <span>Đã Bán:</span>
                                <span className="font-semibold ml-2 text-lg">{posts[0].SoldAmount || 0}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaBox className="text-green-500 mr-2 text-xl" />
                                <span>Sản Phẩm:</span>
                                <span className="font-semibold ml-2 text-lg">{posts[0].ProductAmount || posts.length}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaCalendarAlt className="text-purple-500 mr-2 text-xl" />
                                <span>Tham Gia:</span>
                                <span className="font-semibold ml-2 text-lg">2 năm trước</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaUserPlus className="text-red-500 mr-2 text-xl" />
                                <span>Người Theo Dõi:</span>
                                <span className="font-semibold ml-2 text-lg">
                                    {new Intl.NumberFormat('vi-VN').format(32400)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Danh sách bài đăng của người bán</h1>
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post.PostId}
                                className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                                onClick={() => navigate(`/postdetail/${post.PostId}`)}
                            >
                                {post.VouImg ? (
                                    <img
                                        src={post.VouImg}
                                        alt={post.PostName}
                                        className="w-full h-40 object-cover rounded-md mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                                        <span className="text-gray-500">Không có hình ảnh</span>
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {post.PostName || 'Tên không có'}
                                </h3>
                                <p className="text-blue-600 font-bold">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format((post.Price || 0) * 1000)}
                                </p>
                                <p className="text-gray-500 text-sm mb-2">
                                    Hết hạn:{' '}
                                    {post.Expire
                                        ? new Date(post.Expire).toLocaleDateString('vi-VN')
                                        : 'Không xác định'}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    Đánh Giá:{' '}
                                    <span className="font-semibold ml-1">
                                        {post.AvgRate || 'Chưa có'}
                                    </span>
                                    {post.AvgRate && <FaStar className="text-yellow-400 ml-1" />}
                                </p>
                                <p className="text-green-600">
                                    Số lượng còn lại: {post.Quantity || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Không có bài đăng nào từ người bán này.</div>
                )}
            </div>
        </Layout>
    );
};

export default SellerPost;