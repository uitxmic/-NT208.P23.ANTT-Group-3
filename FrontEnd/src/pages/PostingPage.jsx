import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PostingPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch vouchers from API
  const fetchVouchers = async (page, limitValue) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/posting/getAllPostings?page=${page}&limit=${limitValue}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }

      const data = await response.json();
      let fetchedVouchers = [];
      if (data && Array.isArray(data.result)) {
        fetchedVouchers = data.result;
      } else if (Array.isArray(data)) { // Fallback for the older structure if needed
        fetchedVouchers = data
          .filter(item => item.result && Array.isArray(item.result))
          .flatMap(item => item.result);
      }
      if (fetchedVouchers.length > 0) {
        setVouchers(fetchedVouchers);
        // Extract unique categories
        const uniqueCategories = [...new Set(fetchedVouchers.map(voucher => voucher.Category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setVouchers([]);
        // setError('Không có voucher nào khả dụng'); // Keep existing error or adjust
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching vouchers');
      setVouchers([]); // Clear vouchers on error
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    // We don't know totalPages, so we allow to go next.
    // If the next page is empty, fetchVouchers will handle it.
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    // Optionally, you could re-fetch if categories imply different API calls
    // For now, we'll filter client-side
  };

  useEffect(() => {
    fetchVouchers(currentPage, limit);
  }, [currentPage, limit]);

  const filteredVouchers = selectedCategory && selectedCategory !== 'All'
    ? vouchers.filter(voucher => voucher.Category === selectedCategory)
    : vouchers;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10" style={{ paddingTop: '100px' }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
            CÁC VOUCHER HIỆN TẠI TRÊN HỆ THỐNG
          </h1>

          {/* Category Filter Bar */}
          {!loading && categories.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out
                  ${(selectedCategory === 'All' || !selectedCategory) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Tất cả
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out
                    ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

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
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((voucher) => (
                  <div
                    key={voucher.PostId}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/postdetail/${voucher.PostId}`)}
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
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600 text-lg">
                  {selectedCategory && selectedCategory !== 'All'
                    ? `Không có voucher nào trong danh mục "${selectedCategory}".`
                    : 'Không có voucher nào hiện tại.'}
                </p>
              )}
            </div>
          )}
          {/* Pagination Controls */}
          {/* Show pagination if not loading AND ( (vouchers exist) OR (we are on page > 1, so "Prev" should be available) ) */}
          {/* And hide if there's an auth error */}
          {!loading && (vouchers.length > 0 || currentPage > 1) && !error.includes('Vui lòng đăng nhập') && (
            <div className="mt-10 flex justify-center items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Trang Trước
              </button>
              <span className="text-gray-700 font-medium px-3 py-2 bg-gray-100 rounded-md">
                Trang {currentPage}
              </span>
              <button
                onClick={handleNextPage}
                // Disable "Next" if loading, or if the current page has 0 vouchers (and it's not the first page loading attempt)
                // This implies if an empty page is loaded (not page 1), we can't go further.
                disabled={loading || (vouchers.length === 0 && currentPage > 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Trang Kế
              </button>
            </div>

          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostingPage;