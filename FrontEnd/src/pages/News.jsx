// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Layout from "../components/Layout";

// const News = () => {
//   const [newsList, setNewsList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://127.0.0.1:3000/news")
//       .then((res) => res.json())
//       .then((data) => {
//         setNewsList(data || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   return (
//     <Layout>
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Tin tức</h2>
//         {loading ? (
//           <div>Đang tải...</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {newsList.map((item) => (
//               <Link
//                 to={`/news/${item.PostId}`}
//                 key={item.PostId}
//                 className="block bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition"
//               >
//                 <h3 className="font-semibold text-lg">{item.Postname}</h3>
//                 <div className="text-gray-500 text-sm mb-2">
//                   {item.Date && new Date(item.Date).toLocaleDateString()}
//                 </div>
//                 <div className="line-clamp-2 text-gray-700">{item.Content}</div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default News;

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem tin tức.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/news/getAllNews', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
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
  );
};

export default News;
