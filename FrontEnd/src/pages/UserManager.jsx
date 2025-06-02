import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('UserId'); // Mặc định sắp xếp theo UserId
    const [sortOrder, setSortOrder] = useState('DESC'); // Mặc định giảm dần
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/users/getUsers?sortBy=${sortBy}&sortOrder=${sortOrder}&searchTerm=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Không thể tải danh sách người dùng');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error(error.message || 'Đã xảy ra lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            // Nếu cột đã được chọn, đảo ngược thứ tự
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // Nếu chọn cột mới, đặt cột và mặc định sắp xếp giảm dần
            setSortBy(column);
            setSortOrder('DESC');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchUsers();
    }, [sortBy, sortOrder, searchTerm]); // Thêm searchTerm vào dependency array để gọi lại hàm khi nó thay đổi
    return (
        <>
            <Helmet>
                <title>Quản lý người dùng | Admin | VoucherHub</title>
                <meta name="description" content="Trang quản lý người dùng cho admin. Xem, tìm kiếm, sắp xếp, quản lý tài khoản, quyền hạn, hoạt động người dùng trên VoucherHub." />
                <meta name="keywords" content="quản lý người dùng, admin, tài khoản, quyền hạn, voucherhub" />
                <meta property="og:title" content="Quản lý người dùng | Admin | VoucherHub" />
                <meta property="og:description" content="Trang quản lý người dùng cho admin. Xem, tìm kiếm, sắp xếp, quản lý tài khoản, quyền hạn, hoạt động người dùng trên VoucherHub." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/admin/user-manager" />
                <link rel="canonical" href="https://voucherhub.id.vn/admin/user-manager" />
                {/* Schema WebPage */}
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Quản lý người dùng",
                    "description": "Trang quản lý người dùng cho admin trên VoucherHub.",
                    "url": "https://voucherhub.id.vn/admin/user-manager"
                  }
                `}</script>
            </Helmet>
            <Layout>
                <div className="container mx-auto p-4" style={{ paddingTop: '64px' }}>
                    <h1 className="text-2xl font-bold mb-4">Quản lý người dùng trong hệ thống</h1>
                    <div className="mb-4 flex gap-4">
                        <div>
                            <label htmlFor="searchTerm" className="mr-2">Tìm kiếm:</label>
                            <input
                                id="searchTerm"
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Nhập Fullname hoặc Username"
                                className="border p-2 rounded"
                            />
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        className="py-2 px-4 border-b cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('UserId')}
                                    >
                                        ID {sortBy === 'UserId' && (sortOrder === 'ASC' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b">Username</th>
                                    <th className="py-2 px-4 border-b">Tên người dùng</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Số điện thoại</th>
                                    <th
                                        className="py-2 px-4 border-b cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('AccountBalance')}
                                    >
                                        Số dư tài khoản {sortBy === 'AccountBalance' && (sortOrder === 'ASC' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="py-2 px-4 border-b cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('SoldAmount')}
                                    >
                                        Số tiền đã bán được {sortBy === 'SoldAmount' && (sortOrder === 'ASC' ? '↑' : '↓')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.UserId}>
                                        <td className="py-2 px-4 border-b">{user.UserId || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{user.Username || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{user.Fullname || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{user.Email || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{user.PhoneNumber || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">
                                            {user.AccountBalance != null
                                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                    user.AccountBalance * 1000
                                                )
                                                : '0 ₫'}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {user.SoldAmount != null
                                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                    user.SoldAmount * 1000
                                                )
                                                : '0 ₫'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <ToastContainer />
            </Layout>
        </>
    );
};

export default UserManager;