import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoucherDetail = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVoucherCode, setSelectedVoucherCode] = useState(''); // State để lưu mã voucher được chọn
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State cho modal xác nhận

    const fetchVoucherDetail = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/voucher/getVoucherDetail/${voucherId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok && data.message === 'Success' && Array.isArray(data.data) && data.data.length > 0) {
                const voucherData = data.data[0];

                let firstImageUrl = 'https://via.placeholder.com/150';
                if (voucherData.VouImg) {
                    const imageUrls = voucherData.VouImg.split(',').map(url => url.trim()).filter(Boolean);
                    if (imageUrls.length > 0) {
                        firstImageUrl = imageUrls[0];
                    }
                }

                const voucherCodes = voucherData.VoucherCode
                    ? voucherData.VoucherCode.split(',').map(code => code.trim()).filter(Boolean)
                    : [];

                setVoucher({
                    ...voucherData,
                    _displayImgUrl: firstImageUrl,
                    voucherCodes,
                });

                if (voucherCodes.length > 0) {
                    setSelectedVoucherCode(voucherCodes[0]);
                }
            } else {
                setError(data.message || 'Không tìm thấy thông tin voucher');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi tải thông tin voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleUseVoucher = async () => {
        if (!selectedVoucherCode) {
            alert('Vui lòng chọn một mã voucher để sử dụng.');
            return;
        }

        // Hiển thị modal xác nhận
        setShowConfirmModal(true);
    };

    const confirmUseVoucher = async () => {
        setShowConfirmModal(false);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/voucher/useVoucher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    VoucherCode: selectedVoucherCode,
                }),
            });

            const data = await response.json();

            if (response.ok && data.message === 'Success') {
                toast.success('Sử dụng voucher thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        backgroundColor: '#4CAF50',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                });
                setTimeout(() => navigate('/user-vouchers'), 3000);
            } else {
                alert(data.message || 'Không thể sử dụng voucher');
            }
        } catch (err) {
            alert('Đã xảy ra lỗi khi sử dụng voucher: ' + (err.message || 'Lỗi không xác định'));
        }
    };

    const cancelUseVoucher = () => {
        setShowConfirmModal(false); // Đóng modal khi hủy
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
                                className="w-full h-auto object-contain rounded-md mb-4" />
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
                                    {voucher.voucherCodes && voucher.voucherCodes.length > 0 ? (
                                        <select
                                            value={selectedVoucherCode}
                                            onChange={(e) => setSelectedVoucherCode(e.target.value)}
                                            className="border border-gray-300 rounded-lg p-1 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {voucher.voucherCodes.map((code, index) => (
                                                <option key={index} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-gray-500">Không có mã</span>
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-800">Số lượng còn lại:</span>{' '}
                                    {voucher.Amount || 'Không xác định'}
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
                                onClick={handleUseVoucher}
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

            {/* Modal xác nhận tùy chỉnh */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Xác nhận sử dụng voucher</h3>
                        <p className="text-gray-700 mb-6">Bạn muốn sử dụng mã voucher này chứ: <span className="font-medium text-blue-600">{selectedVoucherCode}</span>?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                onClick={confirmUseVoucher}
                            >
                                OK
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                onClick={cancelUseVoucher}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
        </Layout>
    );
};

export default VoucherDetail;