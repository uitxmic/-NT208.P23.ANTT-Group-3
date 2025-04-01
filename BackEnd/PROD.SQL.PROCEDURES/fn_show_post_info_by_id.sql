
DELIMITER $$

DROP PROCEDURE IF EXISTS fn_show_post_info_by_id;$$
CREATE PROCEDURE fn_show_post_info_by_id(IN post_id INT)
BEGIN
   SELECT 
        PostId, P.VoucherId, P.UserId, Postname, Content, Date,
        VoucherName, Label, VoucherImage,
        IsActive,
        CASE 
            WHEN Expire < CURDATE() THEN 'Expired'
            WHEN IsActive = FALSE THEN 'Inactive'
            ELSE 'Active'
        END AS Status
    FROM Post P 
    JOIN Voucher V ON P.VoucherId = V.VoucherId
    WHERE P.UserId = post_id
    ORDER BY IsActive DESC;
END $$

DELIMITER ;

CALL fn_show_post_info_by_id(2)