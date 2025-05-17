DELIMITER $$

DROP PROCEDURE IF EXISTS fn_show_post_info_by_id;$$
CREATE PROCEDURE fn_show_post_info_by_id(IN user_id INT)
BEGIN
   SELECT 
        PostId, P.VoucherId, P.UserId, Postname, Content, Date,
        VoucherName, Category, VouImg, Price,
        IsActive, IsVerified, 
        CASE 
            WHEN IsActive = 0 AND IsVerified = 0 THEN 'Pending'   -- màu vàng
            WHEN IsActive = 1 AND IsVerified = 1 THEN 'Active'    -- màu xanh
            WHEN IsActive = 0 AND IsVerified = 1 THEN 'InActive'  -- màu đỏ
            WHEN Expire < CURDATE() THEN 'Expired'
            ELSE 'Unknown'
        END AS Status
    FROM Post P 
    JOIN Voucher V ON P.VoucherId = V.VoucherId
    WHERE P.UserId = user_id
    GROUP BY PostId, P.VoucherId, P.UserId, Postname, Content, Date, VoucherName, Category, VouImg, Price, IsActive, IsVerified, Expire
    ORDER BY IsActive DESC;
END $$

DELIMITER ;

CALL fn_show_post_info_by_id(22);
