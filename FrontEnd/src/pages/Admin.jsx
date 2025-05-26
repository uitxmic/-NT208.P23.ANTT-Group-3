import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ErrorBoundary from '../components/ErrorBoundary';

const Admin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ transactions: 0, users: 0 });
    const chartRef = React.createRef();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [language, setLanguage] = useState('vi');
    const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 64px)'); // Chiều cao mặc định

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/session', {
                    credentials: 'include', // Use session-based authentication
                });

                if (!response.ok) {
                    alert('Bạn không có quyền truy cập trang này!');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                const userRoleId = data.user.UserRoleId;

                if (!userRoleId || userRoleId !== 1) {
                    alert('Bạn không có quyền truy cập trang này!');
                    navigate('/login');
                } else {
                    setUser(userRoleId);
                    setStats({ transactions: 150, users: 85 }); // Dữ liệu giả lập cho stats
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                navigate('/login');
            }
        };

        fetchSession();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Dữ liệu giả lập cho biểu đồ
    const chartData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
        datasets: [{
            label: 'Số lượng giao dịch',
            data: [120, 150, 130, 180, 200],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    useEffect(() => {
        if (user && chartRef.current && window.Chart) {
            const ctx = chartRef.current.getContext('2d');
            new window.Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100" style ={{ paddingTop: '64px' }}>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center px-4">
                {/* Sidebar Toggle Button */}
                <button
                    className="p-2 bg-white rounded-full shadow-md mr-4"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
            </nav>

            {/* Sidebar */}
            <div
                className={`fixed top-16 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ height: sidebarHeight }}
            >
                <ErrorBoundary>
                    <AdminSidebar language={language} />
                </ErrorBoundary>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Sidebar Toggle Button */}
                <button
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md md:hidden"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Tổng quan Admin</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Số lượng giao dịch</h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.transactions}</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Số lượng người dùng</h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.users}</p>
                        </div>
                    </div>

                    {/* Transaction Chart */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Biểu đồ giao dịch</h2>
                        <div className="relative">
                            <canvas id="transactionChart" className="w-full max-h-96"></canvas>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Đăng xuất
                    </button>
                </main>
            </div>
        </div>
    );
};

export default Admin;