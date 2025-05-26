import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaGift, FaClock, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const FreePost = () => {
    const [freePosts, setFreePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const fetchFreePosts = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/posting/getAllFreePostings?page=1&limit=8`, {
                method: 'GET',
                credentials: 'include', // Use session-based authentication
            });

            if (!response.ok) {
                throw new Error('Unable to fetch free posts');
            }

            const data = await response.json();
            const freePostsFiltered = data.filter(post => post.Status === 'Active');
            setFreePosts(freePostsFiltered.slice(0, 4));
        } catch (err) {
            setError(err.message || 'An error occurred while fetching free posts');
            setFreePosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectVoucher = async (post) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/createFreeTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    VoucherId: post.VoucherId,
                    PostId: post.PostId,
                    Amount: 0,
                    Quantity: 1,
                    UserIdSeller: post.UserId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể thu thập voucher');
            }

            if (data.message === 'Success') {
                setSuccessMessage('Thu thập voucher thành công!');
                await fetchFreePosts();
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                throw new Error(data.error || 'Không thể thu thập voucher');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi thu thập voucher');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeLeft = (expireDate) => {
        const now = new Date();
        const expire = new Date(expireDate);
        const difference = expire - now;

        if (difference <= 0) return 'Hết hạn';

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        fetchFreePosts();
    }, []);

     useEffect(() => {
        if (freePosts.length === 0) {
            return; // Don't start a timer if there are no posts
        }

        const timer = setInterval(() => {
            setFreePosts(prevPosts =>
                prevPosts.map(post => ({
                    ...post,
                    timeLeft: calculateTimeLeft(post.Expire), // Update timeLeft
                }))
            );
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount or when freePosts changes
    }, [freePosts]);

    return (
        (!loading && freePosts.length === 0) ? null : (
            <section className="py-10 bg-gradient-to-r from-red-500 to-orange-400 rounded-lg shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-extrabold text-white mb-4 text-center animate-pulse">
                        <FaFire className="inline mr-2 text-yellow-300" /> FLASH SALE - VOUCHER MIỄN PHÍ
                    </h2>
                    {/* Hiển thị thời gian chung */}
                    {freePosts.length > 0 && (
                        <p className="text-center text-yellow-400 font-semibold mb-6">
                            <FaClock className="inline mr-2" /> Thời gian còn lại: {calculateTimeLeft(freePosts[0].Expire)}
                        </p>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold border-2 border-green-300">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl text-center font-semibold border-2 border-red-300">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <p className="text-center text-white text-xl animate-pulse">Đang tải Flash Sale...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {freePosts.length > 0 && freePosts.map((post) => (
                                <div
                                    key={post.PostId}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-yellow-300"
                                >
                                    {/* Post Image */}
                                    <div className="relative">
                                        <img
                                            src={post.VouImg || 'https://via.placeholder.com/300x150'}
                                            alt={post.PostName}
                                            className="w-full h-48 object-cover cursor-pointer"
                                            onClick={() => navigate(`/postdetail/${post.PostId}`)}
                                        />
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                            <FaGift className="inline mr-1" /> Miễn phí
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-75 text-white text-sm font-medium px-3 py-1 rounded-full">
                                            <FaClock className="inline mr-1" /> {post.Quantity} còn lại
                                        </div>
                                    </div>

                                    {/* Post Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate cursor-pointer" onClick={() => navigate(`/postdetail/${post.PostId}`)}>
                                            {post.PostName}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {post.Content}
                                        </p>
                                        <p className="text-green-600 font-semibold text-lg mb-2">
                                            <FaGift className="inline mr-1" /> Miễn phí
                                        </p>
                                        <p className="text-gray-500 text-sm mb-2">
                                            Hết hạn: {new Date(post.Expire).toLocaleDateString('vi-VN')}
                                        </p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="flex items-center text-green-600">
                                                <FaThumbsUp className="mr-1" />{' '}
                                                <span className="ml-1 text-gray-700 text-sm">
                                                    {post.UpVote}
                                                </span>
                                            </span>
                                            <span className="flex items-center text-red-500">
                                                <FaThumbsDown className="mr-1" />{' '}
                                                <span className="ml-1 text-gray-700 text-sm">
                                                    {post.UpDown ?? 0}
                                                </span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCollectVoucher(post)}
                                            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading || post.Quantity <= 0}
                                        >
                                            {loading ? 'Đang xử lý...' : 'Thu thập ngay'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        )
    );
};

export default FreePost;