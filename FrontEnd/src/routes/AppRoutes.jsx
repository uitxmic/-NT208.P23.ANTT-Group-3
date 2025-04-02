import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Log_in from "../pages/Log_in";
import Notification from "../pages/Notification";
import Dashboard from "../components/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;