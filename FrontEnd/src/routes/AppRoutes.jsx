import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import PostManager from "../pages/PostingManager";
import Sidebar from "../components/Sidebar";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Log_in />} />
      <Route path="/posting-manager" element={<PostManager />} />
      <Route path="/sidebar" element={<Sidebar />} />
    </Routes>
  );
}

export default AppRoutes;