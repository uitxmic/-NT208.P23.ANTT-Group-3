import React, { useState, useEffect } from 'react';
import Navbar from './NavigaBar';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 64px)'); // Chiều cao mặc định

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Tính chiều cao tối đa của trang
  useEffect(() => {
    const updateSidebarHeight = () => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      // Chiều cao của Sidebar = chiều cao trang - chiều cao Navbar
      const navbarHeight = 64; // Chiều cao của Navbar (px)
      const newHeight = `${documentHeight - navbarHeight}px`;
      setSidebarHeight(newHeight);
    };

    // Cập nhật chiều cao khi tải trang và khi thay đổi kích thước
    updateSidebarHeight();
    window.addEventListener('resize', updateSidebarHeight);
    window.addEventListener('scroll', updateSidebarHeight);

    return () => {
      window.removeEventListener('resize', updateSidebarHeight);
      window.removeEventListener('scroll', updateSidebarHeight);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: sidebarHeight }} // Áp dụng chiều cao động
      >
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Nội dung chính của trang */}
        <div
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;