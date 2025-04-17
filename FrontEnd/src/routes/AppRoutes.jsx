import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import PostManager from "../pages/PostingManager";
import VoucherList from "../pages/Valid_vouchers";
import UserVoucherList from "../pages/Valid_user's_voucher";
import Payment from "../pages/Payment";
import UserProfile from "../pages/UserProfile";
import Layout from "../components/Layout"; // Import Layout

function AppRoutes() {
  return (
    <Routes>
      {/* Các route không cần Layout */}
      <Route path="/login" element={<Log_in />} />

      {/* Các route sử dụng Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posting-manager" element={<PostManager />} />
              <Route path="/shop-vouchers" element={<VoucherList />} />
              <Route path="/user-vouchers" element={<UserVoucherList />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;