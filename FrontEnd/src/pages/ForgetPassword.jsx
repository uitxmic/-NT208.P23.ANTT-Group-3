import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.status === 200) {
                toast.success('Mật khẩu tạm thời đã được gửi qua email. Vui lòng kiểm tra!');
                setEmail('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quên mật khẩu</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email của bạn
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Đang gửi...' : 'Lấy lại mật khẩu'}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                    Quay lại
                </button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default ForgetPassword;