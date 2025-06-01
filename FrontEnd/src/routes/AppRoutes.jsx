import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import Sign_up from "../pages/Sign_up";
import PostManager from "../pages/PostingManager";
import PostingPage from "../pages/PostingPage";
import PostDetail from "../pages/PostDetail";
import SellerPost from "../pages/SellerPost";
import UserVoucherList from "../pages/Valid_user's_voucher";
import VoucherDetail from "../pages/VoucherDetail";
import Payment from "../pages/Payment";
import UserProfile from "../pages/UserProfile";
import Deposit from "../components/Deposit";
import ErrorBoundary from "../components/ErrorBoundary";
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
import AddVoucher from "../pages/AddVoucher";
import UpdateProfile from "../pages/UpdateProfile";
import ChangePassword from "../pages/ChangePassword";
import PurchaseHistory from "../pages/PurchaseHistory";
import UserDetail from "../pages/UserDetail";
import ForgotPassword from "../pages/ForgetPassword";

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure login and signup routes are accessible without session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const currentPath = location.pathname;

        // Exclude login and signup routes from session validation
        if (["/login", "/signup"].includes(currentPath)) {
          return;
        }

        const response = await fetch(`${API_BASE_URL}/session/userId`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            if (!["/login", "/signup", "/"].includes(currentPath)) {
              navigate('/');
            }
          } else {
            console.error('Error checking session:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      {/* Allow login and signup routes without session */}
      <Route path="/login" element={<Log_in />} />
      <Route path="/signup" element={<Sign_up />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Các route sử dụng Layout */}
      <Route
        path="/*"
        element={
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posting-manager" element={<PostManager />} />
              <Route path="/shop-vouchers" element={<PostingPage />} />
              <Route path="/seller-post/:UserId" element={<SellerPost />} />
              <Route path="/user-vouchers" element={<UserVoucherList />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/:id" element={<UserDetail />} />
              {/* <Route path="/deposit" element={<Deposit />} /> */}
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/search/:type" element={<SearchResult />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/notification/:notifId" element={<NotifDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/posting-manager" element={<AdminPostingManager />} />
              <Route path="/admin/transaction-manager" element={<TransactionManagerAdmin />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/postdetail/:postId" element={<PostDetail />} />
              <Route path="/voucher-detail/:voucherId" element={<VoucherDetail />} />
              <Route path="/deposit" element={<Deposit />} />
              {/* <Route path="/cart" element={<CartPage />} /> */}
              <Route path="/admin/user-manager" element={<UserManager />} />
              <Route path="/add-voucher" element={<AddVoucher />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              {/* Thêm các route khác ở đây */}
            </Routes>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}

export default AppRoutes;