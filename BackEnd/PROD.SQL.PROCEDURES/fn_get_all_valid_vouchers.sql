DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_valid_vouchers;$$
CREATE PROCEDURE fn_get_all_valid_vouchers(IN p_UserId INT)
BEGIN
   SELECT 
        VoucherId,
        VoucherName,
        Category,
        UserId,
        VoucherImage,
        ExpirationDay,
        Price
    FROM Voucher
    WHERE ExpirationDay >= CURDATE()
    AND UserId != p_UserId
    ORDER BY ExpirationDay ASC;
END $$

DELIMITER ;