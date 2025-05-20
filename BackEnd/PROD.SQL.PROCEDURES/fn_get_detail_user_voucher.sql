DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_detail_user_voucher;$$
CREATE PROCEDURE fn_get_detail_user_voucher(IN p_UserId INT, IN p_VoucherId INT)
BEGIN
    SELECT 
        V.VoucherId,
        V.VoucherName,
        V.Category,
        V.UserId,
        V.ExpirationDay,
        GROUP_CONCAT(DISTINCT V.VoucherCode) AS VoucherCode,
        (SELECT P.VouImg 
         FROM Post P 
         WHERE P.VoucherId = V.VoucherId 
         ORDER BY P.PostId DESC 
         LIMIT 1) AS VouImg
    FROM Voucher V 
    LEFT JOIN Post P ON V.VoucherId = P.VoucherId
    WHERE V.ExpirationDay >= CURDATE()
      AND V.UserId = p_UserId
      AND V.VoucherId = p_VoucherId
    GROUP BY 
        V.VoucherId, V.VoucherName, V.Category, V.UserId, V.ExpirationDay;
END $$

DELIMITER ;

call fn_get_detail_user_voucher(29,4);