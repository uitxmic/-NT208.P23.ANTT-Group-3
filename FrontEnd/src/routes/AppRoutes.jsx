import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import Sign_up from "../pages/Sign_up";
import PostManager from "../pages/PostingManager";
import PostingPage from "../pages/PostingPage";
import PostDetail from "../pages/PostDetail";
import UserVoucherList from "../pages/Valid_user's_voucher";
import VoucherDetail from "../pages/VoucherDetail";
import Payment from "../pages/Payment";
import UserProfile from "../pages/UserProfile";
import Deposit from "../components/Deposit";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary
import News from "../pages/News";
import NewsDetail from "../pages/NewsDetail";
import SearchResult from "../pages/SearchResult";
import UserManager from "../pages/UserManager";

import Notification from "../pages/Notification";
import NotifDetail from "../pages/NotifDetail";
import Admin from "../pages/Admin";
import AdminPostingManager from "../pages/PostingAdminManager";
import TransactionManagerAdmin from "../pages/TransactionManagerAdmin";
import CartPage from "../pages/cart";

function AppRoutes() {
  return (
    <Routes>
      {/* Các route không cần Layout */}
      <Route path="/login" element={<Log_in />} />
      <Route path="/signup" element={<Sign_up />} />
      {/* Các route sử dụng Layout */}
      <Route
        path="/*"
        element={
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posting-manager" element={<PostManager />} />
              <Route path="/shop-vouchers" element={<PostingPage />} />
              <Route path="/user-vouchers" element={<UserVoucherList />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/notification/:id" element={<NotifDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/posting-manager" element={<AdminPostingManager />} />
              <Route path="/admin/transaction-manager" element={<TransactionManagerAdmin />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/postdetail/:postId" element={<PostDetail />} />
              <Route path="/voucher-detail/:id" element={<VoucherDetail />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin/user-manager" element={<UserManager />} />

              {/* Thêm các route khác ở đây */}
            </Routes>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}

export default AppRoutes;