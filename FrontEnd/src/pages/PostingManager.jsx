import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';


const PostManager = () => {
  const [postname, setPostname] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isNewVoucher, setIsNewVoucher] = useState(false);

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucherId(voucher.VoucherId);
    setPostname(voucher.VoucherName);
    setDescription(voucher.Label || '');
    setPrice(voucher.Price || '');
    setQuantity(voucher.Quantity);
    setImage(null);
    setIsNewVoucher(false);
  };

  const fetchVoucher = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/voucher/getVoucherByUserId`, {
        method: 'GET',
        credentials: 'include', // Use session-based authentication
      });

      if (!response.ok) {
        throw new Error('Unable to fetch vouchers.');
      }

      const data = await response.json();
      setVoucher(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vouchers.');
    }
  };

  const fetchPosts = async () => {
    try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/posting/getPostingsByUserId`, {
            method: 'GET',
            credentials: 'include', // Use session-based authentication
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
    } catch (error) {
        setError(error.message || 'An error occurred while fetching posts.');
    }
  };


  useEffect(() => {
    fetchVoucher();
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = {
      VoucherId: selectedVoucherId,
      Postname: postname,
      Content: description,
      VouImg: image || 'https://example.com/default-image.jpg',
      Price: price,
      Quantity: quantity,
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/posting/createPosting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Use session-based authentication
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      const data = await response.json();
      if (data[0]?.Message === 'Post Created') {
        setSuccess('Post created successfully!');
        setDescription('');
        setImage(null);
        setPostname('');
        setPrice('');
        setQuantity('');
        setSelectedVoucherId('');
        fetchPosts();
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen font-inter" style={{ paddingTop: '4rem' }}>
        <div className="flex flex-1 flex-col lg:flex-row p-4 lg:p-6 gap-6 items-start h-full">
          {/* Left Column: Voucher and Post Lists */}
          <div className="lg:w-2/3 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bài đăng</h1>

            {/* Voucher List */}
            {Array.isArray(voucher) && voucher.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Danh sách Voucher</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voucher.map((item, index) => (
                    <div
                      key={`${item.VoucherId}-${index}`}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => handleVoucherSelect(item)}
                    >
                      <img
                        src={item.VouImg}
                        alt={item.VoucherName}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="text-sm font-semibold text-gray-900">{item.VoucherName}</h3>
                      <p className="text-xs text-gray-600">Giá: {item.Price}k VNĐ</p>
                      <p className="text-xs text-gray-600">Số lượng: {item.Quantity}</p>
                      <p className="text-xs text-gray-600">
                        Hết hạn: {new Date(item.ExpirationDay).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post List */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Danh sách bài đăng</h2>
              {posts.length === 0 ? (
                <p className="text-sm text-gray-600">Chưa có bài đăng nào.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post, index) => (
                    <div key={`${post.PostId}-${index}`} className="border rounded-lg p-3">
                      {post.VoucherImage && (
                        <img
                          src={post.VoucherImage}
                          alt={post.VoucherName}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      <h3 className="text-sm font-semibold text-gray-900">{post.Postname}</h3>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-2">{post.Content}</p>
                      <p className="text-xs text-blue-500">{post.Label}</p>
                      <p
                        className={`text-xs font-semibold ${post.IsActive === 1 && post.IsVerified === 1
                          ? 'text-green-500' // Active
                          : post.IsActive === 0 && post.IsVerified === 1
                            ? 'text-red-500' // Inactive
                            : post.IsActive === 0 && post.IsVerified === 0
                              ? 'text-yellow-500' // Pending
                              : 'text-gray-500' // Default case, if any
                          }`}
                      >
                        {post.IsActive === 1 && post.IsVerified === 1
                          ? 'Active'
                          : post.IsActive === 0 && post.IsVerified === 1
                            ? 'Inactive'
                            : post.IsActive === 0 && post.IsVerified === 0
                              ? 'Pending'
                              : post.Status} {/* Fallback to post.Status or a default string */}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngày đăng: {new Date(post.Date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form and Notifications */}
          <div className="lg:w-1/3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:p-4 h-full">
            {/* Notifications */}
            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Tạo bài đăng</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="voucher" className="block text-sm font-medium text-gray-600 mb-1">
                    Tên Voucher
                  </label>
                  <select
                    id="voucher"
                    value={selectedVoucherId}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const numericVoucherId = Number(selectedValue);
                      const selected = voucher.find((v) => v.VoucherId === numericVoucherId);
                      if (selected) {
                        handleVoucherSelect(selected);
                      } else {
                        setIsNewVoucher(true);
                        setSelectedVoucherId('');
                        setPostname('');
                        setDescription('');
                        setPrice('');
                        setQuantity('');
                        setImage(null);
                      }
                    }}
                    className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Chọn voucher
                    </option>
                    <option value="new">Tạo voucher mới</option>
                    {Array.isArray(voucher) && voucher.length > 0 ? (
                      voucher.map((item, index) => (
                        <option key={`${item.VoucherId}-${index}`} value={item.VoucherId}>
                          {item.VoucherName}
                        </option>
                      ))
                    ) : (
                      <option disabled>Đang tải...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="postname" className="block text-sm font-medium text-gray-600 mb-1">
                    Tên bài đăng
                  </label>
                  <input
                    type="text"
                    id="postname"
                    value={postname || ''} // Default to an empty string
                    onChange={(e) => setPostname(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Nhập tên bài đăng"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    id="description"
                    value={description || ''} // Default to an empty string
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Nhập nội dung bài đăng"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
                      Giá (x1000 VNĐ)
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập giá"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 mb-1">
                      Số lượng
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    >
                      <option value="" disabled>
                        Chọn số lượng
                      </option>
                      {Array.from({ length: quantity }, (_, i) => i + 1).map((num, index) => (
                        <option key={`${num}-${index}`} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 mb-1">
                    URL hình ảnh (Tùy chọn)
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={image || ''} // Default to an empty string
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Nhập URL hình ảnh"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full p-2 rounded text-white text-sm font-medium transition duration-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  disabled={loading}
                >
                  {loading ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostManager;