import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import Notification from "../pages/Notification";

function AppRoutes() {
  return (
    <Routes>
        <Route path="/notification" element={<Notification />} />
        <Route path="/login" element={<Log_in />} />
        <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
