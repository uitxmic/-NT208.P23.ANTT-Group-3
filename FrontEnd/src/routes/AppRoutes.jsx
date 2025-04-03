import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import PostManager from "../pages/PostingManager";
import VoucherList from "../pages/Valid_vouchers";
import UserVoucherList from "../pages/Valid_user's_voucher";
import Payment from "../pages/Payment";
import Sidebar from "../components/Sidebar";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Log_in />} />
      <Route path="/posting-manager" element={<PostManager />} />
      <Route path="/shop-vouchers" element={<VoucherList />} />
      <Route path="/user-vouchers" element={<UserVoucherList />} />
      {<Route path="/payment" element={<Payment />} /> }
      <Route path="/sidebar" element={<Sidebar />} />
    </Routes>
  );
}

export default AppRoutes;