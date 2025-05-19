DELIMITER $$

DROP PROCEDURE IF EXISTS fn_complete_transaction;$$
CREATE PROCEDURE fn_complete_transaction(IN v_transaction_id INT)
BEGIN
	DECLARE p_user_id_seller INT;
    DECLARE p_amount INT;
    
    SELECT UserIdseller FROM Transaction WHERE TransactionId = v_transaction_id
    INTO p_user_id_seller;
    
    SELECT TransactionAmount FROM Transaction WHERE TransactionId = v_transaction_id
    INTO p_amount;
    
	UPDATE Transaction
    SET `Status` = 1
    WHERE TransactionId = v_transaction_id;
    
    UPDATE `User`
    SET AccountBalance = AccountBalance + p_amount
    WHERE UserId = p_user_id_seller;
    
    SELECT 'Updated Successfully' AS Message, p_user_id_seller AS Id;
END $$

DELIMITER ;

CALL fn_complete_transaction(1);