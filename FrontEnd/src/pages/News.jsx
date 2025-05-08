import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy toàn bộ tin tức
    fetch("http://127.0.0.1:3000/news") // Gọi API từ Backend
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        return res.json();
      })
      .then((data) => {
        setNewsList(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Tin tức</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((item) => (
              <Link
                to={`/news/${item.PostId}`}
                key={item.PostId}
                className="block bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition"
              >
                <h3 className="font-semibold text-lg">{item.Postname}</h3>
                <div className="text-gray-500 text-sm mb-2">
                  {item.Date && new Date(item.Date).toLocaleDateString()}
                </div>
                <div className="text-gray-500 text-sm mb-2">
                  Người đăng: {item.Username}
                </div>
                <div className="text-gray-500 text-sm mb-2">
                  Trạng thái: {item.Status}
                </div>
                <div className="line-clamp-2 text-gray-700">{item.Content}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default News;

//tạo tin tức mới (create news)
const CreateNews = async () => {
  const newNews = {
    VoucherId: 1,
    Postname: "Tin tức mới",
    Content: "Nội dung tin tức mới",
  };

  const response = await fetch("http://127.0.0.1:3000/news/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNews),
  });

  if (response.ok) {
    console.log("News created successfully");
  } else {
    console.error("Failed to create news");
  }
};

export { CreateNews };