DELIMITER $$

DROP PROCEDURE IF EXISTS fn_complete_transaction;$$
CREATE PROCEDURE fn_complete_transaction(IN v_transaction_id INT)
BEGIN
	UPDATE Transaction
    SET `Status` = 1
    WHERE TransactionId = v_transaction_id;
    
    SELECT 'Updated Successfully' AS Message, 1 AS Id;
END $$

DELIMITER ;

CALL fn_complete_transaction(1);