import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FaStar } from 'react-icons/fa'; // Thêm biểu tượng ngôi sao

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Effect for fetching the main post details
    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/posting/getPostingByPostId/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Post Detail Response:', data);
                if (Array.isArray(data) && data.length > 0 && data[0].result && data[0].result.length > 0) {
                    setPost(data[0].result[0]);
                } else {
                    setPost(null);
                    setError('Không có bài đăng nào từ API.');
                }
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError('Không thể tải bài đăng. Vui lòng thử lại sau.');
                setPost(null);
            }
        };

        if (postId) {
            fetchPostDetail();
        } else {
            setLoading(false);
            setError('No Post ID provided.');
        }
    }, [postId]);

    // Effect for fetching recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!post) {
                if (!loading && !error) setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                // Fetch transactions without token
                let transactions = [];
                try {
                    const searchText = '';
                    const sortColumn = 'Date';
                    const sortOrder = 'DESC';
                    const transactionResponse = await fetch(
                        `${API_BASE_URL}/trade/getTransactionById?search=${encodeURIComponent(searchText)}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        }
                    );
                    if (transactionResponse.ok) {
                        const jsonData = await transactionResponse.json();
                        console.log('Transactions Response:', jsonData);
                        transactions = Array.isArray(jsonData) ? jsonData : (jsonData.data || []);
                    } else {
                        console.error('Failed to fetch transactions:', transactionResponse.status, await transactionResponse.text());
                    }
                } catch (e) {
                    console.error('Error fetching transactions:', e);
                }

                // Fetch all posts
                const page = 1;
                const limitValue = 20;
                const allPostsResponse = await fetch(
                    `${API_BASE_URL}/posting/getAllPostings?page=${page}&limit=${limitValue}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                let allPosts = [];
                if (allPostsResponse.ok) {
                    const allPostsData = await allPostsResponse.json();
                    console.log('All Posts Response:', allPostsData);
                    if (Array.isArray(allPostsData)) {
                        allPosts = allPostsData.flatMap(item => item.result || []);
                    } else if (allPostsData && Array.isArray(allPostsData.data)) {
                        allPosts = allPostsData.data;
                    } else {
                        allPosts = [];
                    }
                } else {
                    console.error('Failed to fetch all posts:', allPostsResponse.status, await allPostsResponse.text());
                }

                // Generate recommendations
                const recommendationMap = new Map();

                // Content-Based Filtering: Posts with same or similar category
                const contentBased = allPosts
                    .filter((p) => p.Category === post.Category && p.PostId !== post.PostId)
                    .map((p) => ({ ...p, score: 0.3 }));
                console.log('Content-Based:', contentBased);

                // Collaborative Filtering: Match transactions by VoucherName
                let collaborativeBased = [];
                if (transactions.length > 0) {
                    const transactionVoucherNames = transactions
                        .map((t) => t.VoucherName)
                        .filter((name) => name !== undefined);
                    collaborativeBased = allPosts
                        .filter((p) => transactionVoucherNames.includes(p.PostName) && p.PostId !== post.PostId)
                        .map((p) => ({ ...p, score: 0.4 }));
                    console.log('Collaborative-Based:', collaborativeBased);
                }

                // Combine recommendations
                [...contentBased, ...collaborativeBased].forEach((rec) => {
                    if (recommendationMap.has(rec.PostId)) {
                        const existing = recommendationMap.get(rec.PostId);
                        recommendationMap.set(rec.PostId, {
                            ...rec,
                            score: (existing.score + rec.score) / 2,
                        });
                    } else {
                        recommendationMap.set(rec.PostId, rec);
                    }
                });

                let recommendations = Array.from(recommendationMap.values())
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 4);
                console.log('Combined Recommendations:', recommendations);

                // Cold-start fallback
                if (recommendations.length === 0 && allPosts.length > 0) {
                    recommendations = allPosts
                        .filter((p) => p.PostId !== post.PostId)
                        .sort((a, b) => (b.UpVote || 0) - (a.UpVote || 0))
                        .slice(0, 4)
                        .map((p) => ({ ...p, score: 0.1 }));
                    console.log('Cold-Start Recommendations:', recommendations);
                }

                setRecommendedPosts(recommendations);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Không thể tải gợi ý bài đăng.');
            } finally {
                setLoading(false);
            }
        };

        if (post && postId) {
            fetchRecommendations();
        }
    }, [post, postId]);

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

    if (!post) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 pt-20 text-center">
                    Không tìm thấy bài đăng.
                </div>
            </Layout>
        );
    }

    const increaseQuantity = () => {
        if (post && quantity < post.Quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle Buy Voucher button click
    const handleBuyVoucher = (post) => {
        navigate('/payment', { state: { voucher: post, quantity } });
    };

    // Handle Add to Cart button click
    const handleAddToCart = async (post) => {
        if (!post || typeof post.PostId === 'undefined') {
            setError('Không thể thêm voucher không hợp lệ vào giỏ hàng.');
            return;
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ PostId: post.PostId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể thêm vào giỏ hàng.');
            }

            alert('Đã thêm voucher vào giỏ hàng thành công!');
            navigate('/shop-vouchers');

        } catch (err) {
            setError(err.message || 'Lỗi khi thêm vào giỏ hàng.');
            alert(`Lỗi: ${err.message || 'Không thể thêm vào giỏ hàng.'}`);
        }
    };

    const postDate = new Date(post.Date);
    const isValidDate = !isNaN(postDate.getTime());

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 pt-20">
                {/* Main Post Section: Image and Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Image Column */}
                    <div className="flex justify-center">
                        {post.VouImg ? (
                            <img
                                src={post.VouImg}
                                alt={post.PostName}
                                className="w-full max-w-md object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-full max-w-md h-48 bg-gray-200 flex items-center justify-center rounded-md">
                                <span className="text-gray-500">Không có hình ảnh</span>
                            </div>
                        )}
                    </div>
                    {/* Details Column */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {post.PostName || 'Tên không có'}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {post.Content || 'Nội dung không có'}
                            </p>
                            <p className="text-blue-600 font-bold text-2xl mb-4">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format((post.Price || 0) * 1000)}
                            </p>
                            <p className="text-gray-500 mb-2">
                                Đăng ngày:{' '}
                                {isValidDate
                                    ? postDate.toLocaleDateString('vi-VN')
                                    : 'Ngày không hợp lệ'}
                            </p>
                            <p className="text-gray-500 mb-2">
                                Hết hạn:{' '}
                                {new Date(post.Expire).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-green-600 mb-4">
                                Số lượng còn lại: {post.Quantity || 0}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <span className="text-gray-700 mr-4">Số lượng:</span>
                                <button
                                    onClick={decreaseQuantity}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 bg-gray-100 text-gray-800">
                                    {quantity}
                                </span>
                                <button
                                    onClick={increaseQuantity}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 disabled:opacity-50"
                                    disabled={quantity >= post.Quantity}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-gray-700">
                                Tổng giá:{' '}
                                <span className="font-bold">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(quantity * (post.Price || 0) * 1000)}
                                </span>
                            </p>
                            {post.Price > 0 && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleBuyVoucher(post)}
                                        className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${post.Quantity === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        aria-label={`Mua voucher ${post.PostName}`}
                                        disabled={post.Quantity === 0}
                                    >
                                        Mua Voucher
                                    </button>
                                    <button
                                        onClick={() => handleAddToCart(post)}
                                        className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${post.Quantity === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        aria-label={`Thêm voucher ${post.PostName} vào giỏ hàng`}
                                        disabled={post.Quantity === 0}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Seller Information Section */}
                <div className="border rounded-lg p-4 mb-12 shadow-sm">
                    <div className="flex items-center mb-4">
                        <img
                            src={post.VouImg || 'https://via.placeholder.com/150'}
                            alt={`${post.UserName || 'Người bán'}'s avatar`}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {post.UserName || 'bluevelvet.vn'}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-gray-600 flex items-center">
                                Đánh Giá:{' '}
                                <span className="font-semibold ml-1">
                                    {post.AvgRate || 'Chưa có'}
                                </span>
                                {post.AvgRate && <FaStar className="text-yellow-400 ml-1" />}                            </p>
                            <p className="text-gray-600">
                                Số Lượng Đã Bán:{' '}
                                <span className="font-semibold">{post.SoldAmount || 0}</span>
                            </p>
                            <p className="text-gray-600">
                                Sản Phẩm:{' '}
                                <span className="font-semibold">{post.ProductAmount || 0}</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                Tham Gia:{' '}
                                <span className="font-semibold">2 năm trước</span>
                            </p>
                            <p className="text-gray-600">
                                Nguồn Theo Dõi:{' '}
                                <span className="font-semibold">
                                    {new Intl.NumberFormat('vi-VN').format(32400)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
                            onClick={() => alert('Chức năng Chat Ngay đang được phát triển!')}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                            Chat Ngay
                        </button>
                        <button
                            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
                            onClick={() => navigate(`/seller-post/${post.UserId}`)}                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                ></path>
                            </svg>
                            Xem Shop
                        </button>
                    </div>
                </div>
                {/* Recommended Posts Section */}
                {recommendedPosts.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài đăng được gợi ý</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recommendedPosts.map((recPost) => (
                                <div
                                    key={recPost.PostId}
                                    className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                                    onClick={() => navigate(`/postdetail/${recPost.PostId}`)}
                                >
                                    {recPost.VouImg ? (
                                        <img
                                            src={recPost.VouImg}
                                            alt={recPost.PostName}
                                            className="w-full h-40 object-cover rounded-md mb-4"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                                            <span className="text-gray-500">Không có hình ảnh</span>
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {recPost.PostName || 'Tên không có'}
                                    </h3>
                                    <p className="text-blue-600 font-bold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format((recPost.Price || 0) * 1000)}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Danh mục: {recPost.Category || 'Không xác định'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Điểm gợi ý: {(recPost.score * 100).toFixed(2)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Không có bài đăng được gợi ý.</div>
                )}
            </div>
        </Layout>
    );
};

export default PostDetail;