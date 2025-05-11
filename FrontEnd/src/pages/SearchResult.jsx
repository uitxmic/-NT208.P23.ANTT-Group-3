import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { SearchAPI } from '../components/SearchFilterModal'; // Import SearchAPI
import Layout from '../components/Layout'; // Giả sử bạn có Layout chung

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
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold text-green-600">{post.Postname}</h3>
        {/* Giả sử content là HTML, cần xử lý an toàn */}
        <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: post.Content && post.Content.substring(0, 150) + '...' }} />
        <p className="text-sm text-gray-500">Người đăng: {post.Username}</p>
        <p className="text-sm text-gray-500">Ngày đăng: {new Date(post.Date).toLocaleDateString()}</p>
        <Link to={`/news/${post.PostId}`} className="text-green-500 hover:underline mt-2 inline-block">Đọc thêm</Link>
    </div>
);

const UserCard = ({ user }) => {

    const formatAvgRate = (rate) => {
        if (rate === null || rate === undefined) return 'Chưa có';
        const numRate = parseFloat(rate);
        return isNaN(numRate) ? 'Chưa có' : numRate.toFixed(1);
    };
    return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold text-purple-600">{user.Username}</h3>
        <p className="text-gray-700">Họ tên: {user.Fullname || 'Chưa cập nhật'}</p>
        <p className="text-gray-600">Email: {user.Email}</p>
        <p className="text-sm text-gray-500">Đánh giá trung bình: {formatAvgRate(user.AvgRate)}</p>
        <p className="text-sm text-gray-500">Vai trò: {user.RoleID === 1 ? 'Admin' : (user.UserRoleId === 2 ? 'User' : 'Seller')}</p>
        {/* Thêm Link đến trang hồ sơ người dùng nếu có */}
        <Link to={`/profile/${user.UserId}`} className="text-purple-500 hover:underline mt-2 inline-block">Xem hồ sơ</Link>
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
        return <Layout><div className="container mx-auto p-4 text-center">Đang tải kết quả...</div></Layout>;
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