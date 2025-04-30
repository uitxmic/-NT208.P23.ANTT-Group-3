import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const voucherSortOptions = [
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];
const postSortOptions = [
  { value: "interactions_desc", label: "Tương tác nhiều nhất" },
  { value: "date_desc", label: "Mới nhất" },
  { value: "date_asc", label: "Cũ nhất" },
];
const userSortOptions = [
  { value: "feedback_asc", label: "Feedback tăng dần" },
  { value: "feedback_desc", label: "Feedback giảm dần" },
  { value: "sold_asc", label: "Đã bán tăng dần" },
  { value: "sold_desc", label: "Đã bán giảm dần" },
];

const SearchFilterModal = ({ onClose }) => {
  const [type, setType] = useState("vouchers"); // vouchers | posts | users
  const [fields, setFields] = useState({});
  const navigate = useNavigate();

  // Xử lý thay đổi trường lọc
  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // Reset fields khi đổi loại tìm kiếm
  const handleTypeChange = (e) => {
    setType(e.target.value);
    setFields({});
  };

  // Điều hướng đến trang kết quả với query phù hợp
  const handleSearch = () => {
    let query = Object.entries(fields)
      .filter(([k, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    navigate(`/search?type=${type}&${query}`);
    onClose();
  };

  return (
    <div className="absolute z-50 left-0 right-0 top-12 bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col gap-3">
        <div>
          <label className="font-semibold mr-2">Tìm kiếm:</label>
          <select value={type} onChange={handleTypeChange} className="border p-2 rounded">
            <option value="vouchers">Voucher</option>
            <option value="posts">Bài đăng</option>
            <option value="users">Người dùng</option>
          </select>
        </div>
        {/* Các trường lọc động */}
        <input
          type="text"
          name="searchTerm"
          placeholder="Từ khóa"
          value={fields.searchTerm || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {type === "vouchers" && (
          <>
            <input
              type="text"
              name="category"
              placeholder="Danh mục"
              value={fields.category || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Giá từ"
                value={fields.minPrice || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Đến"
                value={fields.maxPrice || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
            </div>
            <select
              name="sortBy"
              value={fields.sortBy || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Sắp xếp</option>
              {voucherSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              name="isVerified"
              value={fields.isVerified || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Xác thực</option>
              <option value="1">Đã xác thực</option>
              <option value="0">Chưa xác thực</option>
            </select>
            <input
              type="number"
              name="minFeedback"
              placeholder="Feedback tối thiểu"
              value={fields.minFeedback || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="minSold"
              placeholder="Đã bán tối thiểu"
              value={fields.minSold || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="expireInDays"
              placeholder="Còn hạn (ngày)"
              value={fields.expireInDays || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </>
        )}
        {type === "posts" && (
          <>
            <input
              type="number"
              name="minInteractions"
              placeholder="Tương tác tối thiểu"
              value={fields.minInteractions || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="number"
                name="minDaysPosted"
                placeholder="Ngày đăng từ"
                value={fields.minDaysPosted || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="number"
                name="maxDaysPosted"
                placeholder="Đến"
                value={fields.maxDaysPosted || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
            </div>
            <select
              name="sortBy"
              value={fields.sortBy || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Sắp xếp</option>
              {postSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                placeholder="Từ ngày"
                value={fields.startDate || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="date"
                name="endDate"
                placeholder="Đến ngày"
                value={fields.endDate || ""}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
            </div>
          </>
        )}
        {type === "users" && (
          <>
            <input
              type="number"
              name="minFeedback"
              placeholder="Feedback tối thiểu"
              value={fields.minFeedback || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="minSold"
              placeholder="Đã bán tối thiểu"
              value={fields.minSold || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="sortBy"
              value={fields.sortBy || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Sắp xếp</option>
              {userSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Đóng</button>
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">Tìm kiếm</button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterModal;