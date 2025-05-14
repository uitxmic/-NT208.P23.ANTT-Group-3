DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_valid_User_vouchers;$$
CREATE PROCEDURE fn_get_all_valid_User_vouchers(IN p_UserId INT)
BEGIN
   SELECT 
        V.VoucherId,
        V.VoucherName,
        V.Label,
        V.UserId,
        V.ExpirationDay,
        GROUP_CONCAT(DISTINCT VoucherCode) AS VoucherCode,
        GROUP_CONCAT(DISTINCT P.VouImg) AS VouImg
    FROM Voucher V 
    JOIN Post P ON V.VoucherId = P.VoucherId
    WHERE V.ExpirationDay >= CURDATE()
      AND V.UserId = p_UserId
    GROUP BY 
        V.VoucherId, V.VoucherName, V.Label, V.UserId, V.ExpirationDay
    ORDER BY V.ExpirationDay ASC;
END $$

DELIMITER ;

CALL fn_get_all_valid_User_vouchers(22);