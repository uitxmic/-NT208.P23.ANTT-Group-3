import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ErrorBoundary from '../components/ErrorBoundary';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Admin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ transactions: 0, users: 0 });
    const chartRef = useRef(null); // Sử dụng useRef cho canvas
    const chartInstanceRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [language, setLanguage] = useState('vi');
    const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 64px)'); // Chiều cao mặc định

    const [chartTimeScale, setChartTimeScale] = useState('day'); // Thay đổi theo nhu cầu (day, week, month)
    const [chartDisplayType, setChartDisplayType] = useState('bar'); // Thay đổi theo nhu cầu (line, bar)

    const [dynamicChartData, setDynamicChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Số lượng giao dịch',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    });

    useEffect(() => {
        const fetchUserRoleAndData = async () => {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            // Check session and role
            const roleResponse = await fetch(`${API_BASE_URL}/session/userRoleId`, {
                method: 'GET',
                credentials: 'include',
            });

            let userRoleId = null;
            if (roleResponse.ok) {
                const data = await roleResponse.json();
                userRoleId = Number(data.UserRoleId);
            } else {
                console.error('Failed to fetch user role');
            }
            if (!userRoleId || userRoleId !== 1) {
                alert('Bạn không có quyền truy cập trang này!');
                navigate('/login');
            } else {
                setUser(userRoleId);
                // Fetch admin stats and chart data
                try {
                    const response = await fetch(`${API_BASE_URL}/trade/getTransactionForAdmin`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Không thể lấy danh sách giao dịch.');
                    }

                    const data = await response.json();

                    if (Array.isArray(data) && data.length > 0) {
                        const transactionsByTime = data.reduce((acc, transaction) => {
                            const dateObj = new Date(transaction.CreateAt);
                            let key;
                            if (chartTimeScale === 'day') {
                                key = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            } else if (chartTimeScale === 'month') {
                                key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                            } else if (chartTimeScale === 'year') {
                                key = dateObj.getFullYear().toString();
                            }
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                        }, {});

                        const sortedKeys = Object.keys(transactionsByTime).sort((a, b) => {
                            if (chartTimeScale === 'day') {
                                const partsA = a.split('/');
                                const dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
                                const partsB = b.split('/');
                                const dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
                                return dateA - dateB;
                            } else if (chartTimeScale === 'month') {
                                return new Date(a + '-01') - new Date(b + '-01');
                            } else if (chartTimeScale === 'year') {
                                return parseInt(a) - parseInt(b);
                            }
                            return 0;
                        });

                        const chartLabels = sortedKeys;
                        const chartDataCounts = sortedKeys.map(date => transactionsByTime[date]);

                        setDynamicChartData({
                            labels: chartLabels,
                            datasets: [{
                                label: 'Số lượng giao dịch',
                                data: chartDataCounts,
                                backgroundColor: chartDisplayType === 'bar' ? 'rgba(54, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.2)',
                                borderColor: chartDisplayType === 'bar' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                fill: chartDisplayType === 'line',
                            }]
                        });

                        setStats({ transactions: data.length, users: data[0].TotalUser });
                    }
                } catch (error) {
                    console.error('Error fetching transaction data:', error);
                    setDynamicChartData({
                        labels: [],
                        datasets: [{
                            label: 'Số lượng giao dịch',
                            data: [],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    });
                }
            }
        };
        fetchUserRoleAndData();
    }, [navigate, chartTimeScale, chartDisplayType]);

    const handleLogout = () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/session`, {
        method: 'DELETE',
        credentials: 'include',
        }).then(() => {
        navigate('/login');
        });
    };

    // useEffect này dùng để khởi tạo và cập nhật biểu đồ
    useEffect(() => {


        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }

        if (user && chartRef.current && ChartJS && dynamicChartData.labels && dynamicChartData.labels.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                try {
                    chartInstanceRef.current = new ChartJS(ctx, {
                        type: chartDisplayType,
                        data: dynamicChartData,
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1 // Ensure y-axis shows whole numbers if data is counts
                                    }
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                } catch (error) {
                    console.error('Error creating chart:', error);
                }
            } else {
                console.error('Failed to get 2D context from canvas.');
            }
        } else {
            let reason = 'Cannot create chart because:';
            if (!user) reason += ' user is not available;';
            if (!chartRef.current) reason += ' chartRef.current is null;';
            if (!ChartJS) reason += ' ChartJS is not available;';
            if (!dynamicChartData.labels || dynamicChartData.labels.length === 0) reason += ' dynamicChartData.labels is empty or data not ready;';
            // Optionally, clear the canvas if no chart is to be drawn
            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
                }
            }
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [user, dynamicChartData]);

    if (!user) return null;

    const handleTimeScaleChange = (scale) => {
        setChartTimeScale(scale);
    };

    const handleDisplayTypeChange = (type) => {
        setChartDisplayType(type);
    };

    return (
        <div className="flex min-h-screen bg-gray-100" style={{ paddingTop: '64px' }}>
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Biểu đồ giao dịch</h2>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">Thời gian:</span>
                                    <button onClick={() => handleTimeScaleChange('day')} className={`px-3 py-1 text-sm rounded ${chartTimeScale === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Ngày</button>
                                    <button onClick={() => handleTimeScaleChange('month')} className={`px-3 py-1 text-sm rounded ${chartTimeScale === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Tháng</button>
                                    <button onClick={() => handleTimeScaleChange('year')} className={`px-3 py-1 text-sm rounded ${chartTimeScale === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Năm</button>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">Kiểu:</span>
                                    <button onClick={() => handleDisplayTypeChange('line')} className={`px-3 py-1 text-sm rounded ${chartDisplayType === 'line' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Line</button>
                                    <button onClick={() => handleDisplayTypeChange('bar')} className={`px-3 py-1 text-sm rounded ${chartDisplayType === 'bar' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Bar</button>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-72 md:h-96"> {/* Ensure container has height */}
                            <canvas id="transactionChart" ref={chartRef} className="w-full h-full"></canvas>
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