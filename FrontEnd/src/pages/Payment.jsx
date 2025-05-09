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

  const voucher = state?.voucher;

  useEffect(() => {
    if (!voucher) {
      setError('No voucher selected');
      setTimeout(() => navigate('/shop-vouchers'), 2000);
    }
  }, [voucher, navigate]);

  async function getMomoQRCodeUrl(amount, userId, voucher, token) {
    try {
      console.log('kkkkkk');
      console.log(token);
      const response = await fetch('http://localhost:3000/payment/create-payment-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          amount,
          userId,
          voucherId: voucher.VoucherId,
          postId: voucher.PostId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to get QR code');
      }
      const data = await response.json();
      return data.payUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('access_token');
    console.log('hrrr', token);
    if (!token) {
      setError('Please login to continue');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
      return;
    }

    try {
      if (paymentMethod === 'balance') {
        if (balance === null) {
          throw new Error('Balance not loaded yet');
        }
        if (balance < voucher.Price) {
          throw new Error('Insufficient balance');
        }

        const response = await fetch('http://127.0.0.1:3000/trade/paymentbybalance', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            VoucherId: voucher.VoucherId,
            paymentMethod: 'balance',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process payment');
        }

        const data = await response.json();
        if (data.message === 'Success') {
          setSuccess('Payment successful! Voucher purchased.');
          setTimeout(() => navigate('/shop-vouchers'), 2000);
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else if (paymentMethod === 'bank') {
        setSuccess('Please complete the payment using your bank account.');
      } else if (paymentMethod === 'momo') {
        console.log(voucher.Price);
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        console.log('caccc', userId);
        console.log('voucher', voucher);
        const qrCodeUrl = await getMomoQRCodeUrl(voucher.Price*1000, userId, voucher, token);
        console.log(qrCodeUrl);
        if (qrCodeUrl) {
          window.open(qrCodeUrl, '_blank'); // Open QR code URL in new tab
          setSuccess('Bạn vui lòng quét mã QR bằng ứng dụng MoMo để hoàn tất thanh toán.');
        } else {
          throw new Error('Failed to generate MoMo QR code');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same, but modify the MoMo section in the JSX
  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="flex-1 p-6">
          <Layout>
            <div className="flex flex-col min-h-screen bg-gray-100">
              <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Payment</h1>

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
                  <h2 className="text-2xl font-bold mb-4">Voucher Details</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={voucher?.VouImg || 'https://via.placeholder.com/150'}
                      alt={voucher?.PostName || 'Voucher Image'}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{voucher?.PostName}</h3>
                      <p className="text-gray-600">{voucher?.Label}</p>
                      <p className="text-orange-600 font-bold mt-2">Giá: {voucher.Price}.000 ₫</p>
                      <p className="text-gray-500 text-sm">
                        Ngày hết hạn: {voucher?.Expire ? new Date(voucher.Expire).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Lựa chọn phương thức thanh toán</h2>

                  <UserBalance setBalance={setBalance} />

                  {balance !== null ? (
                    <p className="text-gray-600 mb-4">
                      Số dư tài khoản của bạn: <span className="font-semibold">{balance}.000 ₫</span>
                    </p>
                  ) : (
                    <p className="text-gray-600 mb-4">Loading balance...</p>
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
                        <span>Pay with Bank Account</span>
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
                    {loading ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;