import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import PostManager from "../pages/PostingManager";
import PostingPage from "../pages/PostingPage";
import UserVoucherList from "../pages/Valid_user's_voucher";
import Payment from "../pages/Payment";
import UserProfile from "../pages/UserProfile";
import Deposit from "../components/Deposit";
import Layout from "../components/Layout"; // Import Layout
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary
import News from "../pages/News";
import NewsDetail from "../pages/NewsDetail";

function AppRoutes() {
  return (
    <Routes>
      {/* Các route không cần Layout */}
      <Route path="/login" element={<Log_in />} />

      {/* Các route sử dụng Layout */}
      <Route
        path="/*"
        element={
          <ErrorBoundary>
            <Layout>
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
              </Routes>
            </Layout>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}

export default AppRoutes;