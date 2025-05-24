import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';


const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await axios.get(`${API_BASE_URL}/posting/getPostingByPostId/${postId}`);
                const data = response.data;
                if (Array.isArray(data) && data.length > 0 && data[0].result) {
                    setPost(data[0].result[0]);
                } else {
                    setPost(null);
                    setError('Không có bài đăng nào từ API');
                }
                setLoading(false);
            } catch (err) {
                setError('Không thể tải bài đăng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [postId]);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-10">Không tìm thấy bài đăng.</div>;
    }

    // Handle Buy Voucher button click
    const handleBuyVoucher = (post) => {
        navigate('/payment', { state: { voucher: post, quantity } });
    };

    // Handle Add to Cart button click
    const handleAddToCart = async (post) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Vui lòng đăng nhập để tiếp tục');
            setLoading(false);
            return;
        }

        if (!post || typeof post.PostId === 'undefined') {
            setError('Không thể thêm voucher không hợp lệ vào giỏ hàng.');
            return;
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/cart/addToCart`, { // Đảm bảo URL API này là chính xác
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        {post.VouImg ? (
                            <img
                                src={post.VouImg}
                                alt={post.PostName}
                                className="w-full flex justify-center"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Không có hình ảnh</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
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
                            }).format(post.Price * 1000)}
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
                        <p className="text-green-600 mb-2">
                            Số lượng còn lại: {post.Quantity || 0}
                        </p>
                        <p className="text-gray-500 mb-4">
                            Trạng thái: {post.Status || 'Không xác định'}
                        </p>
                        <div className="flex items-center mb-4">
                            <span className="text-gray-700 mr-4">Số lượng:</span>
                            <button
                                onClick={decreaseQuantity}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300"
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-4 py-1 bg-gray-100 text-gray-800">
                                {quantity}
                            </span>
                            <button
                                onClick={increaseQuantity}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                                disabled={quantity >= post.Quantity}
                            >
                                +
                            </button>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Tổng giá:{' '}
                            <span className="font-bold">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(quantity * post.Price * 1000)}
                            </span>
                        </p>
                        {/* Action Buttons */}
                        {post.Price > 0 && (
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleBuyVoucher(post)}
                                        className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${post.Quantity === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        aria-label={`Mua voucher ${post.PostName}`}
                                        disabled={post.Quantity === 0}
                                    >
                                        Mua Voucher
                                    </button>
                                    <button
                                        onClick={() => handleAddToCart(post)}
                                        className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${post.Quantity === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'}`}
                                        aria-label={`Thêm voucher ${post.PostName} vào giỏ hàng`}
                                        disabled={post.Quantity === 0}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PostDetail;