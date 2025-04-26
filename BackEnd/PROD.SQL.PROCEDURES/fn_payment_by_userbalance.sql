DELIMITER $$

DROP PROCEDURE IF EXISTS fn_payment_by_userbalance;$$
CREATE PROCEDURE fn_payment_by_userbalance(
    IN p_UserId INT,
    IN p_VoucherId INT
)
BEGIN
    DECLARE v_Balance INT;
    DECLARE v_VoucherPrice INT;
    DECLARE v_VoucherExists INT;
    DECLARE v_UserExists INT;
	DECLARE v_UserId INT;

    START TRANSACTION;

    SELECT COUNT(*) INTO v_UserExists
    FROM `User`
    WHERE UserId = p_UserId;

    IF v_UserExists = 0 THEN
        SELECT 'User not found' AS message;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    END IF;

    SELECT COUNT(*) INTO v_VoucherExists
    FROM `Voucher`
    WHERE VoucherId = p_VoucherId;

    IF v_VoucherExists = 0 THEN
        SELECT 'Voucher not found' AS message;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Voucher not found';
    END IF;

    SELECT AccountBalance INTO v_Balance
    FROM `User`
    WHERE UserId = p_UserId;

    SELECT Price INTO v_VoucherPrice
    FROM `Voucher`
    WHERE VoucherId = p_VoucherId;
    
    select UserId into v_UserId
    FROM `Voucher`
    WHERE VoucherId = p_VoucherId;

    IF v_Balance < v_VoucherPrice THEN
        SELECT 'Insufficient balance' AS message;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;

    UPDATE `User`
    SET AccountBalance = AccountBalance - v_VoucherPrice
    WHERE UserId = p_UserId;
    
    update `User`
    SET AccountBalance = AccountBalance + v_VoucherPrice
    WHERE UserId = v_UserId;

    update `Voucher` 
    SET UserId=p_UserId
    WHERE VoucherId=p_VoucherId;

    COMMIT;
    SELECT 'Payment successful' AS message;
END $$

DELIMITER ;

call fn_payment_by_userbalance(18, 3)