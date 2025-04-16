import BannerCarousel from "../components/BannerCarousel";
import Footer from "../components/Footer";
import Navbar from "../components/NavigaBar";
import PostList from "../components/PostsList";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-100 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1" style={{ marginTop: '4rem' }}>
        {/* Main Section */}
        <main className="flex-1 p-6">
          {/* Hero Section (Inspired by Got It) */}
          <section className="flex flex-col md:flex-row items-center justify-center py-12">
            {/* Left Side: Image of a phone */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://via.placeholder.com/300x600.png?text=Phone+Mockup"
                alt="Phone Mockup"
                className="w-64 md:w-80"
              />
            </div>

            {/* Right Side: Text and Stats */}
            <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                <span className="text-red-500">VOUCHERS.</span>{" "}
                <span className="text-black">DISCOUNTS.</span>{" "}
                <span className="text-red-500">REWARDS.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Nơi tốt nhất để mua và bán các voucher ưu đãi từ hàng ngàn thương hiệu!
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-3xl font-bold text-gray-800">24.000</h3>
                  <p className="text-gray-600">Điểm thanh toán toàn quốc</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-3xl font-bold text-gray-800">1.000.000</h3>
                  <p className="text-gray-600">Thẻ quà tặng hàng tháng</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-3xl font-bold text-gray-800">4.000</h3>
                  <p className="text-gray-600">Công ty đối tác doanh nghiệp</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Vouchers (Retained from your original code) */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Voucher nổi bật
            </h2>
            <div className="relative overflow-hidden">
              <div className="flex animate-slide">
                {/* Voucher Card 1 */}
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://inhoangha.com/uploads/logo-starbucks.jpg"
                      alt="Starbucks Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>

                {/* Voucher Card 2 */}
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://acb.com.vn/acbwebsite/media/LOGO-shopee.png"
                      alt="Shopee Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>

                {/* Voucher Card 3 */}
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp"
                      alt="CGV Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>

                {/* Duplicate cards for seamless looping */}
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://inhoangha.com/uploads/logo-starbucks.jpg"
                      alt="Starbucks Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://acb.com.vn/acbwebsite/media/LOGO-shopee.png"
                      alt="Shopee Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="min-w-[200px] mx-2">
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-32">
                    <img
                      src="https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp"
                      alt="CGV Voucher"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section to display news to user */}

          <BannerCarousel />

          {/* Call to Action*/}
          <section className="bg-red-500 text-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bạn có voucher để bán?
            </h2>
            <p className="text-lg mb-6">
              Đăng bán ngay hôm nay và kiếm tiền từ những voucher bạn không sử dụng!
            </p>
            <button className="bg-white text-red-500 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100">
              Bắt đầu bán ngay
            </button>
          </section>
        </main>
      </div>

      {/* Display 20 Latest Posts */}
      <section className="py-12">
        <PostList />
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;