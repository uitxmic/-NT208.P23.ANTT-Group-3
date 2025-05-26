import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
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
    const [fileName, setFileName] = useState('');
    const [useFileUpload, setUseFileUpload] = useState(false);
    const [vouchersFromFile, setVouchersFromFile] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

// ...existing code...
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    const parsedVouchers = jsonData.slice(1).map(row => {
                        let expirationDayValue = row[2] || '';
                        // Kiểm tra nếu giá trị là một số (Excel serial date)
                        if (typeof row[2] === 'number') {
                            const dateObj = XLSX.SSF.parse_date_code(row[2]);
                            if (dateObj) {
                                const year = dateObj.y;
                                const month = String(dateObj.m).padStart(2, '0');
                                const day = String(dateObj.d).padStart(2, '0');
                                expirationDayValue = `${year}-${month}-${day}`;
                            } else {
                                expirationDayValue = row[2].toString();
                            }
                        } else if (row[2] instanceof Date) {
                            const year = row[2].getFullYear();
                            const month = String(row[2].getMonth() + 1).padStart(2, '0');
                            const day = String(row[2].getDate()).padStart(2, '0');
                            expirationDayValue = `${year}-${month}-${day}`;
                        }
                        return {
                            VoucherName: String(row[0] || '').trim(),
                            Category: String(row[1] || '').trim(),
                            ExpirationDay: expirationDayValue,
                            VoucherCodes: String(row[3] || '').trim()
                        };
                    }).filter(v => v.VoucherCodes !== ''); // Lọc những dòng có mã voucher

                    console.log('Parsed vouchers from file:', parsedVouchers);
                    setVouchersFromFile(parsedVouchers);

                    if (parsedVouchers.length > 0) {
                        const firstVoucher = parsedVouchers[0];
                        const allCodes = parsedVouchers
                            .map(v => v.VoucherCodes) // Các mã đã được trim và lọc ở trên
                            .filter(code => code) // Đảm bảo không có code rỗng sau map
                            .join(',');

                        if (firstVoucher.VoucherName && firstVoucher.Category && firstVoucher.ExpirationDay && allCodes) {
                            setFormData({
                                VoucherName: firstVoucher.VoucherName,
                                Category: firstVoucher.Category,
                                ExpirationDay: firstVoucher.ExpirationDay,
                                VoucherCodes: allCodes
                            });
                            toast.success(`Đã đọc ${parsedVouchers.length} voucher từ file. Sẵn sàng để thêm.`);
                        } else {
                            toast.error('File Excel thiếu thông tin cần thiết (Tên, Loại, Ngày hết hạn ở dòng đầu tiên có mã voucher) hoặc không có mã voucher hợp lệ.');
                            setFormData({ VoucherName: '', Category: '', ExpirationDay: '', VoucherCodes: '' });
                            e.target.value = ''; // Reset file input
                            setFileName('');
                            setVouchersFromFile([]);
                        }
                    } else {
                        toast.info('File không chứa mã voucher nào hợp lệ.');
                        setFormData({ VoucherName: '', Category: '', ExpirationDay: '', VoucherCodes: '' });
                        e.target.value = ''; // Reset file input
                        setFileName('');
                        setVouchersFromFile([]);
                    }
                } catch (readError) {
                    toast.error("Lỗi khi đọc hoặc xử lý file Excel.");
                    console.error("File processing error:", readError);
                    setError("Lỗi xử lý file.");
                    e.target.value = ''; // Reset file input
                    setFileName('');
                    setVouchersFromFile([]);
                    setFormData({ VoucherName: '', Category: '', ExpirationDay: '', VoucherCodes: '' });
                }
            };
            reader.onerror = () => {
                toast.error("Không thể đọc file.");
                setError("Lỗi đọc file.");
                e.target.value = ''; // Reset file input
                setFileName('');
                setVouchersFromFile([]);
                setFormData({ VoucherName: '', Category: '', ExpirationDay: '', VoucherCodes: '' });
            };
            reader.readAsArrayBuffer(file);
        } else {
            setFileName('');
            setVouchersFromFile([]);
            // Reset formData if a file was previously selected and then cleared
            setFormData({ VoucherName: '', Category: '', ExpirationDay: '', VoucherCodes: '' });
        }
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

            if (useFileUpload) {
                if (vouchersFromFile.length === 0) {
                    toast.error('Vui lòng chọn một file Excel và đảm bảo file có chứa dữ liệu voucher hợp lệ.');
                    setIsSubmitting(false);
                    return;
                }
                // formData should now be populated from handleFileChange
                if (!formData.VoucherName || !formData.Category || !formData.ExpirationDay || !formData.VoucherCodes) {
                    toast.error('Dữ liệu từ file Excel không đầy đủ hoặc không hợp lệ. Cần có Tên Voucher, Loại, Ngày hết hạn và ít nhất một Mã Voucher.');
                    setIsSubmitting(false);
                    return;
                }

                // Gửi một yêu cầu duy nhất với formData đã được chuẩn bị
                const response = await axios.post(`${API_BASE_URL}/voucher/addVoucher`, formData, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.Id !== null) {
                    setSuccess('Thêm các voucher từ file thành công!');
                    setVouchersFromFile([]);
                    setFileName('');
                    const fileInput = document.getElementById('voucherFile');
                    if (fileInput) {
                        fileInput.value = ''; // Reset file input
                    }
                    setFormData({ // Reset form data
                        VoucherName: '',
                        Category: '',
                        ExpirationDay: '',
                        VoucherCodes: ''
                    });
                } else {
                    throw new Error(response.data.message || 'Đã xảy ra lỗi khi thêm voucher từ file');
                }
            } else {
                // Process single voucher from form
                if (!formData.VoucherCodes || !formData.VoucherName || !formData.Category || !formData.ExpirationDay) {
                    toast.error('Vui lòng nhập đầy đủ thông tin voucher.');
                    setIsSubmitting(false);
                    return;
                }
                const response = await axios.post(`${API_BASE_URL}/voucher/addVoucher`, formData, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.Id !== null) {
                    setSuccess('Thêm voucher thành công!');
                    setFormData({
                        VoucherName: '',
                        Category: '',
                        ExpirationDay: '',
                        VoucherCodes: ''
                    });
                } else {
                    throw new Error(response.data.message || 'Đã xảy ra lỗi khi thêm voucher');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi thêm voucher');
            toast.error(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi thêm voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8" style={{ paddingTop: '60px' }}>
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
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={useFileUpload}
                            onChange={(e) => setUseFileUpload(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Sử dụng file Excel để thêm nhiều voucher</span>
                    </label>
                </div>
                <form onSubmit={handleSubmit}>
                    {!useFileUpload ? (
                        <>
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
                        </>
                    ) : (
                        <div className="mb-4">
                            <label htmlFor="voucherFile" className="block text-sm font-medium text-gray-700">
                                Tệp Excel chứa mã Voucher
                            </label>
                            <input
                                type="file"
                                id="voucherFile"
                                name="voucherFile"
                                accept=".xlsx,.xlsm,.xls"
                                onChange={handleFileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {fileName && (
                                <p className="mt-2 text-sm text-gray-600">Đã chọn: {fileName}</p>
                            )}
                        </div>
                    )}
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