import axios from 'axios'
import { useEffect, useState } from 'react'

function Notification() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/notification"); // Thay URL API của bạn
      if (response.status === 200) {
        setNotifications(response.data); // Lưu dữ liệu vào state
      } else {
        console.error("Lỗi khi lấy thông báo");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

    return (
      <div>
        <h2>Danh sách thông báo</h2>
        <ul>
          {notifications.map((noti) => (
            <li key={noti.NotiId}>
              <strong>{noti.NotiTitle}</strong>: {noti.NotiContent} -{" "}
              {new Date(noti.CreateAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default Notification;