import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { jwtDecode } from 'jwt-decode'; // Correct default import

// Hàm lấy UserId từ AccessToken
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token); // Use jwtDecode (default export)
    console.log('Decoded token:', decoded); // Debug: Log the decoded token
    return decoded.UserId;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const PostManager = () => {
  const [postname, setPostname] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  // Token hardcode
  const [voucher, setVoucher] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState('');

  // Hàm lấy VoucherId từ UserId
  const fetchVoucher = async () => {
    try {
      const UserId = getUserIdFromToken(token);
      const response = await fetch(`http://localhost:3000/voucher/getVoucherByUserId/${UserId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voucher ID');
      }

      const data = await response.json();
      setVoucher(data); // Giả sử bạn muốn lấy voucher đầu tiên trong danh sách
      console.log('Voucher data:', data); // Debug
    } catch (error) {
      console.error('Error fetching voucher ID:', error);
      setError(error.message || 'An error occurred while fetching voucher ID.');
      return null;
    }
  };

  // Hàm lấy danh sách bài đăng
  const fetchPosts = async () => {
    try {
      const UserId = getUserIdFromToken(token);
      if (!UserId) {
        setError('Invalid token. UserId not found.');
        return;
      }

      console.log('Fetching posts for UserId:', UserId);
      console.log('Fetching posts for UserId:', UserId); // Debug
      const response = await fetch(`http://localhost:3000/posting/getPostingsByUserId/${UserId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      console.log('Posts data:', data); // Debug
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'An error occurred while fetching posts.');
    }
  };

  // Gọi API lấy danh sách bài đăng khi component được mount
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchVoucher();
  }, []);



  // Hàm xử lý khi người dùng chọn file hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Hàm xử lý khi người dùng nhấn nút "Đăng bài"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const UserId = getUserIdFromToken(token);
    if (!UserId) {
      setError('Invalid token. UserId not found.');
      setLoading(false);
      return;
    }

    const jsonData = {
      VoucherId: 1,
      VoucherId: selectedVoucherId,
      Postname: postname,
      Content: description,
      VouImg: image ? image.name : null,
      Price: 0,
      Quantity: 0,
    };
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log('Creating post with data:', { postname, description}); // Debug
      console.log('Creating post with data:', { postname, description }); // Debug
      const response = await fetch('http://localhost:3000/posting/createPosting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('Create post response:', data); // Debug
      if (data[0]?.Message === 'Post Created') {
        setSuccess('Post created successfully!');
        setDescription('');
        setImage(null);
        fetchPosts();
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Rendering PostManager...'); // Debug

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8">Post Management</h1>

          {/* Hiển thị các Voucher trả về từ API getVoucherByUserId */}
          {Array.isArray(voucher) && voucher.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Voucher Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {voucher.map((item) => (
                  <div key={item.VoucherId} className="border rounded-lg p-4">
                    <img
                      src={item.VoucherImage}
                      alt={item.VoucherName}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-bold">{item.VoucherName}</h3>
                    <p className="text-gray-600">Label: {item.Label}</p>
                    <p className="text-gray-600">Price: ${item.Price}</p>
                    <p className="text-gray-600">
                      Expiration Date: {new Date(item.ExpirationDay).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thông báo thành công hoặc lỗi */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Form đăng bài */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">

                <label htmlFor="voucher" className="block text-gray-600 mb-2">
                  Voucher
                </label>
                <select
                  id="voucher"
                  value={selectedVoucherId}
                  onChange={(e) => setSelectedVoucherId(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled>
                    Select a voucher
                  </option>
                  {Array.isArray(voucher) && voucher.length > 0 ? (
                    voucher.map((item) => (
                      <option key={item.VoucherId} value={item.VoucherId}>
                        {item.VoucherName}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading vouchers...</option>
                  )}
                </select>
                <label htmlFor="description" className="block text-gray-600 mb-2">
                  Postname
                </label>
                <input
                  type="text"
                  id="postname"
                  value={postname}
                  onChange={(e) => setPostname(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter post name"
                  required
                />
                <br></br>
                <label htmlFor="description" className="block text-gray-600 mb-2">
                  Content
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter post content"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="image" className="block text-gray-600 mb-2">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border rounded-lg bg-gray-100"
                />
              </div>
              <button
                type="submit"
                className={`w-full p-3 rounded-lg text-white transition duration-300 ${
                  loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Create Post'}
              </button>
            </form>
          </div>

          {/* Danh sách bài đăng */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">List of Posts</h2>
            {posts.length === 0 ? (
              <p className="text-gray-600">No posts available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.PostId} className="border rounded-lg p-4">
                    {post.VoucherImage && (
                      <img
                        src={post.VoucherImage}
                        alt={post.VoucherName}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold">{post.Postname}</h3>
                    <p className="text-gray-600 mb-2">{post.Content}</p>
                    <p className="text-blue-500 font-semibold">{post.Label}</p>
                    <p className={`font-semibold ${post.IsActive ? 'text-green-500' : 'text-red-500'}`}>
                      {post.Status}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Posted on: {new Date(post.Date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default PostManager;