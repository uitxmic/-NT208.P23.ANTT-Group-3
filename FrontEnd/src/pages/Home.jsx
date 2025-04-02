import Sidebar from "../components/Dashboard";
import Header from "../components/SalesChart";
import Dashboard from "../components/Sidebar";

function Home() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        
      </div>
    </div>
  );
}

export default Home;