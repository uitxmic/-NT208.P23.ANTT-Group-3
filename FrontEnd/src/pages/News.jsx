import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/news/getAllNews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Không thể tải tin tức');
      }

      const data = await response.json();
      console.log('Fetched news:', data);
      setNewsList(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      setError(err.message || 'Lỗi xảy ra khi tải tin tức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tin tức voucher, mã giảm giá, coupon mới nhất 2025 | VoucherHub</title>
        <meta name="description" content="Cập nhật tin tức, xu hướng, kinh nghiệm mua bán, trao đổi voucher, coupon, mã giảm giá mới nhất. Đọc các mẹo sử dụng ưu đãi hiệu quả tại VoucherHub." />
        <meta name="keywords" content="tin tức voucher, xu hướng ưu đãi, kinh nghiệm mua bán, mẹo sử dụng coupon, deal hot, giá tốt, voucherhub" />
        <meta property="og:title" content="Tin tức voucher, mã giảm giá, coupon mới nhất 2025 | VoucherHub" />
        <meta property="og:description" content="Tin tức, xu hướng, kinh nghiệm mua bán, trao đổi voucher, coupon, mã giảm giá mới nhất. Đọc các mẹo sử dụng ưu đãi hiệu quả tại VoucherHub." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voucherhub.id.vn/news" />
        <meta property="og:image" content="/vouchertop.jpg" />
        <link rel="canonical" href="https://voucherhub.id.vn/news" />
        {/* Schema Blog */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Tin tức voucher, mã giảm giá, coupon mới nhất 2025",
            "description": "Tin tức, xu hướng, kinh nghiệm mua bán, trao đổi voucher, mã giảm giá, coupon mới nhất 2025 tại VoucherHub. Top deal hot, giá tốt mỗi ngày.",
            "url": "https://voucherhub.id.vn/news"
          }
        `}</script>
      </Helmet>
      <Layout>
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Tin Tức</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            {loading ? (
              <p className="text-center text-gray-600">Đang tải tin tức...</p>
            ) : newsList.length > 0 ? (
              <div className="space-y-6">
                {newsList.map((news) => (
                  <div key={news.NewsId} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{news.Title}</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Ngày đăng: {new Date(news.CreatedAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-gray-700">{news.Content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">Không có tin tức nào hiện tại.</p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default News;
