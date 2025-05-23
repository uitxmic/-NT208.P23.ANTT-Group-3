import React, { use, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PurchaseHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [sortColumn, setSortColumn] = useState('CreateAt');
    const [sortOrder, setSortOrder] = useState('DESC');

    const fetchTransactions = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Please log in to view your purchase history.');
            return;
        }
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/getTransactionById?search=${encodeURIComponent(searchText)}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi lấy dữ liệu giao dịch.');
            }

            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [searchText, sortColumn, sortOrder]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            // Toggle sort order if the same column is clicked
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // Set new sort column and default to ASC
            setSortColumn(column);
            setSortOrder('ASC');
        }
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return <FaSort className="inline ml-2" />;
        return sortOrder === 'ASC' ? (
            <FaSortUp className="inline ml-2" />
        ) : (
            <FaSortDown className="inline ml-2" />
        );
    };

    return (
        <Layout>
            <div className="container mx-auto p-4" style={{ paddingTop: '60px' }}>
                <h1 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by ID, Seller, or Voucher"
                        className="p-2 border rounded w-full max-w-md"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center">Không tìm thấy giao dịch của người dùng.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th
                                        className="text-left p-4 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSort('TransactionId')}
                                    >
                                        Transaction ID {getSortIcon('TransactionId')}
                                    </th>
                                    <th
                                        className="text-left p-4 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSort('TransactionAmount')}
                                    >
                                        Amount {getSortIcon('TransactionAmount')}
                                    </th>
                                    <th
                                        className="text-left p-4 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSort('Seller')}
                                    >
                                        Seller
                                    </th>
                                    <th
                                        className="text-left p-4 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSort('CreateAt')}
                                    >
                                        Date {getSortIcon('CreateAt')}
                                    </th>
                                    <th
                                        className="text-left p-4 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSort('Status')}
                                    >
                                        Status {getSortIcon('Status')}
                                    </th>
                                    <th className="text-left p-4">
                                        Voucher Name
                                    </th>
                                    <th className="text-left p-4">
                                        Voucher Code
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction.TransactionId}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">{transaction.TransactionId}</td>
                                        <td className="p-4">{transaction.TransactionAmount != null
                                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                transaction.TransactionAmount * 1000
                                            )
                                            : '0 ₫'}</td>
                                        <td className="p-4">{transaction.Seller}</td>
                                        <td className="p-4">
                                            {new Date(transaction.CreateAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={
                                                    transaction.Status === 0
                                                        ? 'text-yellow-500'
                                                        : transaction.Status === 1
                                                            ? 'text-green-500'
                                                            : transaction.Status === 2
                                                                ? 'text-orange-500'
                                                                : transaction.Status === 3
                                                                    ? 'text-blue-500'
                                                                    : transaction.Status === 4
                                                                        ? 'text-red-500'
                                                                        : ''
                                                }
                                            >
                                                {transaction.Status === 0
                                                    ? 'Đang xử lý'
                                                    : transaction.Status === 1
                                                        ? 'Hoàn thành'
                                                        : transaction.Status === 2
                                                            ? 'Đang xử lý hoàn tiền'
                                                            : transaction.Status === 3
                                                                ? 'Xử lý hoàn tiền hoàn tất'
                                                                : transaction.Status === 4
                                                                    ? 'Từ chối hoàn tiền'
                                                                    : ''}
                                            </span>
                                        </td>
                                        <td className="p-4">{transaction.VoucherName}</td>
                                        <td className="p-4">{transaction.VoucherCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <ToastContainer />
            </div>
        </Layout>
    );
};

export default PurchaseHistory;