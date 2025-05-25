DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_voucher_by_user_id;$$
CREATE PROCEDURE fn_get_voucher_by_user_id(IN uid INT)
BEGIN
 SELECT 
        V.VoucherId,
        V.VoucherName,
        GROUP_CONCAT(DISTINCT V.VoucherCode) AS VoucherCodes,
        V.Category,
        V.UserId,
        V.ExpirationDay,
        P.Price,
        (SELECT P.VouImg 
         FROM Post P 
         WHERE P.VoucherId = V.VoucherId 
         ORDER BY P.PostId DESC 
         LIMIT 1) AS VouImg,
         (SELECT COUNT(*) FROM Voucher V1 WHERE V1.VoucherId = V.VoucherId AND V1.UserId = V.UserId) AS Quantity
    FROM Voucher V 
    LEFT JOIN Post P ON V.VoucherId = P.VoucherId
    WHERE V.ExpirationDay >= CURDATE()
      AND V.UserId = uid
    GROUP BY 
        V.VoucherId, 
        V.VoucherName, 
        V.Category, 
        V.UserId, 
        V.ExpirationDay,
		P.Price
    ORDER BY V.ExpirationDay ASC;
END $$

DELIMITER ;

CALL fn_get_voucher_by_user_id(7)