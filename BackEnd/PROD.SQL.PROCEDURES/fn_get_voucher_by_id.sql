DELIMITER $$
DROP PROCEDURE IF EXISTS fn_get_voucher_by_id$$
CREATE PROCEDURE fn_get_voucher_by_id(IN v_voucher INT)
BEGIN
	SELECT VoucherName FROM Voucher
    WHERE VoucherId = v_voucher
    GROUP BY VoucherName;
END$$
DELIMITER ;

CALL fn_get_voucher_by_id(1);