import React from 'react';
import Slider from 'react-slick'; // Thư viện carousel
import 'slick-carousel/slick/slick.css'; // CSS của slick
import 'slick-carousel/slick/slick-theme.css'; // Theme của slick

const BannerCarousel = () => {
  // Cấu hình cho slider
  const settings = {
    dots: true, // Hiển thị chấm điều hướng
    infinite: true, // Vòng lặp vô hạn
    speed: 500, // Tốc độ chuyển slide
    slidesToShow: 1, // Hiển thị 1 slide mỗi lần
    slidesToScroll: 1, // Chuyển 1 slide mỗi lần
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // Chuyển slide sau 3 giây
    arrows: false, // Ẩn mũi tên điều hướng (chỉ dùng chấm)
    customPaging: (i) => (
      <div className="w-4 h-4 bg-orange-500 rounded-full mx-1 cursor-pointer"></div>
    ), // Tùy chỉnh chấm điều hướng thành màu cam
  };

  // Dữ liệu cho các slide (hình ảnh chính)
  const slides = [
    {
      image: '/path-to-hotpot-image.jpg', // Đường dẫn đến hình ảnh lẩu Thái
      title: 'ĐẠI TIỆC LẨU THÁI',
      subtitle: 'ĐẬM ĐÀ - CHUẨN VỊ',
      logo: '/path-to-mor-fai-logo.png', // Logo Mor-Fai
    },
    // Bạn có thể thêm các slide khác nếu muốn
    {
      image: '/path-to-another-image.jpg',
      title: 'ƯU ĐÃI KHÁC',
      subtitle: 'GIẢM GIÁ LÊN ĐẾN 50%',
      logo: '/path-to-another-logo.png',
    },
  ];

  // Dữ liệu cho các quảng cáo bên phải
  const sideAds = [
    {
      image: 'https://www.giftpop.vn/upload/shBBS/1731756732.jpg',
      title: 'COMBO CHICKEN BURGER SET',
      discount: 'UP TO 40% OFF',
      buttonText: 'ORDER NOW',
      bgColor: 'bg-red-500',
    },
    {
      image: 'https://www.giftpop.vn/upload/shBBS/1708404006.jpg',
      title: 'QUÀ TẶNG NHƯ Ý MUA SET',
      brand: 'PNJ',
      bgColor: 'bg-pink-200',
    },
    {
      image: '/path-to-phuc-long-drink.jpg',
      title: 'THẠNH MÁT ngày hè MUA NGAY',
      brand: 'PHÚC LONG',
      bgColor: 'bg-green-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Phần carousel chính */}
        <div className="md:col-span-3">
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index} className="relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 text-white">
                  <h1 className="text-4xl font-bold">{slide.title}</h1>
                  <p className="text-xl">{slide.subtitle}</p>
                </div>
                <img
                  src={slide.logo}
                  alt="Logo"
                  className="absolute top-4 right-4 h-12"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Phần quảng cáo bên phải */}
        <div className="flex flex-col gap-4">
          {sideAds.map((ad, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${ad.bgColor} text-center relative`}
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-32 object-contain mb-2"
              />
              {ad.brand && (
                <p className="text-sm font-bold text-gray-600">{ad.brand}</p>
              )}
              <p className="text-sm font-semibold">{ad.title}</p>
              {ad.discount && (
                <p className="text-red-600 font-bold">{ad.discount}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;