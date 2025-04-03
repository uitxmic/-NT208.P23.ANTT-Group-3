import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavigaBar'; // Navbar của bạn

const UserVoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hàm lấy danh sách voucher từ API
  const fetchVouchers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login'); // Chuyển hướng nếu chưa đăng nhập
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/voucher/getValidUserVoucher', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }

      const data = await response.json();
      // API trả về { message: "...", data: [...] }, nên lấy data
      if (data.message === 'Success') {
        setVouchers(data.data); // Lấy danh sách voucher từ data
      } else {
        setVouchers([]); // Nếu không có voucher, đặt mảng rỗng
        setError(data.message || 'No vouchers available');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Nội dung chính */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Available Vouchers</h1>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Hiển thị loading */}
        {loading ? (
          <p className="text-center">Loading vouchers...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <div
                  key={voucher.VoucherId}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  {/* Hình ảnh voucher */}
                  <img
                    src={voucher.VoucherImage || 'https://via.placeholder.com/150'}
                    alt={voucher.VoucherName}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  {/* Thông tin voucher */}
                  <h2 className="text-xl font-semibold">{voucher.VoucherName}</h2>
                  <p className="text-gray-600">{voucher.Label}</p>
                  <p className="text-gray-800 font-bold mt-2">Price: ${voucher.Price}</p>
                  <p className="text-gray-500 text-sm">
                    Expires: {new Date(voucher.ExpirationDay).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">No vouchers available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVoucherList;