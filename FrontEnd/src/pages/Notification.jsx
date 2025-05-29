import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaShoppingCart, FaGift, FaWallet, FaCog } from 'react-icons/fa';

const Notification = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('orders');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { type: 'orders', label: 'Đơn hàng', route: '/notification/orders', color: 'blue', icon: FaShoppingCart },
        { type: 'promotion', label: 'Khuyến mãi', route: '/notification/promotion', color: 'red', icon: FaGift },
        { type: 'wallet', label: 'Ví', route: '/notification/wallet', color: 'green', icon: FaWallet },
        { type: 'system', label: 'Hệ thống', route: '/notification/system', color: 'purple', icon: FaCog },
    ];

    const fetchNotifications = async (route) => {
        setLoading(true);
        setError('');
        setNotifications([]);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để xem thông báo.');
            }

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}${route}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Lỗi xảy ra khi tải thông báo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const selectedCategory = categories.find((category) => category.type === selectedType);
        if (selectedCategory) {
            fetchNotifications(selectedCategory.route);
        }
    }, [selectedType]);

    const handleCategoryClick = (category) => {
        if (selectedType === category.type) {
            return; // Không làm gì nếu danh mục đã được chọn
        }
        setSelectedType(category.type);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6 text-center">Danh sách Thông Báo</h1>

                    {/* 4 lựa chọn */}
                    <div className="flex justify-center space-x-4 mb-8">
                        {categories.map((category) => {
                            const Icon = category.icon; // Lấy component icon từ category
                            return (
                                <button
                                    key={category.type}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-md font-semibold transition-all duration-200 
                    ${selectedType === category.type
                                            ? `bg-${category.color}-500 text-white`
                                            : `border-2 border-${category.color}-500 text-${category.color}-500 hover:bg-${category.color}-500 hover:text-white`
                                        }`}
                                >
                                    <Icon className="text-lg" />
                                    <span>{category.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Thông báo lỗi */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Danh sách thông báo */}
                    {loading ? (
                        <p className="text-center text-gray-600 animate-pulse">Đang tải thông báo...</p>
                    ) : notifications.length > 0 ? (
                        <div className="space-y-6">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.noti_id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    onClick={() => {
                                        if (notif.noti_type === 'order') {
                                            navigate(`/notification/${notif.noti_id}`);
                                        }
                                    }}
                                >
                                    <div className="flex items-start space-x-4">
                                        {notif.image_url ? (
                                            <img
                                                src={notif.image_url}
                                                alt={notif.noti_title}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                                                {notif.noti_title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Ngày đăng:{' '}
                                                {new Date(notif.created_at).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }).replace(/,/, '')}
                                            </p>
                                            <p className="text-gray-700 line-clamp-3">{notif.noti_content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedType ? (
                        <p className="text-center text-gray-600">Không có thông báo nào cho danh mục này.</p>
                    ) : (
                        <p className="text-center text-gray-600">Vui lòng chọn một danh mục để xem thông báo.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Notification;