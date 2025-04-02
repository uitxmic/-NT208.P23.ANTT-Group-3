DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_news;$$

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
        v.Label,
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