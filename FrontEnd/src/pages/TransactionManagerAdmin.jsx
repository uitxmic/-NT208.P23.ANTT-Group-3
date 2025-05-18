import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionManagerAdmin = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Bạn không phải là Admin, không thể truy cập trang này');
            setLoading(false);
            return;
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/getTransactionForAdmin`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể lấy danh sách giao dịch.');
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setTransactions(data);
            } else {
                setTransactions([]);
                setError('Không có giao dịch nào.');
            }
        } catch (err) {
            console.error('Lỗi khi lấy danh sách giao dịch:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTransaction = async (transactionId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Bạn không có quyền thực hiện hành động này.');
            return;
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/completeTransaction`, {
                method: 'PATCH',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ TransactionId: transactionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể hoàn thành giao dịch.');
            }

            // Update the transaction status locally
            setTransactions(transactions.map(transaction =>
                transaction.TransactionId === transactionId
                    ? { ...transaction, Status: 1 }
                    : transaction
            ));

            toast.success(`Giao dịch ${transactionId} đã được hoàn thành!`);
        } catch (err) {
            console.error('Lỗi khi hoàn thành giao dịch:', err);
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-4" style={{ paddingTop: '60px' }}> 
                <h1 className="text-2xl font-bold mb-4 text-center">Quản Lý Giao Dịch Admin</h1>
                {loading ? (
                    <div className="text-center text-gray-600">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID Giao Dịch</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Số Tiền</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Người Mua</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Người Bán</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Ngày Tạo</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Trạng Thái</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Bài Đăng</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Mã Voucher</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <tr key={transaction.TransactionId} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">{transaction.TransactionId}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">{transaction.TransactionAmount}.000đ</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">{transaction.Buyer}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">{transaction.Seller}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">
                                            {new Date(transaction.CreateAt).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm">
                                            {transaction.Status === 0 && <span className="text-yellow-500">Đang chờ</span>}
                                            {transaction.Status === 1 && <span className="text-green-500">Đã hoàn thành</span>}
                                            {transaction.Status === 2 && <span className="text-blue-500">Yêu cầu hoàn tiền</span>}
                                            {transaction.Status === 3 && <span className="text-red-500">Từ chối hoàn tiền</span>}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">{transaction.Postname}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">
                                            {transaction.VoucherCode || 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-900">
                                            {transaction.Status === 0 && (
                                                <button
                                                    onClick={() => handleCompleteTransaction(transaction.TransactionId)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                                >
                                                    Xác nhận Hoàn thành
                                                </button>
                                            )}
                                            {transaction.Status === 1 && (
                                                <span className="text-gray-500">Đã hoàn thành</span>
                                            )}
                                            {transaction.Status === 2 && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAcceptRefund(transaction.TransactionId)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                    >
                                                        Chấp Nhận Hoàn Tiền
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRefund(transaction.TransactionId)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                    >
                                                        Từ Chối Hoàn Tiền
                                                    </button>
                                                </div>
                                            )}
                                            {transaction.Status === 3 && (
                                                <span className="text-gray-500">Đã từ chối hoàn tiền</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </div>
        </Layout>
    );
};

export default TransactionManagerAdmin;