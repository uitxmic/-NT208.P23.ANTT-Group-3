import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotifDetail = () => {
    const { notifId } = useParams();
    const navigate = useNavigate();

    const [notif, setNotif] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [TransactionId, setTransactionId] = useState(null);

    useEffect(() => {
        const fetchNotifDetail = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const NotifId = parseInt(notifId, 10);
                console.log('Fetching notification with ID:', NotifId);
                const response = await axios.get(`${API_BASE_URL}/notification/getNotiById/${NotifId}`);
                const data = response.data;
                console.log('Response data:', data);
                setTransactionId(data.transaction_id);
                if (data && data.noti_id !== undefined) {
                    console.log('Notification data:', data);
                    setNotif(data);
                } else {
                    setNotif(null);
                    setError('Không có thông báo nào từ API');
                }
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông báo. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchNotifDetail();
    }, [notifId]);

    const handleConfirmReceipt = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/completeTransaction`, {
                method: 'PATCH',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ TransactionId: TransactionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể từ chối hoàn tiền.');
            }
            if (response.status === 200 || data.message === 'Success') {
                toast.success(`Giao dịch ${TransactionId} đã được xác nhận!`);
            }

        } catch (err) {
            setError('Không thể xác nhận nhận đơn hàng. Vui lòng thử lại.');
        }
    };

    const handleRefundRequest = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            await axios.post(`${API_BASE_URL}/notification/requestRefund/${notifId}`);
            alert('Yêu cầu hoàn tiền đã được gửi!');
            navigate(-1); // Navigate back after request
        } catch (err) {
            setError('Không thể gửi yêu cầu hoàn tiền. Vui lòng thử lại.');
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

    if (!notif) {
        return <div className="text-center py-10">Không tìm thấy thông báo.</div>;
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 pt-20">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {notif.noti_title || 'Tiêu đề không có'}
                    </h1>
                    {notif.VouImg && (
                        <img
                            src={notif.VouImg}
                            alt={notif.noti_title || 'Hình ảnh thông báo'}
                            className="w-full h-auto object-cover rounded-md mb-4 max-h-96"
                        />
                    )}
                    <p className="text-gray-600 mb-4">
                        {notif.noti_content || 'Nội dung không có'}
                    </p>
                    <div className="border-t border-gray-200 pt-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Chi tiết đơn hàng</h2>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Mã đơn hàng:</span> {notif.PostId || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Mã voucher:</span> {notif.VoucherCode || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Số tiền giao dịch:</span> {notif.TransactionAmount ? `${notif.TransactionAmount} VNĐ` : 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Trạng thái:</span> {notif.Status === 1 ? 'Đã giao' : 'Chưa xác định'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Người mua:</span> {notif.Buyer || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Người bán:</span> {notif.Seller || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Mã giao dịch:</span> {notif.transaction_id || 'N/A'}
                        </p>
                        <p className="text-gray-500">
                            <span className="font-medium">Ngày nhận:</span>{' '}
                            {notif.updated_at
                                ? new Date(notif.updated_at).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : 'Ngày không hợp lệ'}
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleConfirmReceipt}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Đã nhận được hàng
                        </button>
                        <button
                            onClick={handleRefundRequest}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Yêu cầu hoàn tiền
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Layout>
    );
};

export default NotifDetail;