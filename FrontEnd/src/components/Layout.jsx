import React, { useState, useEffect } from 'react';
import Navbar from './NavigaBar';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer'; // Import Footer
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 64px)'); // Chiều cao mặc định
  const [language, setLanguage] = useState('vi'); // Mặc định là Tiếng Việt
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // Quản lý trạng thái dropdown

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Lấy thông tin người dùng từ localStorage
  const token = localStorage.getItem('access_token');
  const userRoleId = JSON.parse(atob(token.split('.')[1])).userRoleId;
  console.log(userRoleId);

  // Tính chiều cao tối đa của trang cho Sidebar
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
      const navbarHeight = 64; // Chiều cao của Navbar (px)
      const newHeight = `${documentHeight - navbarHeight}px`;
      setSidebarHeight(newHeight);
    };

    updateSidebarHeight();
    window.addEventListener('resize', updateSidebarHeight);
    window.addEventListener('scroll', updateSidebarHeight);

    return () => {
      window.removeEventListener('resize', updateSidebarHeight);
      window.removeEventListener('scroll', updateSidebarHeight);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ height: sidebarHeight }} // Áp dụng chiều cao động
      >
        <ErrorBoundary>
          {userRoleId === 1 ? (
            <AdminSidebar language={language} />
          ) : (
            <Sidebar language={language} />
          )}
        </ErrorBoundary>
      </div>

      {/* Nội dung chính và Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          language={language}
          setLanguage={setLanguage}
          showLanguageDropdown={showLanguageDropdown}
          setShowLanguageDropdown={setShowLanguageDropdown}
        />

        {/* Nội dung chính của trang */}
        <div
          className={`flex-1 transition-all duration-300 bg-gray-100 ${isSidebarOpen ? 'ml-64' : 'ml-0'
            }`}
        >
          <div className="p-6">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};

export default Layout;