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
                const response = await axios.get(`http://localhost:3000/posting/getPostingByPostId/${postId}`);
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

    const handleBuyNow = () => {
        if (post) {
            alert(`Bạn đã chọn mua ${quantity} voucher của bài đăng "${post.PostName}" với tổng giá ${quantity * post.Price * 1000} VND.`);
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
                        <button
                            onClick={handleBuyNow}
                            className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${post.Quantity === 0 || post.Status !== 'Active'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600'
                                }`}
                            disabled={post.Quantity === 0 || post.Status !== 'Active'}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PostDetail;