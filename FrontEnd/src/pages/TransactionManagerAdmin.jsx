import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";

const TransactionManagerAdmin = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/getTransactionForAdmin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/completeTransaction`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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

    const handleAcceptRefund = async (transactionId) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/acceptRefund`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ TransactionId: transactionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể chấp nhận hoàn tiền.');
            }

            if (response.status === 200) {
                toast.success(`Giao dịch ${transactionId} đã được chấp nhận hoàn tiền!`);
            }

            if (response.status === 400) {
                const errorData = await response.json();
                toast.error(`Lỗi: ${errorData.error}`);
            }

            // Update the transaction status locally
            setTransactions(transactions.map(transaction =>
                transaction.TransactionId === transactionId
                    ? { ...transaction, Status: 4 }
                    : transaction
            ));

            toast.success(`Giao dịch ${transactionId} đã được hoàn thành!`);
        } catch (err) {
            console.error('Lỗi khi hoàn thành giao dịch:', err);
            toast.error(err.message);
        }
    };

    const handleRejectRefund = async (transactionId) => {   
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/rejectRefund`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ TransactionId: transactionId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể từ chối hoàn tiền.');
            }
            if (response.status === 200) {
                toast.success(`Giao dịch ${transactionId} đã được từ chối hoàn tiền!`);
            }
            if (response.status === 400) {
                const errorData = await response.json();
                toast.error(`Lỗi: ${errorData.error}`);
            }
            // Update the transaction status locally
            setTransactions(transactions.map(transaction =>
                transaction.TransactionId === transactionId
                    ? { ...transaction, Status: 3 }
                    : transaction
            ));
            toast.success(`Giao dịch ${transactionId} đã được từ chối hoàn tiền!`);
        } catch (err) {
            console.error('Lỗi khi từ chối hoàn tiền:', err);
            toast.error(err.message);
        }
    };
    
    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <>
            <Helmet>
                <title>Quản lý giao dịch | Admin | VoucherHub</title>
                <meta name="description" content="Trang quản lý giao dịch cho admin. Xem, xác nhận, hoàn thành các giao dịch mua bán voucher, coupon, mã giảm giá trên VoucherHub." />
                <meta name="keywords" content="quản lý giao dịch, admin, giao dịch voucher, giao dịch coupon, xác nhận giao dịch, voucherhub" />
                <meta property="og:title" content="Quản lý giao dịch | Admin | VoucherHub" />
                <meta property="og:description" content="Trang quản lý giao dịch cho admin. Xem, xác nhận, hoàn thành các giao dịch mua bán voucher, coupon, mã giảm giá trên VoucherHub." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/admin/transaction-manager" />
                <meta property="og:image" content="https://voucherhub.id.vn/og-admin-transaction.jpg" />
                <link rel="canonical" href="https://voucherhub.id.vn/admin/transaction-manager" />
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Quản lý giao dịch | Admin | VoucherHub",
                    "description": "Trang quản lý giao dịch cho admin. Xem, xác nhận, hoàn thành các giao dịch mua bán voucher, coupon, mã giảm giá trên VoucherHub.",
                    "url": "https://voucherhub.id.vn/admin/transaction-manager"
                  }
                `}</script>
            </Helmet>
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
                                                {transaction.Status === 4 && <span className="text-red-500">Đã hoàn tiền</span>}
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
                                                {transaction.Status === 4 && (
                                                    <span className="text-gray-500">Đã hoàn tiền</span>
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
        </>
    );
};

export default TransactionManagerAdmin;