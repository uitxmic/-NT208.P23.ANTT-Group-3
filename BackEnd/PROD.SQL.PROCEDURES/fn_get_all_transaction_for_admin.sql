DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_transaction_for_admin; $$
CREATE PROCEDURE fn_get_all_transaction_for_admin ()
BEGIN
	SELECT TransactionId, TransactionAmount, B.Fullname AS Buyer, S.Fullname AS Seller,
			CreateAt, `Status`, P.Postname, VoucherCode
	FROM `Transaction` T
    JOIN `User` B ON T.UserIdbuyer = B.UserId
    JOIN `User` S ON T.UserIdseller = S.UserId
    JOIN Post P ON P.PostId = T.PostId
    ORDER BY TransactionId DESC;
END $$

DELIMITER ;

-- Call the procedure
CALL fn_get_all_transaction_for_admin();