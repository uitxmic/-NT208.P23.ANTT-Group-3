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
    const [selectedVotes, setSelectedVotes] = useState({});
    const [selectedRatings, setSelectedRatings] = useState({});
    const [selectedPostIds, setSelectedPostIds] = useState({});

    const fetchTransactions = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/trade/getTransactionById?search=${encodeURIComponent(searchText)}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi lấy dữ liệu giao dịch.');
            }

            const data = await response.json();
            const updatedTransactions = data.map(transaction => ({
                ...transaction,
                isEligibleForRating: isWithinLastMonth(transaction.CreateAt) && transaction.IsRating !== 1
            }));
            setTransactions(updatedTransactions);
            console.log('data', data);
            // Populate selectedPostIds
            const postIds = {};
            updatedTransactions.forEach(transaction => {
                postIds[transaction.TransactionId] = transaction.PostId;
            });
            setSelectedPostIds(postIds);
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

    const isWithinLastMonth = (date) => {
        const now = new Date();
        const transactionDate = new Date(date);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return transactionDate >= oneMonthAgo && transactionDate <= now;
    };

    const handleVote = (transactionId, type) => {
        setSelectedVotes((prevVotes) => ({
            ...prevVotes,
            [transactionId]: prevVotes[transactionId] === type ? null : type,
        }));
    };

    const handleRating = (transactionId, star) => {
        setSelectedRatings((prevRatings) => ({
            ...prevRatings,
            [transactionId]: star,
        }));
    };

    const handleSubmitRating = async (transactionId) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const transaction = transactions.find(t => t.TransactionId === transactionId);
            const ratingData = {
                PostId: selectedPostIds[transactionId],
                Vote: selectedVotes[transactionId] === 'upvote' ? 1 : selectedVotes[transactionId] === 'downvote' ? -1 : 0,
                Rating: selectedRatings[transactionId],
                TransactionId: transactionId,
                UserIdseller: transaction?.UserIdseller,
            };

            const response = await fetch(`${API_BASE_URL}/rating/addRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Use session-based authentication
                body: JSON.stringify(ratingData),
            });

            if (response.ok) {
                toast.success('Đánh giá đã được gửi thành công!');
                fetchTransactions(); // Reload the transactions after successful submission
            } else {
                toast.error('Gửi đánh giá thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
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
                                    <th className="text-left p-4">
                                        Đánh giá
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <React.Fragment key={transaction.TransactionId}>
                                        <tr className="border-b hover:bg-gray-50">
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
                                                                    ? 'Từ chối hoàn tiền'
                                                                    : transaction.Status === 4
                                                                        ? 'Xử lý hoàn tiền hoàn tất'
                                                                        : ''}
                                                </span>
                                            </td>
                                            <td className="p-4">{transaction.VoucherName}</td>
                                            <td className="p-4">{transaction.VoucherCode}</td>
                                            <td className="p-4">
                                                {transaction.isEligibleForRating ? (
                                                    <div>
                                                        <button
                                                            className="p-2 border rounded bg-blue-500 text-white"
                                                            onClick={() => {
                                                                const dropdown = document.getElementById(`dropdown-${transaction.TransactionId}`);
                                                                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                                                            }}
                                                        >
                                                            Đánh giá ngay
                                                        </button>
                                                        <div
                                                            id={`dropdown-${transaction.TransactionId}`}
                                                            className="absolute bg-white border rounded shadow-md mt-2 p-4"
                                                            style={{ display: 'none' }}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <span>Đánh giá giao dịch:</span>
                                                                <button
                                                                    className={`p-2 border rounded ${
                                                                        selectedVotes[transaction.TransactionId] === 'upvote'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'border-green-500 text-green-500'
                                                                    }`}
                                                                    onClick={() => handleVote(transaction.TransactionId, 'upvote')}
                                                                >
                                                                    👍
                                                                </button>
                                                                <button
                                                                    className={`p-2 border rounded ${
                                                                        selectedVotes[transaction.TransactionId] === 'downvote'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'border-red-500 text-red-500'
                                                                    }`}
                                                                    onClick={() => handleVote(transaction.TransactionId, 'downvote')}
                                                                >
                                                                    👎
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center space-x-4 mt-2">
                                                                <span>Đánh giá người bán:</span>
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        className={`p-1 border rounded ${
                                                                            selectedRatings[transaction.TransactionId] >= star
                                                                                ? 'bg-yellow-500 text-white'
                                                                                : 'border-yellow-500 text-yellow-500'
                                                                        }`}
                                                                        onClick={() => handleRating(transaction.TransactionId, star)}
                                                                    >
                                                                        ★
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <button
                                                                className="p-2 border rounded bg-green-500 text-white mt-2"
                                                                onClick={() => handleSubmitRating(transaction.TransactionId)}
                                                            >
                                                                Gửi
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span>Đánh giá không khả dụng</span>
                                                )}
                                            </td>
                                        </tr>
                                    </React.Fragment>
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