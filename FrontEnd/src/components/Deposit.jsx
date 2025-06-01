import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ (lớn hơn 0)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/payment/create-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Use session-based authentication
                body: JSON.stringify({
                    amount: parseInt(amount),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const payURL = data.payUrl;
                window.location.href = payURL;
            } else {
                throw new Error(data.message || 'Failed to create payment');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while creating payment');

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="data:image/png;base64,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"
                        alt="MoMo Logo"
                        className="h-12"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Nạp tiền vào tài khoản
                </h2>
                <form onSubmit={handleDeposit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Số tiền (VNĐ)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Nhập số tiền cần nạp"
                            min="1000"
                            step="1000"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Nạp tiền qua MoMo'}
                    </button>
                </form>
                <p className="text-gray-600 text-sm text-center mt-4">
                    Đơn hàng sẽ hết hạn sau: <span className="text-pink-600 font-medium">1 giờ 40 phút</span>
                </p>
            </div>
        </div>
    );
};

export default Deposit;