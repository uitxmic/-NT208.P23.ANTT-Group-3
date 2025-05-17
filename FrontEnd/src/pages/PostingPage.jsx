import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PostingList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Vui lòng đăng nhập để tiếp tục');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/posting/getAllPostings', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }

      const data = await response.json();
      console.log(data.result);
      if (Array.isArray(data)) {
        const flattenedVouchers = data
          .filter(item => item.result && Array.isArray(item.result))
          .flatMap(item => item.result);

        if (flattenedVouchers.length > 0) {
          setVouchers(flattenedVouchers);
        } else {
          setVouchers([]);
          setError('Không có voucher nào khả dụng');
        }

      } else {
        setVouchers([]);
        setError(data.message || 'No vouchers available');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vouchers');
    } finally {
      setLoading(false);
    }
  };

  // Handle Buy Voucher button click
  const handleBuyVoucher = (voucher) => {
    navigate('/payment', { state: { voucher } });
  };

  // Handle Add to Cart button click
  const handleAddToCart = async (voucher) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Vui lòng đăng nhập để tiếp tục');
      setLoading(false);
      return;
    }

    if (!voucher || typeof voucher.PostId === 'undefined') {
      setError('Không thể thêm voucher không hợp lệ vào giỏ hàng.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/cart/addToCart', { // Đảm bảo URL API này là chính xác
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm "Bearer " trước token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PostId: voucher.PostId }), // Gửi PostId của voucher
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể thêm vào giỏ hàng.');
      }

      alert('Đã thêm voucher vào giỏ hàng thành công!');

    } catch (err) {
      setError(err.message || 'Lỗi khi thêm vào giỏ hàng.');
      alert(`Lỗi: ${err.message || 'Không thể thêm vào giỏ hàng.'}`);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
            CÁC VOUCHER HIỆN TẠI TRÊN HỆ THỐNG
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Đang tải Voucher...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.PostId}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    {/* Voucher Image */}
                    <div className="relative">
                      <img
                        src={voucher.VouImg || 'https://via.placeholder.com/300x150'}
                        alt={voucher.PostName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-75 text-white text-sm font-medium px-3 py-1 rounded-full">
                        Số lượng: {voucher.Quantity}
                      </div>
                    </div>

                    {/* Voucher Details */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                        {voucher.PostName}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {voucher.Content}
                      </p>
                      <p className="text-orange-600 font-semibold text-lg mb-2">
                        Giá: {voucher.Price}.000 ₫
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        Hết hạn: {new Date(voucher.Expire).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center text-green-600">
                          ▲{' '}
                          <span className="ml-1 text-gray-700 text-sm">
                            {voucher.UpVote}
                          </span>
                        </span>
                        <span className="flex items-center text-red-500">
                          ▼{' '}
                          <span className="ml-1 text-gray-700 text-sm">
                            {voucher.DownVote ?? 0}
                          </span>
                        </span>
                      </div>
                      <div
                        className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${!voucher.Active
                          ? 'bg-green-100 text-white-700'
                          : 'bg-red-100 text-white-700'
                          }`}
                      >
                        {!voucher.Active ? 'Đang bán' : 'Không hoạt động'}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <div className="px-6 pb-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleBuyVoucher(voucher)}
                          className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${voucher.Quantity === 0
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'}
  `}
                          aria-label={`Mua voucher ${voucher.PostName}`}
                          disabled={voucher.Quantity === 0}
                        >
                          Mua Voucher
                        </button>
                        <button
                          onClick={() => handleAddToCart(voucher)}
                          className={`w-full py-2 font-semibold rounded-lg transition-colors duration-200 ${voucher.Quantity === 0
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'}
  `}
                          aria-label={`Thêm voucher ${voucher.PostName} vào giỏ hàng`}
                          disabled={voucher.Quantity === 0}
                        >
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600 text-lg">
                  Không có voucher nào hiện tại.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostingList;