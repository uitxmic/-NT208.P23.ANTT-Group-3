DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_news;$$

/*
* Lấy tất cả tin tức về voucher với thông tin chi tiết
* Bao gồm: thông tin bài đăng, voucher và người đăng
* Sắp xếp: theo ngày đăng mới nhất
* Trạng thái: Active/Inactive/Expired
*/

CREATE PROCEDURE fn_get_all_news()
BEGIN
    SELECT 
        p.PostId,
        p.VoucherId,
        p.UserId,
        p.Postname,
        p.Content,
        p.Date,
        p.Expire,
        p.IsActive,
        v.VoucherName,
        v.Category,
        v.VoucherImage,
        u.Username,
        CASE 
            WHEN p.Expire < CURDATE() THEN 'Expired'
            WHEN p.IsActive = FALSE THEN 'Inactive'
            ELSE 'Active'
        END AS Status
    FROM Post p
    JOIN Voucher v ON p.VoucherId = v.VoucherId
    JOIN User u ON p.UserId = u.UserId
    ORDER BY p.Date DESC;
END$$

DELIMITER ; 