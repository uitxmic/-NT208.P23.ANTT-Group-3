DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_transaction; $$
CREATE PROCEDURE fn_create_transaction (
    IN in_voucherId INT,
    IN in_postId INT,
    IN in_Amount INT,
    IN in_UserIdBuyer INT,
    IN in_UserIdSeller INT
)
BEGIN

	DECLARE p_voucher_code VARCHAR(100);
    -- Declare the exit handler first
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    SELECT AccountBalance INTO @bal FROM `User` WHERE UserId = in_UserIdBuyer;
	IF @bal < in_Amount THEN
	   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
	END IF;
    
	SELECT VoucherCode FROM 
    Voucher V JOIN Post P
    ON V.VoucherId = P.VoucherId
    WHERE P.VoucherId = in_voucherId AND P.PostId = in_postId AND V.UserId = in_UserIdSeller
    LIMIT 1
    INTO p_voucher_code; 

    -- Insert statement
    INSERT INTO `Transaction` (TransactionAmount, UserIdBuyer, UserIdSeller, CreateAt, Status, PostId, VoucherId, VoucherCode)
    VALUES
    (
    in_Amount, in_UserIdBuyer, in_UserIdSeller, NOW(), 0, in_postId, in_voucherId, p_voucher_code
    );
    
    -- fn update voucher
	UPDATE Voucher
    SET UserId = in_UserIdBuyer
    WHERE VoucherId = in_voucherId AND VoucherCode = p_voucher_code;
    
	UPDATE Post
    SET Quantity = Quantity - 1
    WHERE VoucherId = in_voucherId AND PostId = in_postId;
    
    -- fn update balance
    UPDATE 	`User`
    SET AccountBalance = AccountBalance + in_Amount
    WHERE UserId = 1; -- update for super admin
    
	UPDATE 	`User`
    SET AccountBalance = AccountBalance - in_Amount
    WHERE UserId = in_UserIdBuyer; -- update for buyer
    
    
    SELECT 'Transaction Created' AS Message, LAST_INSERT_ID() AS Id;
END $$

DELIMITER ;

-- Call the procedure
CALL fn_create_transaction(1, 4, 10, 15, 2);