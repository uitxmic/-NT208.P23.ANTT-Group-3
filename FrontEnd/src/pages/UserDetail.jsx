import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout'; // Giả sử bạn có Layout chung

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

            // Fetch thông tin người dùng
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
            console.log('User Data:', userData);
            setUser(userData[0]);


            // Fetch danh sách voucher
            const vouchersResponse = await fetch(`${API_BASE_URL}/vouchers/getByUserId/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!vouchersResponse.ok) {
                console.error('Không thể tải danh sách voucher');
                // Không throw error ở đây để vẫn hiển thị thông tin người dùng
                setVouchers([]);
            } else {
                const vouchersData = await vouchersResponse.json();
                setVouchers(vouchersData);
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin:', err);
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
                <div className="container mx-auto p-4 text-center">
                    <svg className="animate-spin h-8 w-8 text-gray-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto p-4 text-center text-red-500">Lỗi: {error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-4 md:p-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Hồ sơ người dùng</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Họ tên:</span>
                            <span className="text-gray-800">{user.Fullname || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Email:</span>
                            <span className="text-gray-800">{user.Email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Số điện thoại:</span>
                            <span className="text-gray-800">{user.PhoneNumber || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Xếp hạng trung bình:</span>
                            <span className="text-gray-800">{user.AvgRate ? user.AvgRate : 'Chưa có'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Trạng thái xác thực:</span>
                            <span className={user.IsVerified ? 'text-green-500' : 'text-red-500'}>
                                {user.IsVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bài đăng voucher</h3>
                    {vouchers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vouchers.map((voucher) => (
                                <div key={voucher.VoucherId} className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                    <h4 className="text-lg font-semibold text-blue-600">{voucher.VoucherName}</h4>
                                    <p className="text-gray-700">Nhãn: {voucher.Label}</p>
                                    <p className="text-gray-600">Giá: {voucher.Price ? `${voucher.Price.toLocaleString()} đ` : 'N/A'}</p>
                                    <p className={`text-sm ${new Date(voucher.Expire) < new Date() ? 'text-red-500' : 'text-green-500'}`}>
                                        Hết hạn: {new Date(voucher.Expire).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Người dùng chưa có bài đăng voucher nào.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default UserDetail;