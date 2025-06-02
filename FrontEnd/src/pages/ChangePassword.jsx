import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';


const ChangePassword = () => {
    const [formData, setFormData] = useState({
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    };

    const { OldPassword, NewPassword, ConfirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (NewPassword !== ConfirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            setLoading(false);
            return;
        }

        try {
            const hashedOldPassword = await hashPassword(OldPassword);

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/users/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ OldPassword: OldPassword, NewPassword: NewPassword }),
            });

            if (!response.ok) {
                throw new Error('Không thể thay đổi mật khẩu.');
            }

            const data = await response.json();
            if (data) {
                setSuccess('Mật khẩu đã được thay đổi thành công.');
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            } else {
                setError(data.error || 'Đã xảy ra lỗi.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Đổi mật khẩu | VoucherHub - Bảo mật tài khoản, đổi password an toàn</title>
                <meta name="description" content="Đổi mật khẩu tài khoản VoucherHub nhanh chóng, an toàn. Bảo vệ tài khoản, cập nhật password để tăng bảo mật khi sử dụng dịch vụ." />
                <meta name="keywords" content="đổi mật khẩu, đổi password, bảo mật, tài khoản, voucherhub" />
                <link rel="canonical" href="https://voucherhub.id.vn/change-password" />
                {/* Open Graph */}
                <meta property="og:title" content="Đổi mật khẩu | VoucherHub - Bảo mật tài khoản, đổi password an toàn" />
                <meta property="og:description" content="Đổi mật khẩu tài khoản VoucherHub nhanh chóng, an toàn. Bảo vệ tài khoản, cập nhật password để tăng bảo mật khi sử dụng dịch vụ." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/change-password" />
                <meta property="og:image" content="https://voucherhub.id.vn/og-change-password.jpg" />
                {/* Schema.org */}
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Đổi mật khẩu | VoucherHub",
                    "description": "Đổi mật khẩu tài khoản VoucherHub nhanh chóng, an toàn. Bảo vệ tài khoản, cập nhật password để tăng bảo mật khi sử dụng dịch vụ.",
                    "url": "https://voucherhub.id.vn/change-password"
                  }
                `}</script>
            </Helmet>
            <div className="container mx-auto mt-20 p-4 max-w-md bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thay đổi Mật khẩu</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="OldPassword" className="block text-gray-700 font-semibold mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            name="OldPassword"
                            id="OldPassword"
                            value={OldPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="NewPassword" className="block text-gray-700 font-semibold mb-2">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="NewPassword"
                            id="NewPassword"
                            value={NewPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="ConfirmPassword" className="block text-gray-700 font-semibold mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="ConfirmPassword"
                            id="ConfirmPassword"
                            value={ConfirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50 w-full sm:w-auto"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu Mật khẩu'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')} // Or navigate(-1) to go back
                            className="text-gray-600 hover:text-blue-500 transition duration-200"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );

};

export default ChangePassword;