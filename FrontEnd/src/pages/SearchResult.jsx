import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { SearchAPI } from '../components/SearchFilterModal';
import Layout from '../components/Layout';
import { Helmet } from "react-helmet";


const PostCard = ({ post }) => (
    <div className="flex bg-white border border-pink-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-6">
        <div className="w-1/3 pr-4 flex-shrink-0">
            <img 
                src={post.VouImg || 'https://via.placeholder.com/300x200.png?text=Post+Image'} 
                alt=""
                className="w-full h-48 object-cover rounded-l-lg"
            />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-pink-600 mb-2 hover:text-pink-700 transition-colors">
                    {post.Postname}
                </h3>
                <div 
                    className="text-gray-700 text-sm lg:text-base mb-3 prose prose-sm max-h-24 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: post.Content ? post.Content.substring(0, 250) + (post.Content.length > 250 ? '...' : '') : '' }} 
                />
            </div>
            <div>
                <div className="text-xs text-gray-500 mb-1">
                    <span>Người đăng: </span>
                    <span className="font-medium text-pink-500 hover:underline">{post.Username}</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                    <span>Ngày đăng: </span>
                    <span className="font-medium">{new Date(post.Date).toLocaleDateString('vi-VN')}</span>
                </div>
                <Link 
                    to={`/postdetail/${post.PostId}`} 
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 text-sm"
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

    const avatarUrl = user.AvatarUrl || 'https://via.placeholder.com/150?text=';

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center w-full min-h-[400px]">
            <img
                src={avatarUrl}
                alt=""
                className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-indigo-100"
            />
            <h3 className="text-xl font-bold text-indigo-700 mb-3">{user.Username}</h3>
            <div className="text-gray-700 text-sm space-y-3 w-full">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Họ tên:</span>
                    <span>{user.Fullname || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span>{user.Email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Số dư:</span>
                    <span>{formatBalance(user.Balance)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Số điện thoại:</span>
                    <span>{user.PhoneNumber || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Xếp hạng:</span>
                    <span>{formatAvgRate(user.AvgRate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Xác thực:</span>
                    <span className={user.IsVerified ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {user.IsVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                </div>
            </div>
            <Link 
                to={user.UserId ? `/profile/${user.UserId}` : '#'}
                className={`mt-4 inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 text-sm ${!user.UserId ? 'pointer-events-none opacity-50' : ''}`}
            >
                Xem hồ sơ
            </Link>
        </div>
    );
};

const SearchResult = () => {
    const { type } = useParams();
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageTitle, setPageTitle] = useState('Kết quả tìm kiếm');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParams = {};
        for (const [key, value] of params.entries()) {
            queryParams[key] = value;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (type === 'posts') {
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
    }, [type, location.search]);

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="text-lg text-gray-700">Đang tải kết quả...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">Lỗi: {error}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const renderResults = () => {
        if (results.length === 0) {
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Không tìm thấy kết quả nào phù hợp.</p>
                </div>
            );
        }

        if (type === 'vouchers') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((voucher) => <VoucherCard key={voucher.VoucherId} voucher={voucher} />)}
                </div>
            );
        } else if (type === 'posts') {
            return (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {results.map((post) => <PostCard key={post.PostId} post={post} />)}
                </div>
            );
        } else if (type === 'users') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {results.map((user) => <UserCard key={user.UserId} user={user} />)}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Helmet>
                <title>Kết quả tìm kiếm voucher, mã giảm giá, coupon | VoucherHub</title>
                <meta name="description" content="Tìm kiếm mã ưu đãi, coupon nhanh chóng, chính xác. Hàng ngàn ưu đãi hấp dẫn đang chờ bạn tại VoucherHub." />
                <meta name="keywords" content="tìm kiếm mã ưu đãi, tìm coupon, tìm khuyến mãi, ưu đãi, thương hiệu" />
                <meta property="og:title" content="Kết quả tìm kiếm voucher, mã giảm giá, coupon | VoucherHub" />
                <meta property="og:description" content="Tìm kiếm voucher, mã giảm giá, coupon nhanh chóng, chính xác. Hàng ngàn voucher, coupon, mã giảm giá đang chờ bạn tại VoucherHub." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://voucherhub.id.vn/search" />
                <link rel="canonical" href="https://voucherhub.id.vn/search" />
                {/* Schema SearchResultsPage */}
                <script type="application/ld+json">{`
                  {
                    "@context": "https://schema.org",
                    "@type": "SearchResultsPage",
                    "name": "Kết quả tìm kiếm voucher, mã giảm giá, coupon",
                    "description": "Kết quả tìm kiếm voucher, mã giảm giá, coupon tại VoucherHub.",
                    "url": "https://voucherhub.id.vn/search"
                  }
                `}</script>
            </Helmet>
            <Layout>
                <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{pageTitle}</h1>
                    {renderResults()}
                </div>
            </Layout>
        </>
    );
};

export default SearchResult;