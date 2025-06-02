import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Layout from '../components/Layout';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        Fullname: '',
        Email: '',
        PhoneNumber: '',
        Avatar: '',
        // Add other fields you want to update
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Fetch current user data to pre-fill the form (optional, but good UX)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/users/getUserById`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu người dùng.');
                }
                const data = await response.json();
                if (data && data[0]) {
                    setFormData({
                        Fullname: data[0].Fullname || '',
                        Email: data[0].Email || '',
                        PhoneNumber: data[0].PhoneNumber || '',
                        Avatar: data[0].Avatar || '',
                        // Set other fields from data[0]
                    });
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            // Replace with your actual update endpoint
            const response = await fetch(`${API_BASE_URL}/users/updateUser`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật hồ sơ thất bại.');
            }

            setSuccess('Hồ sơ đã được cập nhật thành công!');
            setLoading(false);
            // Optionally navigate back to profile page after a delay
            setTimeout(() => navigate('/profile'), 2000);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Cập nhật hồ sơ | Thay đổi thông tin cá nhân | VoucherHub</title>
                <meta name="description" content="Cập nhật hồ sơ, thay đổi thông tin cá nhân, email, số điện thoại, avatar, quản lý tài khoản tại VoucherHub." />
                <meta name="keywords" content="cập nhật hồ sơ, thay đổi thông tin, quản lý tài khoản, voucherhub" />
                <meta property="og:title" content="Cập nhật hồ sơ | Thay đổi thông tin cá nhân | VoucherHub" />
                <meta property="og:description" content="Cập nhật hồ sơ, thay đổi thông tin cá nhân, email, số điện thoại, avatar, quản lý tài khoản tại VoucherHub." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/update-profile" />
                <link rel="canonical" href="https://voucherhub.id.vn/update-profile" />
                {/* Schema WebPage */}
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Cập nhật hồ sơ",
                    "description": "Cập nhật hồ sơ, thay đổi thông tin cá nhân tại VoucherHub.",
                    "url": "https://voucherhub.id.vn/update-profile"
                  }
                `}</script>
            </Helmet>
            <Layout>
                <div className="container mx-auto mt-20 p-4 max-w-lg bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Chỉnh sửa Hồ sơ</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="Fullname" className="block text-gray-700 font-semibold mb-2">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="Fullname"
                                id="Fullname"
                                value={formData.Fullname}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Email" className="block text-gray-700 font-semibold mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                name="Email"
                                id="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="PhoneNumber" className="block text-gray-700 font-semibold mb-2">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="PhoneNumber"
                                id="PhoneNumber"
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Add more input fields for other profile data as needed */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/change-password')}
                                disabled={loading}
                                className="bg-gradient-to-r from-pink-400 to-blue-500 text-white py-2 px-6 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="text-gray-600 hover:text-blue-500 transition duration-200"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div >
        </Layout >
        </>
    );
};

export default UpdateProfile;