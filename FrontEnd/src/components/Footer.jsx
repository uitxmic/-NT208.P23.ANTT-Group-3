import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#FFFFF] py-8 px-4 text-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Phần trên: Subscription, Tuyển dụng, Hỗ trợ, QR Code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Subscription */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Đừng bỏ lỡ cập nhật và ưu đãi từ Got It!
                        </h2>
                        <div className="flex mb-4">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button className="bg-red-500 text-white rounded-r-md px-4 py-2 hover:bg-red-600 transition">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex space-x-4">
                            <img src="https://static.vecteezy.com/system/resources/previews/018/930/698/non_2x/facebook-logo-facebook-icon-transparent-free-png.png" alt="Facebook" className="w-8 h-8 rounded-full object-cover" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png" alt="Zalo" className="w-8 h-8 rounded-full object-cover" />
                            <img src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" className="w-8 h-8 rounded-full object-cover" />
                            <img src="https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png" alt="YouTube" className="w-8 h-8 rounded-full object-cover" />
                        </div>
                    </div>

                    {/* Tuyển dụng */}
                    <div>
                        <h3 className="font-bold mb-2 text-lg">Tuyển dụng</h3>
                        <ul className="text-sm space-y-2">
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Công doanh nghiệp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Chương trình khách hàng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Blogs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hỗ trợ */}
                    <div>
                        <h3 className="font-bold mb-2 text-lg">Hỗ trợ</h3>
                        <ul className="text-sm space-y-2">
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Điều khoản & Chính sách
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Quy chế hoạt động
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline hover:text-red-500 transition">
                                    Giải quyết tranh chấp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Phần dưới: Thông tin công ty */}
                <div className="border-t pt-6">
                    <h4 className="font-bold text-lg mb-2">Công ty cổ phần DAYONE</h4>
                    <ul className="text-sm space-y-2">
                        <li>
                            Địa chỉ trụ sở: Tòa nhà 9-11 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh, Việt Nam
                        </li>
                        <li>
                            Địa chỉ liên hệ: 102 Nguyễn Duy Dương, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh
                        </li>
                        <li>Điện thoại: 1900 5586 20</li>
                        <li>
                            Email:{' '}
                            <a href="mailto:hotro@gotitvn.vn" className="text-blue-600 hover:underline">
                                hotro@voucherhub.vn
                            </a>
                            , hỗ trợ doanh nghiệp{' '}
                            <a href="mailto:support@gotitvn.vn" className="text-blue-600 hover:underline">
                                support@voucherhub.vn
                            </a>
                        </li>
                        <li>
                            Giấy chứng nhận đăng ký doanh nghiệp số 0313249098 cấp ngày 13/5/2015 tại Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh
                        </li>
                    </ul>
                </div>

                {/* Copyright và Logo */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm">
                    <div className="mb-4 md:mb-0">
                        <p className="mb-2">Copyright © WEBSITE VOUCHER .INC ALL RIGHTS RESERVED</p>
                        <div className="flex space-x-2 justify-center md:justify-start">
                            <img src="/path-to-visa-logo.png" alt="Visa" className="h-6" />
                            <img src="/path-to-mastercard-logo.png" alt="MasterCard" className="h-6" />
                            <img src="/path-to-jcb-logo.png" alt="JCB" className="h-6" />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <img src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoCCDV.png" alt="Đã đăng ký" className="h-8" />
                        <img src="https://img.gotit.vn/images/website/images/information/iso-logo.png" alt="ISO" className="h-8" />
                        <img src="https://img.gotit.vn/website/images/icon/pci_dss.png" alt="PCI DSS" className="h-8" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;