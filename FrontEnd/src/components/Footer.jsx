
import React from 'react';

const Footer = ({ language }) => {
  // Dịch ngôn ngữ
  const getText = () => {
    return language === 'vi'
      ? {
          subscriptionTitle: 'Đừng bỏ lỡ cập nhật và ưu đãi từ VoucherHub!',
          emailPlaceholder: 'Nhập email của bạn',
          recruitmentTitle: 'Tuyển dụng',
          recruitment1: 'Công doanh nghiệp',
          recruitment2: 'Chương trình khách hàng',
          recruitment3: 'Blogs',
          supportTitle: 'Hỗ trợ',
          support1: 'Điều khoản & Chính sách',
          support2: 'Quy chế hoạt động',
          support3: 'Giải quyết tranh chấp',
          companyTitle: 'Công ty cổ phần DAYONE',
          address1: 'Địa chỉ trụ sở: Tòa nhà 9-11 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh, Việt Nam',
          address2: 'Địa chỉ liên hệ: 102 Nguyễn Duy Dương, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh',
          phone: 'Điện thoại: 1900 5586 20',
          email: 'Email: ',
          emailSupport: 'hỗ trợ doanh nghiệp',
          certificate: 'Giấy chứng nhận đăng ký doanh nghiệp số 0313249098 cấp ngày 13/5/2015 tại Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh',
          copyright: 'Bản quyền © WEBSITE VOUCHER .INC TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU',
        }
      : {
          subscriptionTitle: "Don't miss updates and offers from VoucherHub!",
          emailPlaceholder: 'Enter your email',
          recruitmentTitle: 'Recruitment',
          recruitment1: 'Business Company',
          recruitment2: 'Customer Program',
          recruitment3: 'Blogs',
          supportTitle: 'Support',
          support1: 'Terms & Policies',
          support2: 'Operating Regulations',
          support3: 'Dispute Resolution',
          companyTitle: 'DAYONE Joint Stock Company',
          address1: 'Headquarters: 9-11 Nguyen Dinh Chieu Building, Da Kao Ward, District 1, Ho Chi Minh City, Vietnam',
          address2: 'Contact Address: 102 Nguyen Duy Duong, Ward 15, Phu Nhuan District, Ho Chi Minh City',
          phone: 'Phone: 1900 5586 20',
          email: 'Email: ',
          emailSupport: 'business support',
          certificate: 'Business Registration Certificate No. 0313249098 issued on 13/5/2015 by the Department of Planning and Investment of Ho Chi Minh City',
          copyright: 'Copyright © WEBSITE VOUCHER .INC ALL RIGHTS RESERVED',
        };
  };

  const text = getText();

  return (
    <footer className="bg-pink-100 py-8 px-4 text-gray-800 border-t-4 border-blue-500">
      <div className="max-w-7xl mx-auto">
        {/* Phần trên: Subscription, Tuyển dụng, Hỗ trợ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Subscription */}
          <div>
            <h2 className="text-xl font-bold mb-4">{text.subscriptionTitle}</h2>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder={text.emailPlaceholder}
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
              <img
                src="https://static.vecteezy.com/system/resources/previews/018/930/698/non_2x/facebook-logo-facebook-icon-transparent-free-png.png"
                alt="Facebook"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
                alt="Zalo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
                alt="LinkedIn"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png"
                alt="YouTube"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Tuyển dụng */}
          <div>
            <h3 className="font-bold mb-2 text-lg">{text.recruitmentTitle}</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.recruitment1}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.recruitment2}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.recruitment3}
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="font-bold mb-2 text-lg">{text.supportTitle}</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.support1}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.support2}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-red-500 transition">
                  {text.support3}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần dưới: Thông tin công ty */}
        <div className="border-t pt-6">
          <h4 className="font-bold text-lg mb-2">{text.companyTitle}</h4>
          <ul className="text-sm space-y-2">
            <li>{text.address1}</li>
            <li>{text.address2}</li>
            <li>{text.phone}</li>
            <li>
              {text.email}{' '}
              <a href="mailto:hotro@voucherhub.vn" className="text-blue-600 hover:underline">
                hotro@voucherhub.vn
              </a>
              , {text.emailSupport}{' '}
              <a href="mailto:support@voucherhub.vn" className="text-blue-600 hover:underline">
                support@voucherhub.vn
              </a>
            </li>
            <li>{text.certificate}</li>
          </ul>
        </div>

        {/* Copyright và Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm">
          <div className="mb-4 md:mb-0">
            <p className="mb-2">{text.copyright}</p>
            <div className="flex space-x-2 justify-center md:justify-start">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJgM8gqqd2SheNICowBUdQvqvdbOLEucY9lw&s" alt="Visa" className="h-6" />
              <img src="https://logohistory.net/wp-content/uploads/2023/05/Mastercard-Logo-2016.png" alt="MasterCard" className="h-6" />
              <img src="https://icon2.cleanpng.com/20180816/zbz/a237bfa5f0bc15bec6ec41b3115bbab0.webp" alt="JCB" className="h-6" />
            </div>
          </div>
          <div className="flex space-x-4">
            <img
              src="https://cdn.dangkywebsitevoibocongthuong.com/wp-content/uploads/2018/06/logo.png"
              alt="Đã đăng ký"
              className="h-8"
            />
            <img
              src="https://img.gotit.vn/images/website/images/information/iso-logo.png"
              alt="ISO"
              className="h-8"
            />
            <img
              src="https://img.gotit.vn/website/images/icon/pci_dss.png"
              alt="PCI DSS"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;