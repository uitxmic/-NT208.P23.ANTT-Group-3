DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_news_by_id;$$

CREATE PROCEDURE fn_get_news_by_id(IN post_id INT)
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
        v.Description AS VoucherDescription,
        v.Price,
        u.Username,
        u.Fullname,
        CASE 
            WHEN p.Expire < CURDATE() THEN 'Expired'
            WHEN p.IsActive = FALSE THEN 'Inactive'
            ELSE 'Active'
        END AS Status
    FROM Post p
    JOIN Voucher v ON p.VoucherId = v.VoucherId
    JOIN User u ON p.UserId = u.UserId
    WHERE p.PostId = post_id;
END$$

DELIMITER ; 