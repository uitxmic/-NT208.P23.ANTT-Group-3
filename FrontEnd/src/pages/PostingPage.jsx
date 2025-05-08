import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PostingList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hàm lấy danh sách voucher từ API
  const fetchVouchers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/posting/getAllPostings', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }

      const data = await response.json();
      console.log(data);
      if (Array.isArray(data)) {
        console.log('im here');
        setVouchers(data);
      } else {
        console.log('im here 2');
        setVouchers([]);
        setError(data.message || 'No vouchers available');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vouchers');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút "Buy Voucher"
  const handleBuyVoucher = (voucher) => {
    navigate('/payment', { state: { voucher } });
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Nội dung chính */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Các voucher hiện có</h1>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Hiển thị loading */}
          {loading ? (
            <p className="text-center">Đang tải Voucher...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.PostId}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    {/* Hình ảnh voucher với số lượng ở góc phải dưới ảnh */}
                    <div className="relative mb-4">
                      <img
                        src={voucher.VouImg || 'https://via.placeholder.com/150'}
                        alt={voucher.PostName}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        Số lượng: {voucher.Quantity}
                      </div>
                    </div>
                    {/* Thông tin voucher */}
                    <div className="relative">
                      <h2 className="text-xl font-semibold">{voucher.PostName}</h2>
                      <p className="text-gray-600">{voucher.Content}</p>
                      <p className="text-orange-600 font-bold mt-2">Giá: {voucher.Price}.000 đ</p>
                      <p className="text-gray-500 text-sm">
                        Expires: {new Date(voucher.Expire).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center text-green-600 text-lg">
                          ▲ <span className="ml-1 text-gray-700 text-sm">{voucher.UpVote}</span>
                        </span>
                        <span className="flex items-center text-red-500 text-lg">
                          ▼ <span className="ml-1 text-gray-700 text-sm">{voucher.DownVote ?? 0}</span>
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Status: {voucher.Status}</p>
                    </div>
                    {/* Nút Buy Voucher */}
                    <button
                      onClick={() => handleBuyVoucher(voucher)}
                      className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Buy Voucher
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full">No vouchers available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostingList;