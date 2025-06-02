import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_BASE_URL}/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Chi tiết tin tức | VoucherHub</title>
        <meta name="description" content="Xem chi tiết tin tức, kinh nghiệm, xu hướng mới về voucher, coupon, mã giảm giá tại VoucherHub." />
        <meta name="keywords" content="chi tiết tin tức, kinh nghiệm ưu đãi, xu hướng voucher, mẹo sử dụng coupon, voucherhub" />
        <meta property="og:title" content="Chi tiết tin tức | VoucherHub" />
        <meta property="og:description" content="Xem chi tiết tin tức, kinh nghiệm, xu hướng mới về voucher, coupon, mã giảm giá tại VoucherHub." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://voucherhub.id.vn/news-detail" />
        <meta property="og:image" content="https://voucherhub.id.vn/og-news-detail.jpg" />
        <link rel="canonical" href="https://voucherhub.id.vn/news-detail" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "name": "Chi tiết tin tức | VoucherHub",
            "description": "Xem chi tiết tin tức, xu hướng, kinh nghiệm mua bán, trao đổi voucher, mã giảm giá, coupon mới nhất tại VoucherHub.",
            "url": "https://voucherhub.id.vn/news-detail"
          }
        `}</script>
      </Helmet>
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <Link to="/news" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Quay lại danh sách</Link>
          {loading ? (
            <div>Đang tải...</div>
          ) : news ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{news.Postname}</h2>
              <div className="text-gray-500 mb-4">{news.Date && new Date(news.Date).toLocaleDateString()}</div>
              <div className="prose" dangerouslySetInnerHTML={{ __html: news.Content }} />
            </>
          ) : (
            <div>Không tìm thấy tin tức.</div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default NewsDetail;