DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_voucher_by_user_id;$$
CREATE PROCEDURE fn_get_voucher_by_user_id(IN uid INT)
BEGIN
    SELECT * FROM Voucher WHERE UserId = uid;
END $$

DELIMITER ;