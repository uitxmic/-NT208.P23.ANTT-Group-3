import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  );
};

export default NewsDetail;