DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_voucher_by_user_id;$$
CREATE PROCEDURE fn_get_voucher_by_user_id(IN uid INT)
BEGIN
    SELECT V.VoucherId, VoucherCode, VoucherName, V.UserId, Category, `Expire`,
			VouImg, Price, (SELECT COUNT(*) FROM Voucher V1 WHERE V1.VoucherId = V.VoucherId AND V1.UserId = V.UserId) AS Quantity
    FROM Voucher V JOIN Post P 
    ON V.VoucherId = P.VoucherId
    WHERE V.UserId = uid;
END $$

DELIMITER ;

CALL fn_get_voucher_by_user_id(22)