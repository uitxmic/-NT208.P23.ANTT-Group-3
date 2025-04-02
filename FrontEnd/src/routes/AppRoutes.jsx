import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import PostManager from "../pages/PostingManager";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Log_in />} />
      <Route path="/posting-manager" element={<PostManager />} />
    </Routes>
  );
}

export default AppRoutes;