import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";


const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch vouchers from API
    const fetchVouchers = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/posting/getAllPostingsForAdmin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách voucher');
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setVouchers(data);
            } else {
                setVouchers([]);
                setError(data.message || 'Không có voucher nào khả dụng');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi tải voucher');
        } finally {
            setLoading(false);
        }
    };

    // Handle Activate Voucher
    const handleActivateVoucher = async (postId) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/posting/activePosting`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ PostId: postId }),
            });

            if (!response.ok) {
                throw new Error('Không thể kích hoạt voucher');
            }

            if (response.status === 200) {
                toast.success('Voucher đã được kích hoạt thành công');
            }

            // Refresh vouchers after activation
            fetchVouchers();
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi kích hoạt voucher');
        }
    };

    const handleDeactivateVoucher = async (postId) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/posting/deactivePosting`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ PostId: postId }),
            });
            if (!response.ok) {
                throw new Error('Không thể vô hiệu hóa voucher');
            }
            if (response.status === 200) {
                toast.success('Voucher đã được vô hiệu hóa thành công');
            }
            // Refresh vouchers after deactivation
            fetchVouchers();
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi vô hiệu hóa voucher');
        }
    };


    useEffect(() => {
        fetchVouchers();
    }, []);

    // Group vouchers by status
    const pendingVouchers = vouchers.filter(v => v.IsActive === 0 && v.IsVerified === 0); // Pending
    const activeVouchers = vouchers.filter(v => v.IsActive === 1 && v.IsVerified === 1); // Active
    const expiredVouchers = vouchers.filter(v => v.IsActive === 0 && v.IsVerified === 1); // Expired

    return (
        <>
            <Helmet>
                <title>Quản lý voucher (Admin) | Duyệt, kích hoạt, vô hiệu voucher | VoucherHub</title>
                <meta name="description" content="Trang quản lý mã ưu đãi cho admin. Duyệt, kích hoạt, vô hiệu hóa mã ưu đãi trên VoucherHub." />
                <meta name="keywords" content="quản lý admin, duyệt mã ưu đãi, kích hoạt, vô hiệu hóa, voucherhub" />
                <meta property="og:title" content="Quản lý voucher (Admin) | Duyệt, kích hoạt, vô hiệu voucher | VoucherHub" />
                <meta property="og:description" content="Trang quản lý voucher cho admin. Duyệt, kích hoạt, vô hiệu hóa voucher, mã giảm giá, coupon trên VoucherHub." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/admin/voucher-manager" />
                <meta property="og:image" content="https://voucherhub.id.vn/og-admin-voucher.jpg" />
                <link rel="canonical" href="https://voucherhub.id.vn/admin/voucher-manager" />
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Quản lý voucher (Admin) | VoucherHub",
                    "description": "Trang quản lý voucher cho admin. Duyệt, kích hoạt, vô hiệu hóa voucher, mã giảm giá, coupon trên VoucherHub.",
                    "url": "https://voucherhub.id.vn/admin/voucher-manager"
                  }
                `}</script>
            </Helmet>
            <Layout>
                <ToastContainer position="top-right" autoClose={2000} />
                <div className="min-h-screen bg-gray-50 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
                            QUẢN LÝ BÀI ĐĂNG
                        </h1>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <p className="text-center text-gray-600 text-lg">Đang tải danh sách các bài đăng...</p>
                        ) : (
                            <div className="space-y-12">
                                {/* Pending Vouchers */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài đăng đang chờ duyệt</h2>
                                    {pendingVouchers.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {pendingVouchers.map((voucher) => (
                                                <VoucherCard
                                                    key={voucher.PostId}
                                                    voucher={voucher}
                                                    onActivate={handleActivateVoucher}
                                                    status="Pending"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-600 text-lg">Không có bài đăng đang chờ duyệt.</p>
                                    )}
                                </div>

                                {/* Active Vouchers */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài đăng đang hoạt động</h2>
                                    {activeVouchers.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {activeVouchers.map((voucher) => (
                                                <VoucherCard
                                                    key={voucher.PostId}
                                                    voucher={voucher}
                                                    onActivate={handleDeactivateVoucher}
                                                    status="Active"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-600 text-lg">Không có bài đăng đang hoạt động.</p>
                                    )}
                                </div>

                                {/* Expired Vouchers */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài đăng đã hết hạn</h2>
                                    {expiredVouchers.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {expiredVouchers.map((voucher) => (
                                                <VoucherCard
                                                    key={voucher.PostId}
                                                    voucher={voucher}
                                                    status="Expired"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-600 text-lg">Không có bài đăng đã hết hạn.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
};

// Reusable Voucher Card Component
const VoucherCard = ({ voucher, onActivate, status }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Voucher Image */}
            <div className="relative">
                <img
                    src={voucher.VouImg || 'https://via.placeholder.com/300x150'}
                    alt={voucher.PostName}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-75 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Số lượng: {voucher.Quantity}
                </div>
            </div>

            {/* Voucher Details */}
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {voucher.PostName}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {voucher.Content}
                </p>
                <p className="text-orange-600 font-semibold text-lg mb-2">
                    Giá: {voucher.Price}.000 ₫
                </p>
                <p className="text-gray-500 text-sm mb-2">
                    Hết hạn: {new Date(voucher.Expire).toLocaleDateString('vi-VN')}
                </p>
                <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center text-green-600">
                        ▲ <span className="ml-1 text-gray-700 text-sm">{voucher.UpVote ?? 0}</span>
                    </span>
                    <span className="flex items-center text-red-500">
                        ▼ <span className="ml-1 text-gray-700 text-sm">{voucher.UpDown ?? 0}</span>
                    </span>
                </div>
                <div
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        status === 'Active' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                        }`}
                >
                    {status === 'Pending' ? 'Đang chờ duyệt' :
                        status === 'Active' ? 'Đang hoạt động' :
                            'Đã hết hạn'}
                </div>
            </div>

            {/* Action Buttons */}
            {status === 'Pending' && (
                <div className="px-6 pb-6">
                    <button
                        onClick={() => onActivate(voucher.PostId)}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        aria-label={`Kích hoạt voucher ${voucher.PostName}`}
                    >
                        Kích hoạt Bài đăng
                    </button>
                </div>
            )}
            {status === 'Active' && (
                <div className="px-6 pb-6">
                    <button
                        onClick={() => onActivate(voucher.PostId)}
                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors duration-200"
                        aria-label={`Kích hoạt voucher ${voucher.PostName}`}
                    >
                        Vô hiệu hóa bài đăng
                    </button>
                </div>
            )}
        </div>
    );
};

export default VoucherManagement;