DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_post;$$
CREATE PROCEDURE fn_get_all_post()
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
    ORDER BY IsActive DESC;
END $$

DELIMITER ;

CALL fn_get_all_post()