import React, { useEffect, useState } from "react";
import Layout from "../components/Layout"; // Import Layout
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary
import { useNavigate } from "react-router-dom"; // Đã có ở đầu file

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set()); // State cho các mục được chọn
  const navigate = useNavigate(); // Thêm dòng này vào đầu function CartPage

  // Lấy token từ localStorage
  const token = localStorage.getItem("access_token");

  // Lấy giỏ hàng khi load trang
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/cart/getCart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Không thể lấy dữ liệu giỏ hàng");
      const data = await response.json();
      console.log("Giỏ hàng:", data);
      setCartItems(data);
    } catch (err) {
      setError(err.message || "Lỗi khi lấy giỏ hàng!");
    }
    setLoading(false);
  };

  // Cập nhật số lượng hoặc xóa sản phẩm
  const handleUpdate = async (itemId, quantity) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/cart/updateCart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: itemId,
          Quantity: quantity,
        }),
      });
      if (!response.ok) throw new Error("Cập nhật giỏ hàng thất bại!");
      fetchCart(); // Tải lại giỏ hàng sau khi cập nhật
      // Nếu xóa sản phẩm, cũng xóa khỏi danh sách selectedItems
      if (quantity === 0) {
        setSelectedItems(prevSelected => {
          const newSelected = new Set(prevSelected);
          newSelected.delete(itemId);
          return newSelected;
        });
      }
    } catch (err) {
      alert(err.message || "Cập nhật giỏ hàng thất bại!");
    }
  };

  // Xử lý thay đổi checkbox
  const handleSelectItem = (itemId) => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  // Tính tổng tiền các mục đã chọn
  const calculateTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems.has(item.ItemId))
      .reduce((total, item) => total + (item.Price * 1000 * item.Quantity), 0);
  };

  const itemsToPurchase = cartItems.filter(item => selectedItems.has(item.ItemId));

  const handleBuyNow = () => {
    const items = itemsToPurchase.map(item => ({
      voucherId: item.VoucherId,
      postId: item.PostId,
      amount: item.Price * 1000,
      quantity: item.Quantity,
      userIdSeller: item.UserId,
      postName: item.PostName,
      vouImg: item.VouImg
    }));
    console.log("Items to purchase:", items);

    navigate('/payment', { state: { items } });
  };


  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col min-h-screen bg-pink-50">
          <div className="flex flex-1" style={{ marginTop: '4rem', paddingBottom: itemsToPurchase.length > 0 ? '8rem' : '0' }}>
            <main className="flex-1 p-6">
              <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>
              {loading ? (
                <div>Đang tải...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-500">Giỏ hàng trống.</p>
                  {/* Bạn có thể thêm nút để điều hướng người dùng đến trang sản phẩm */}
                </div>
              ) : (
                // Bảng giỏ hàng không còn nằm trong grid nữa
                <div className="md:col-span-2">
                  <table className="min-w-full bg-white rounded shadow">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b w-12">Chọn</th>
                        <th className="py-2 px-4 border-b">STT</th>
                        <th className="py-2 px-4 border-b">Sản phẩm</th>
                        <th className="py-2 px-4 border-b">Số lượng</th>
                        <th className="py-2 px-4 border-b">Cập nhật</th>
                        <th className="py-2 px-4 border-b">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, idx) => (
                        <tr key={item.ItemId + '-' + idx}>
                          <td className="py-2 px-4 border-b text-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={selectedItems.has(item.ItemId)}
                              onChange={() => handleSelectItem(item.ItemId)}
                            />
                          </td>
                          <td className="py-2 px-4 border-b text-center">{idx + 1}</td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.VouImg || "https://via.placeholder.com/48"}
                                alt={item.PostName}
                                className="w-16 h-16 object-cover rounded border"
                              />
                              <div>
                                <div className="font-semibold">{item.PostName}</div>
                                <div className="text-sm text-gray-500">
                                  {(item.Price * 1000)?.toLocaleString()} ₫
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-4 border-b text-center">{item.Quantity}</td>
                          <td className="py-2 px-4 border-b text-center">
                            <button
                              className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                              onClick={() => handleUpdate(item.ItemId, 1)}
                            >
                              +
                            </button>
                            <button
                              className="px-2 py-1 bg-blue-500 text-white rounded"
                              onClick={() => handleUpdate(item.ItemId, -1)}
                            >
                              -
                            </button>
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            <button
                              className="px-4 py-1 bg-red-500 text-white rounded"
                              onClick={() => handleUpdate(item.ItemId, 0)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </main>
          </div>

          {/* Khung hiển thị các mục đã chọn - CỐ ĐỊNH Ở CUỐI TRANG */}
          {itemsToPurchase.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-50">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    Đã chọn: {itemsToPurchase.length} sản phẩm
                  </h3>
                  {/* Optional: Hiển thị danh sách sản phẩm đã chọn nếu muốn, nhưng có thể làm thanh cố định quá lớn */}
                  {/* <ul className="text-sm">
                    {itemsToPurchase.slice(0, 2).map(item => ( // Hiển thị 2 sản phẩm đầu tiên ví dụ
                      <li key={item.ItemId} className="truncate">
                        {item.PostName} (SL: {item.Quantity})
                      </li>
                    ))}
                    {itemsToPurchase.length > 2 && <li>... và {itemsToPurchase.length - 2} sản phẩm khác</li>}
                  </ul> */}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="text-right">
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="text-xl font-bold text-orange-600">
                      {calculateTotalPrice().toLocaleString()} ₫
                    </span>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors text-lg font-semibold"
                  >
                    Mua ngay ({itemsToPurchase.length})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default CartPage;