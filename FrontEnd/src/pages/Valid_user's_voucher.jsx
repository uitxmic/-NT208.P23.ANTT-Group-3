import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/voucher/getValidUserVoucher`, {
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
        const processedVouchers = data.data.map(voucher => {
          let firstImageUrl = 'https://via.placeholder.com/150';
          if (voucher.VouImg) {
            const urls = voucher.VouImg.split(',').map(url => url.trim()).filter(url => url);
            if (urls.length > 0) {
              firstImageUrl = urls[0];
            }
          }
          return {
            ...voucher,
            _displayImgUrl: firstImageUrl, // Store the single URL to display
          };
        });
        setVouchers(processedVouchers);
        setVouchers(processedVouchers);
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

  const handleImageError = (voucherId) => {
    setVouchers(prevVouchers =>
      prevVouchers.map(v => {
        if (v.VoucherId === voucherId) {
          // Increment index to try next image
          return { ...v, _currentImgIndex: v._currentImgIndex + 1 };
        }
        return v;
      })
    );
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Nội dung chính */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
          <h1 className="text-4xl mt-5 font-extrabold text-gray-800 text-center mb-8 tracking-tight">
            Các voucher của bạn
          </h1>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl shadow-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Hiển thị loading */}
          {loading ? (
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-600">Loading vouchers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (

                  <div
                    key={voucher.VoucherId}
                    className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/voucher-detail/${voucher.VoucherId}`)}
                  >
                    {/* Hình ảnh voucher */}
                    <img
                      src={voucher._displayImgUrl || 'https://via.placeholder.com/150'}
                      alt={voucher.VoucherName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    {/* Thông tin voucher */}
                    <h2 className="text-xl font-bold text-blue-800 truncate">Tên voucher: {voucher.VoucherName}</h2>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Danh mục:</span> {voucher.Category}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Hết hạn: {new Date(voucher.ExpirationDay).toLocaleDateString('vi-VN')}
                    </p>
                    <button
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => alert(`Redeem voucher: ${voucher.VoucherCode}`)}
                    >
                      Đăng bán ngay
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500 text-lg">
                  No vouchers available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Button to add vouchers */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => navigate('/add-voucher')}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Add voucher"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </Layout>
  );
};

export default UserVoucherList;