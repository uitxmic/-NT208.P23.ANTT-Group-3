import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                const token = localStorage.getItem('access_token');
                
                if (!token) {
                    throw new Error('Unauthorized: No token provided');
                }

                const userResponse = await fetch(`${API_BASE_URL}/users/getUserById/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!userResponse.ok) {
                    if (userResponse.status === 401) {
                        throw new Error('Phiên đăng nhập hết hạn hoặc không hợp lệ');
                    } else if (userResponse.status === 404) {
                        throw new Error('Không tìm thấy người dùng');
                    }
                    throw new Error('Không thể tải thông tin người dùng');
                }
                
                const userData = await userResponse.json();
                setUser(userData[0]);

                const vouchersResponse = await fetch(`${API_BASE_URL}/vouchers/getByUserId/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!vouchersResponse.ok) {
                    setVouchers([]);
                } else {
                    const vouchersData = await vouchersResponse.json();
                    setVouchers(vouchersData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="text-lg text-gray-700">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">Lỗi: {error}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12 max-w-5xl">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-3xl font-bold text-indigo-600">
                                {user?.Fullname?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hồ sơ người dùng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium min-w-[120px]">Họ tên:</span>
                            <span className="text-gray-800">{user.Fullname || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium min-w-[120px]">Email:</span>
                            <span className="text-gray-800">{user.Email}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium min-w-[120px]">Số điện thoại:</span>
                            <span className="text-gray-800">{user.PhoneNumber || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium min-w-[120px]">Xếp hạng:</span>
                            <span className="text-gray-800">{user.AvgRate ? user.AvgRate : 'Chưa có'}</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium min-w-[120px]">Xác thực:</span>
                            <span className={`font-medium ${user.IsVerified ? 'text-green-600' : 'text-red-600'}`}>
                                {user.IsVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Bài đăng voucher</h3>
                    {vouchers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vouchers.map((voucher) => (
                                <div
                                    key={voucher.VoucherId}
                                    className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300"
                                >
                                    <h4 className="text-lg font-semibold text-indigo-600 mb-2">{voucher.VoucherName}</h4>
                                    <p className="text-gray-700 mb-1">Nhãn: {voucher.Label}</p>
                                    <p className="text-gray-600 mb-1">Giá: {voucher.Price ? `${voucher.Price.toLocaleString()} đ` : 'N/A'}</p>
                                    <p className={`text-sm font-medium ${new Date(voucher.Expire) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                                        Hết hạn: {new Date(voucher.Expire).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-6">Người dùng chưa có bài đăng voucher nào.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default UserDetail;