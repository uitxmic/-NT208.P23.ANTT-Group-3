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

  const voucher = state?.voucher;

  useEffect(() => {
    if (!voucher) {
      setError('No voucher selected');
      setTimeout(() => navigate('/shop-vouchers'), 2000);
    }
  }, [voucher, navigate]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('access_token');
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
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  if (!voucher) {
    return (
      <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            No voucher selected. Redirecting to voucher list...
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  return (
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
              src={voucher?.VoucherImage || 'https://via.placeholder.com/150'}
              alt={voucher?.VoucherName}
              className="w-32 h-32 object-cover rounded-md"
            />
            <div>
              <h3 className="text-xl font-semibold">{voucher?.VoucherName}</h3>
              <p className="text-gray-600">{voucher?.Label}</p>
              <p className="text-gray-800 font-bold mt-2">Price: ${voucher?.Price}</p>
              <p className="text-gray-500 text-sm">
                Expires: {voucher?.ExpirationDay ? new Date(voucher.ExpirationDay).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>

          <UserBalance setBalance={setBalance} />

          {balance !== null ? (
            <p className="text-gray-600 mb-4">
              Your Balance: <span className="font-semibold">${balance}</span>
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
                <span>Pay with User Balance</span>
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
              {paymentMethod === 'bank' && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    Bank: <span className="font-semibold">Your Bank Name</span>
                  </p>
                  <p className="text-gray-600">
                    Account Number: <span className="font-semibold">1234-5678-9012</span>
                  </p>
                  <p className="text-gray-600">
                    Amount: <span className="font-semibold">${voucher?.Price}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className={`mt-6 w-full p-3 rounded-lg text-white transition duration-300 ${
              loading || balance === null ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading || balance === null}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Payment;