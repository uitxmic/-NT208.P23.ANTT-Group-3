import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UserBalance from '../components/UserBalance';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [momoQRCodeUrl, setMomoQRCodeUrl] = useState(null);

  const cartItems = Array.isArray(state?.items)
    ? state.items
    : state?.voucher
      ? [{
        voucherId: state.voucher.VoucherId,
        postId: state.voucher.PostId,
        amount: state.voucher.Price,
        quantity: state.quantity || 1,
        userIdSeller: state.voucher.UserId,
        postName: state.voucher.PostName,
        vouImg: state.voucher.VouImg,
      }]
      : [];

  useEffect(() => {
    if (cartItems.length === 0) {
      setError('Không có sản phẩm nào được chọn để thanh toán');
      setTimeout(() => navigate('/cart'), 2000);
    }
  }, [cartItems, navigate]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.amount * item.quantity), 0);
  };

  async function getMomoQRCodeUrl(userId) {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/payment/create-payment-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartData: cartItems.map(item => ({
            VoucherId: item.voucherId,
            PostId: item.postId,
            Quantity: item.quantity,
            UserIdSeller: item.userIdSeller,
            ItemId: item.itemId,
          })),
          userIdBuyer: userId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get QR code');
      }
      const data = await response.json();
      return data.payUrl;
    } catch (error) {
      console.error('Error fetching MoMo QR code:', error.message);
      throw error;
    }
  }

  // Xóa các mục đã thanh toán khỏi giỏ hàng
  const handleUpdate = async (itemId, quantity) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/cart/updateCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          ItemId: itemId,
          Quantity: quantity,
        }),
      });
      if (!response.ok) throw new Error("Cập nhật giỏ hàng thất bại!");
    } catch (err) {
      alert(err.message || "Cập nhật giỏ hàng thất bại!");
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const totalAmount = calculateTotalPrice();

      if (paymentMethod === 'balance') {
        if (balance === null) throw new Error('Số dư chưa được tải');
        if (balance < totalAmount) throw new Error('Số dư không đủ để thanh toán');

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/trade/createCartTransaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            cartItems: cartItems.map(item => ({
              VoucherId: item.voucherId,
              PostId: item.postId,
              Amount: item.amount,
              Quantity: item.quantity,
              UserIdSeller: item.userIdSeller,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Thanh toán thất bại');
        }

        const data = await response.json();
        if (data.message === 'Success') {
          setSuccess('Thanh toán thành công, giao dịch của bạn đang được xử lý.');

          cartItems.forEach((item) => {
            if (item.itemId) {
              handleUpdate(item.itemId, 0);
            }
          });

          setTimeout(() => navigate('/user-vouchers'), 2000);
        } else {
          throw new Error(data.error || 'Thanh toán thất bại');
        }
      } else if (paymentMethod === 'bank') {
        setSuccess('Vui lòng hoàn tất thanh toán bằng tài khoản ngân hàng.');
      } else if (paymentMethod === 'momo') {
        const userId = JSON.parse(atob(document.cookie.split('; ').find(row => row.startsWith('session_id')).split('=')[1])).userId;
        const qrCodeUrl = await getMomoQRCodeUrl(userId);
        if (qrCodeUrl) {
          window.open(qrCodeUrl, '_blank');
          setSuccess('Vui lòng quét mã QR bằng ứng dụng MoMo để hoàn tất thanh toán.');
        } else {
          throw new Error('Không thể tạo mã QR MoMo');
        }
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi trong quá trình thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100 mt-5">
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Thanh toán</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {success}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4 border-b pb-4 last:border-b-0">
                <img
                  src={item.vouImg || 'https://via.placeholder.com/150'}
                  alt={item.postName || 'Voucher Image'}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-xl font-semibold">{item.postName}</h3>
                  <p className="text-orange-600  mt-2">
                    Giá: {''}
                    <span className="text-orange-600  mt-2">
                      {balance != null
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount * 1000)
                        : '0 ₫'}
                    </span>
                  </p>
                  <p className="text-orange-600  mt-2">Số lượng: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 text-right">
              <p className="text-xl font-bold text-orange-600">
                Tổng cộng: {''}
                <span className="text-xl font-bold text-orange-600">
                  {balance != null
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalPrice() * 1000)
                    : '0 ₫'}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Lựa chọn phương thức thanh toán</h2>

            <UserBalance setBalance={setBalance} />

            {balance !== null ? (
              <p className="text-gray-600 mb-4">
                Số dư tài khoản của bạn:{' '}
                <span className="text-sm font-semibold">
                  {balance != null
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance * 1000)
                    : '0 ₫'}
                </span>
              </p>
            ) : (
              <p className="text-gray-600 mb-4">Đang tải số dư...</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="balance"
                    checked={paymentMethod === 'balance'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio"
                  />
                  <span>Thanh toán với số dư tài khoản của bạn</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio"
                  />
                  <span>Thanh toán bằng tài khoản ngân hàng</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio"
                  />
                  <span>Thanh toán với ví MoMo</span>
                </label>
                {paymentMethod === 'momo' && (
                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-gray-700 mb-1">
                      Nhấn nút bên dưới để lấy mã QR và quét bằng ứng dụng MoMo.
                    </p>
                    <span className="text-xs text-yellow-700">
                      Lưu ý: Giao dịch này không được bảo vệ, bạn sẽ chuyển tiền trực tiếp cho người bán.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handlePayment}
              className={`mt-6 w-full p-3 rounded-lg text-white transition duration-300 ${loading || balance === null ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              disabled={loading || balance === null}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;