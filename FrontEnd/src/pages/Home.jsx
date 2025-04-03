import Navbar from "../components/NavigaBar";


function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">


        {/* Main Section */}
        <main className="flex-1 p-6">

          {/* Welcome Section */}
          <section className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 justify-center text-center">
              Chào mừng đến với VoucherMart
            </h1>
            <p className="text-lg text-gray-600 text-center">
              Nơi tốt nhất để mua và bán các voucher ưu đãi từ hàng ngàn thương hiệu!
            </p>
          </section>

          {/* Featured Vouchers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Voucher nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voucher Card 1 */}
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img
                  src="https://inhoangha.com/uploads/logo-starbucks.jpg"
                  alt="Starbucks Voucher"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Starbucks - 20% Off
                </h3>
                <p className="text-gray-600">Giảm 20% cho mọi đơn hàng</p>
                <p className="text-green-600 font-bold mt-2">50.000 VNĐ</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Mua ngay
                </button>
              </div>

              {/* Voucher Card 2 */}
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img
                  src="https://acb.com.vn/acbwebsite/media/LOGO-shopee.png"
                  alt="Shopee Voucher"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Shopee - 100K Off
                </h3>
                <p className="text-gray-600">Giảm 100K cho đơn từ 500K</p>
                <p className="text-green-600 font-bold mt-2">80.000 VNĐ</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Mua ngay
                </button>
              </div>

              {/* Voucher Card 3 */}
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img
                  src="https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp"
                  alt="CGV Voucher"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  CGV - Vé xem phim
                </h3>
                <p className="text-gray-600">1 vé xem phim 2D bất kỳ</p>
                <p className="text-green-600 font-bold mt-2">60.000 VNĐ</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Mua ngay
                </button>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-blue-500 text-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bạn có voucher để bán?
            </h2>
            <p className="text-lg mb-6">
              Đăng bán ngay hôm nay và kiếm tiền từ những voucher bạn không sử dụng!
            </p>
            <button className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100">
              Bắt đầu bán ngay
            </button>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>&copy; 2025 VoucherMart. All rights reserved.</p>
        <p>Liên hệ: support@vouchermart.com | Hotline: 0123-456-789</p>
      </footer>
    </div>
  );
}

export default Home;