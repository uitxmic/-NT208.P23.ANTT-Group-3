import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const AddVoucher = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        VoucherName: '',
        Category: '',
        ExpirationDay: '',
        VoucherCodes: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để tiếp tục.');
                setIsSubmitting(false);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/voucher/addVoucher`, formData, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response.data);

            if (response.data.Id !== null) {
                setSuccess('Thêm voucher thành công!');
                setFormData({
                    VoucherName: '',
                    Category: '',
                    ExpirationDay: '',
                    VoucherCodes: ''
                });
            } else {
                setError(response.data.message || 'Đã xảy ra lỗi khi thêm voucher');
            }
        } catch (err) {
            setError(err.response?.data?.ErrorMessage || 'Đã xảy ra lỗi khi thêm voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Thêm Voucher</h1>
                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="voucherName" className="block text-sm font-medium text-gray-700">
                            Tên Voucher
                        </label>
                        <input
                            type="text"
                            id="VoucherName"
                            name="VoucherName"
                            value={formData.VoucherName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            maxLength={255}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Loại Voucher
                        </label>
                        <select
                            id="Category"
                            name="Category"
                            value={formData.Category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white py-2 px-3"
                            required
                        >
                            <option value="">Chọn loại voucher</option>
                            <optgroup label="Ẩm thực">
                                <option value="Food">Ăn uống</option>
                            </optgroup>
                            <optgroup label="Du lịch & Giải trí">
                                <option value="Travel">Du lịch</option>
                                <option value="Entertainment">Giải trí</option>
                            </optgroup>
                            <optgroup label="Mua sắm">
                                <option value="Fashion">Thời trang</option>
                                <option value="Electronics">Điện tử</option>
                                <option value="Home">Nhà cửa</option>
                                <option value="Luxury">Cao cấp</option>
                                <option value="Garden">Làm vườn</option>
                            </optgroup>
                            <optgroup label="Sức khỏe & Làm đẹp">
                                <option value="Beauty">Sắc đẹp</option>
                                <option value="Fitness">Thể hình</option>
                                <option value="Health">Sức khỏe</option>
                            </optgroup>
                            <optgroup label="Giáo dục & Trẻ em">
                                <option value="Education">Giáo dục</option>
                                <option value="Books">Sách</option>
                                <option value="Kids">Trẻ em</option>
                            </optgroup>
                            <optgroup label="Khác">
                                <option value="Gaming">Trò chơi điện tử</option>
                                <option value="Pets">Thú cưng</option>
                                <option value="Office">Văn phòng</option>
                                <option value="Auto">Ô tô</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="expirationDay" className="block text-sm font-medium text-gray-700">
                            Ngày Hết Hạn
                        </label>
                        <input
                            type="date"
                            id="ExpirationDay"
                            name="ExpirationDay"
                            value={formData.ExpirationDay}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="voucherCodes" className="block text-sm font-medium text-gray-700">
                            Mã Voucher (cách nhau bằng dấu phẩy)
                        </label>
                        <textarea
                            id="VoucherCodes"
                            name="VoucherCodes"
                            value={formData.VoucherCodes}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="VD: CODE1,CODE2,CODE3"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang thêm...' : 'Thêm Voucher'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default AddVoucher;