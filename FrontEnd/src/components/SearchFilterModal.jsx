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
  { value: "feedback_asc", label: "tăng dần" },
  { value: "feedback_desc", label: "giảm dần" },
  { value: "sold_asc", label: "Số lượng bán tăng dần" },
  { value: "sold_desc", label: "Số lượng bán giảm dần" },
];

const SearchFilterModal = ({ onClose, searchTerm }) => {
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
    // Chỉ thêm searchTerm vào query nếu có giá trị
    const allFields = searchTerm ? { ...fields, searchTerm } : { ...fields };
    let query = Object.entries(allFields)
      .filter(([k, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    navigate(`/search?type=${type}&${query}`);
    onClose();
  };

  return (
    <div className="absolute z-50 left-0 right-0 top-12 bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-3">
          <label className="font-semibold">Tìm kiếm theo:</label>
          <select value={type} onChange={handleTypeChange} className="border p-2 rounded">
            <option value="vouchers">Voucher</option>
            <option value="posts">Bài đăng</option>
            <option value="users">Người dùng</option>
          </select>
        </div>
        {/* Không có trường nhập từ khóa ở đây */}
        {type === "vouchers" && (
          <>
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
            <label className="font-semibold mr-2">Sắp xếp theo:</label>
            <select
              name="sortBy"
              value={fields.sortBy || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              {voucherSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label className="font-semibold mr-2">Trạng thái:</label>
            <select
              name="isVerified"
              value={fields.isVerified || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
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
            <label className="font-semibold mr-2">Số lượt tương tác:</label>
            <input
              type="number"
              name="minInteractions"
              placeholder="Tương tác tối thiểu"
              value={fields.minInteractions || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <div className="flex gap-2">
              <label className="font-semibold mr-2">Đăng trong vòng (số ngày kể từ hiện tại):</label>
              <input
                type="number"
                name="minDaysPosted"
                placeholder="Từ"
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
            <div className="flex gap-2">
              <label className="font-semibold mr-2">Sắp xếp theo:</label>
              <select
                name="sortBy"
                value={fields.sortBy || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                {postSortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>      
            <div className="flex gap-2">
            <label className="font-semibold mr-2">Ngày đăng:</label>
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