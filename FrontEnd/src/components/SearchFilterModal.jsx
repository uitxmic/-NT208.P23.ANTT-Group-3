import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const postSortOptions = [
  { value: "date_desc", label: "Mới nhất" },
  { value: "date_asc", label: "Cũ nhất" },
];
const userSortOptions = [
  { value: "feedback_asc", label: "Điểm đánh giá tăng dần" },
  { value: "feedback_desc", label: "Điểm đánh giá giảm dần" },
];


const SearchFilterModal = ({ onClose, searchTerm }) => {
  const [type, setType] = useState("posts");
  const [fields, setFields] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setFields({});
  };

  const handleSearch = () => {
    const allFields = searchTerm ? { ...fields, searchTerm } : { ...fields };
    const filteredFields = Object.fromEntries(
      Object.entries(allFields).filter(([k, v]) => v !== "" && v !== undefined)
    );
    const query = Object.entries(filteredFields)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    navigate(`/search/${type}?${query}`);
    onClose();
  };

  return (
    <div className="absolute z-50 w-full max-w-md mx-auto top-12 bg-white shadow-lg rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-sm">Tìm kiếm theo:</label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="posts">Bài đăng</option>
            <option value="users">Người dùng</option>
          </select>
        </div>

        {type === "posts" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Lọc bài đăng</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Danh mục:</label>
                <select
                  name="category"
                  placeholder="Danh mục"
                  value={fields.category || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Electronics">Điện tử</option>
                  <option value="Fashion">Thời trang</option>
                  <option value="Home">Nhà cửa</option>
                  <option value="Books">Sách</option>                  
                  <option value="Fitness">Thể thao</option>
                  <option value="Food">Thực phẩm</option>
                  <option value="Travel">Du lịch</option>
                  <option value="Beauty">Làm đẹp</option>
                  <option value="Gaming">Game</option>
                  <option value="Office">Văn phòng</option>
                  <option value="Entertainment">Giải trí</option>
                  <option value="Education">Giáo dục</option>
                  <option value="Pets">Thú cưng</option>
                  <option value="Kids">Trẻ em</option>
                  <option value="Health">Sức khỏe</option>
                  <option value="Luxury">Hàng hiệu</option>
                  <option value="Garden">Vườn</option>
                  <option value="Ẩm thực">Ẩm thực</option>
                </select>
              </div>
              {/* <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Giá tối thiểu:</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Giá tối thiểu"
                  value={fields.minPrice || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Giá tối đa:</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Giá tối đa"
                  value={fields.maxPrice || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Ngày đăng:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="start_day"
                    value={fields.start_day || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    name="end_day"
                    value={fields.end_day || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Sắp xếp theo:</label>
                <select
                  name="sortBy"
                  value={fields.sortBy || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn cách sắp xếp</option>
                  {postSortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {type === "users" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Lọc người dùng</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Feedback tối thiểu:</label>
                <input
                  type="number"
                  name="minFeedback"
                  placeholder="Feedback tối thiểu"
                  value={fields.minFeedback || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Sắp xếp theo:</label>
                <select
                  name="sortBy"
                  value={fields.sortBy || ""}
                  onChange={handleChange}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn cách sắp xếp</option>
                  {userSortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Đóng
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export const SearchAPI = {
  searchPosts: async (params) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/search/posts?${queryParams}`);
    if (!response.ok) throw new Error("Error searching posts");
    return await response.json();
  },
  searchUsers: async (params) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/search/users?${queryParams}`);
    if (!response.ok) throw new Error("Error searching users");
    return await response.json();
  },
};

export default SearchFilterModal;