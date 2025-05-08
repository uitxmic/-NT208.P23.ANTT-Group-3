import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/news/${id}`) // Gọi API lấy chi tiết tin tức
      .then((res) => res.json())
      .then((data) => {
        setNews(data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 pt-20">
        <div className="mb-4 flex justify-start"> {/* Đưa liên kết về bên trái */}
          <Link
            to="/news"
            className="inline-block text-blue-500 hover:underline bg-white rounded shadow px-4 py-2"
          >
            &larr; Quay lại danh sách
          </Link>
        </div>
        <div>
          {loading ? (
            <div>Đang tải...</div>
          ) : news ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{news.Postname}</h2>
              <div className="text-gray-500 mb-4">
                {news.Date && new Date(news.Date).toLocaleDateString()}
              </div>
              <div className="prose" dangerouslySetInnerHTML={{ __html: news.Content }} />
            </>
          ) : (
            <div>Không tìm thấy tin tức.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;