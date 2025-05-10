DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_valid_User_vouchers;$$
CREATE PROCEDURE fn_get_all_valid_User_vouchers(IN p_UserId INT)
BEGIN
   SELECT 
        V.VoucherId,
        VoucherName,
        VoucherCode,
        Label,
        V.UserId,
        VouImg,
        ExpirationDay
    FROM Voucher V JOIN Post P
    ON V.VoucherId = P.VoucherId
    WHERE ExpirationDay >= CURDATE()
    AND V.UserId = p_UserId
    ORDER BY ExpirationDay ASC;
END $$

DELIMITER ;

CALL fn_get_all_valid_User_vouchers(22);