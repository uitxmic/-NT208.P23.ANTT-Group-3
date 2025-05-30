import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { SearchAPI } from '../components/SearchFilterModal'; // Import SearchAPI
import Layout from '../components/Layout';

// Components con để hiển thị từng loại kết quả (bạn cần tạo các component này)
const VoucherCard = ({ voucher }) => (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold text-blue-600">{voucher.VoucherName}</h3>
        <p className="text-gray-700">Nhãn: {voucher.Label}</p>
        <p className="text-gray-600">Giá: {voucher.Price ? `${voucher.Price.toLocaleString()} đ` : 'N/A'}</p>
        <p className="text-sm text-gray-500">Người đăng: {voucher.Username}</p>
        <p className={`text-sm ${new Date(voucher.Expire) < new Date() ? 'text-red-500' : 'text-green-500'}`}>
            Hết hạn: {new Date(voucher.Expire).toLocaleDateString()}
        </p>
        {/* Thêm Link đến trang chi tiết voucher nếu có */}
        {/* <Link to={`/vouchers/${voucher.VoucherId}`} className="text-blue-500 hover:underline">Xem chi tiết</Link> */}
    </div>
);

const PostCard = ({ post }) => (
    <div className="flex bg-white border border-pink-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out mb-6">
        {/* Left Column: Image */}        <div className="w-1/3 pr-4 flex-shrink-0">
            <img 
                src={post.VouImg || 'https://via.placeholder.com/300x200.png?text=Post+Image'} 
                alt={post.Postname || 'Hình ảnh bài đăng'}
                className="w-full h-48 object-cover rounded-md shadow-sm"
            />
        </div>

        {/* Right Column: Content */}
        <div className="w-2/3 flex flex-col justify-between">
            <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-pink-600 mb-2 hover:text-pink-700 transition-colors">
                    {post.Postname}
                </h3>
                <div 
                    className="text-gray-700 text-sm lg:text-base mb-3 prose prose-sm max-h-24 overflow-hidden relative leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.Content ? post.Content.substring(0, 250) + (post.Content.length > 250 ? '...' : '') : '' }} 
                />
            </div>
            <div>
                <div className="text-xs text-gray-500 mb-1">
                    <span>Người đăng: </span>
                    <span className="font-medium text-pink-500 hover:underline">
                        {/* Optional: Link to user profile if available */}
                        {/* <Link to={`/profile/${post.UserId}`}>{post.Username}</Link> */}
                        {post.Username}
                    </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                    <span>Ngày đăng: </span>
                    <span className="font-medium">{new Date(post.Date).toLocaleDateString('vi-VN')}</span>
                </div>
                <Link 
                    to={`/postdetail/${post.PostId}`} 
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 text-xs lg:text-sm shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                >
                    Đọc thêm
                </Link>
            </div>
        </div>
    </div>
);

const UserCard = ({ user }) => {
    const formatAvgRate = (rate) => {
        if (rate === null || rate === undefined) return 'Chưa có';
        const numRate = parseFloat(rate);
        return isNaN(numRate) ? 'Chưa có' : numRate.toFixed(1);
    };

    const formatBalance = (balance) => {
        if (balance === null || balance === undefined) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance);
    };

    const avatarUrl = user.AvatarUrl || 'https://via.placeholder.com/150?text=User';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
            <img
                src={avatarUrl}
                alt={user.Username}
                className="w-24 h-24 rounded-full mb-4 object-cover transition-transform duration-300 hover:scale-110"
            />
            <h3 className="text-xl font-bold text-purple-700 mb-2">{user.Username}</h3>
            <div className="text-gray-700 text-sm space-y-2 w-full">
                <div className="flex justify-between">
                    <span className="font-medium">Họ tên:</span>
                    <span>{user.Fullname || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{user.Email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Số dư:</span>
                    <span>{formatBalance(user.Balance)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{user.PhoneNumber || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Xếp hạng trung bình:</span>
                    <span>{formatAvgRate(user.AvgRate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Trạng thái xác thực:</span>
                    <span className={user.IsVerified ? 'text-green-500' : 'text-red-500'}>
                        {user.IsVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                </div>
            </div>
            <Link to={user.UserId ? `/profile/${user.UserId}` : '#'}
                className={`mt-4 text-purple-500 hover:text-purple-700 text-sm font-medium transition-colors duration-200 ${!user.UserId ? 'pointer-events-none opacity-50' : ''}`}
            >
                Xem hồ sơ
            </Link>
        </div>
    );
};


const SearchResult = () => {
    const { type } = useParams(); // 'vouchers', 'posts', 'users'
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParamsString, setSearchParamsString] = useState('');
    const [pageTitle, setPageTitle] = useState('Kết quả tìm kiếm');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParams = {};
        for (const [key, value] of params.entries()) {
            queryParams[key] = value;
        }
        setSearchParamsString(location.search); // Lưu lại để dùng cho dependency array

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (type === 'vouchers') {
                    setPageTitle(`Kết quả tìm kiếm Voucher ${queryParams.searchTerm ? `cho "${queryParams.searchTerm}"` : ''}`);
                    data = await SearchAPI.searchVouchers(queryParams);
                } else if (type === 'posts') {
                    setPageTitle(`Kết quả tìm kiếm Bài đăng ${queryParams.searchTerm ? `cho "${queryParams.searchTerm}"` : ''}`);
                    data = await SearchAPI.searchPosts(queryParams);
                } else if (type === 'users') {
                     setPageTitle(`Kết quả tìm kiếm Người dùng ${queryParams.searchTerm ? `cho "${queryParams.searchTerm}"` : ''}`);
                    data = await SearchAPI.searchUsers(queryParams);
                } else {
                    throw new Error('Loại tìm kiếm không hợp lệ.');
                }
                setResults(data || []);
            } catch (err) {
                setError(err.message || 'Đã xảy ra lỗi khi tải kết quả.');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [type, location.search]); // Sử dụng location.search để theo dõi thay đổi của query params

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto p-4 text-center">
                    <svg className="animate-spin h-8 w-8 text-gray-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600">Đang tải kết quả...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return <Layout><div className="container mx-auto p-4 text-center text-red-500">Lỗi: {error}</div></Layout>;
    }

    const renderResults = () => {
        if (results.length === 0) {
            return <p className="text-center text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>;
        }

        if (type === 'vouchers') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((voucher) => <VoucherCard key={voucher.VoucherId} voucher={voucher} />)}
                </div>
            );
        } else if (type === 'posts') {
            return (
                <div className="space-y-6">
                    {results.map((post) => <PostCard key={post.PostId} post={post} />)}
                </div>
            );
        } else if (type === 'users') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((user) => <UserCard key={user.UserId} user={user} />)}
                </div>
            );
        }
        return null;
    };

    return (
        <Layout>
            <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{pageTitle}</h1>
                {renderResults()}
            </div>
        </Layout>
    );
};

export default SearchResult;