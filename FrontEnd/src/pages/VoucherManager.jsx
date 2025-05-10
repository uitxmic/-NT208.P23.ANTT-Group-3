import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Vui lòng đăng nhập để tiếp tục');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/posting/getAllPostingsForAdmin', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách voucher');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
        setError(data.message || 'Không có voucher nào khả dụng');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải voucher');
    } finally {
      setLoading(false);
    }
  };

  // Handle Activate Voucher
  const handleActivateVoucher = async (postId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://127.0.0.1:3000/posting/activate/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể kích hoạt voucher');
      }

      // Refresh vouchers after activation
      fetchVouchers();
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi kích hoạt voucher');
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Group vouchers by status
  const pendingVouchers = vouchers.filter(v => v.IsActive === 0 && v.IsVerified === 0);
  const activeVouchers = vouchers.filter(v => v.IsActive === 1 && v.IsVerified === 1);
  const expiredVouchers = vouchers.filter(v => v.IsActive === 0 && v.IsVerified === 1);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
            QUẢN LÝ VOUCHER
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Đang tải danh sách Voucher...</p>
          ) : (
            <div className="space-y-12">
              {/* Pending Vouchers */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Voucher đang chờ duyệt</h2>
                {pendingVouchers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pendingVouchers.map((voucher) => (
                      <VoucherCard
                        key={voucher.PostId}
                        voucher={voucher}
                        onActivate={handleActivateVoucher}
                        status="Pending"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-lg">Không có voucher đang chờ duyệt.</p>
                )}
              </div>

              {/* Active Vouchers */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Voucher đang hoạt động</h2>
                {activeVouchers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeVouchers.map((voucher) => (
                      <VoucherCard
                        key={voucher.PostId}
                        voucher={voucher}
                        status="Active"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-lg">Không có voucher đang hoạt động.</p>
                )}
              </div>

              {/* Expired Vouchers */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Voucher đã hết hạn</h2>
                {expiredVouchers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {expiredVouchers.map((voucher) => (
                      <VoucherCard
                        key={voucher.PostId}
                        voucher={voucher}
                        status="Expired"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-lg">Không có voucher đã hết hạn.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Reusable Voucher Card Component
const VoucherCard = ({ voucher, onActivate, status }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
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
            ▲ <span className="ml-1 text-gray-700 text-sm">{voucher.UpVote ?? 0}</span>
          </span>
          <span className="flex items-center text-red-500">
            ▼ <span className="ml-1 text-gray-700 text-sm">{voucher.UpDown ?? 0}</span>
          </span>
        </div>
        <div
          className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
            status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            status === 'Active' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}
        >
          {status === 'Pending' ? 'Đang chờ duyệt' :
           status === 'Active' ? 'Đang hoạt động' :
           'Đã hết hạn'}
        </div>
      </div>

      {/* Action Buttons */}
      {status === 'Pending' && (
        <div className="px-6 pb-6">
          <button
            onClick={() => onActivate(voucher.PostId)}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label={`Kích hoạt voucher ${voucher.PostName}`}
          >
            Kích hoạt Voucher
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;