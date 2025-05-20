import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const VoucherDetail = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVoucherDetail = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:3000/voucher/getVoucherDetail/${voucherId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.message === 'Success' && Array.isArray(data.data) && data.data.length > 0) {
                const voucherData = data.data[0]; // vì trả về là mảng có 1 phần tử

                // Tách ảnh đầu tiên từ chuỗi VouImg
                let firstImageUrl = 'https://via.placeholder.com/150';
                if (voucherData.VouImg) {
                    const imageUrls = voucherData.VouImg.split(',').map(url => url.trim()).filter(Boolean);
                    if (imageUrls.length > 0) {
                        firstImageUrl = imageUrls[0];
                    }
                }

                setVoucher({
                    ...voucherData,
                    _displayImgUrl: firstImageUrl,
                });
            } else {
                setError(data.message || 'Không tìm thấy thông tin voucher');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi tải thông tin voucher');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoucherDetail();
    }, [voucherId]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="ml-2 text-gray-600">Đang tải chi tiết voucher...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center shadow-sm">
                        {error}
                    </div>
                </div>
            </Layout>
        );
    }

    if (!voucher) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <p className="text-gray-500 text-lg">Không tìm thấy voucher.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 pt-16 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-md p-6">
                    {/* Cột trái: Hình ảnh */}
                    <div className="flex justify-center items-center">
                        {voucher._displayImgUrl ? (
                            <img
                                src={voucher._displayImgUrl}
                                alt={voucher.VoucherName}
                                className="w-full max-w-md h-72 object-cover rounded-lg border border-gray-200"
                            />
                        ) : (
                            <div className="w-full max-w-md h-72 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
                                <span className="text-gray-500 text-lg">Không có hình ảnh</span>
                            </div>
                        )}
                    </div>

                    {/* Cột phải: Thông tin và nút */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-800">
                                {voucher.VoucherName || 'Tên không xác định'}
                            </h2>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <span className="font-semibold text-gray-800">Mã voucher:</span>{' '}
                                    <div className="relative max-h-20 overflow-hidden" id="voucher-code">
                                        <span className="text-blue-600 break-words">{voucher.VoucherCode || 'Không có'}</span>
                                        {voucher.VoucherCode && voucher.VoucherCode.length > 50 && (
                                            <button
                                                className="absolute bottom-0 right-0 text-sm text-blue-500 bg-white px-1"
                                                onClick={() => {
                                                    const el = document.getElementById('voucher-code');
                                                    if (el.classList.contains('max-h-20')) {
                                                        el.classList.remove('max-h-20');
                                                        el.classList.add('max-h-full');
                                                    } else {
                                                        el.classList.add('max-h-20');
                                                        el.classList.remove('max-h-full');
                                                    }
                                                }}
                                            >

                                            </button>
                                        )}
                                    </div>
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-800">Danh mục:</span>{' '}
                                    {voucher.Category || 'Không xác định'}
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-800">Ngày hết hạn:</span>{' '}
                                    {voucher.ExpirationDay && !isNaN(new Date(voucher.ExpirationDay).getTime())
                                        ? new Date(voucher.ExpirationDay).toLocaleDateString('vi-VN')
                                        : 'Không xác định'}
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-800">Giá trị:</span>{' '}
                                    {voucher.Value
                                        ? new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(voucher.Value)
                                        : 'Không xác định'}
                                </p>
                            </div>
                        </div>

                        {/* Nút thao tác */}
                        <div className="mt-6 flex flex-col md:flex-row gap-4">
                            <button
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                                onClick={() => alert(`Sử dụng voucher: ${voucher.VoucherCode}`)}
                            >
                                Sử dụng ngay
                            </button>
                            <button
                                className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold shadow-sm"
                                onClick={() => navigate('/user-vouchers')}
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VoucherDetail;
