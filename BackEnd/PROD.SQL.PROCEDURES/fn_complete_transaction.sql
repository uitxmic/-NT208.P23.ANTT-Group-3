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
    SET AccountBalance = AccountBalance - p_amount
    WHERE UserId = 1;
    
    UPDATE `User`
    SET AccountBalance = AccountBalance + p_amount
    WHERE UserId = p_user_id_seller;
    
	UPDATE `User`
    SET SoldAmount = SoldAmount + p_amount
    WHERE UserId = p_user_id_seller;
    
    INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, 
						created_at, updated_at, is_read, is_deleted) VALUES
	(p_user_id_seller, 'order', 'Đơn hàng đã hoàn tất', 'Đơn hàng của bạn đã hoàn tất, kiểm tra số dư ngay', 
    'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg', 
    NOW(), NOW(), 0, 0);
    
    SELECT 'Updated Successfully' AS Message, p_user_id_seller AS Id;
END $$

DELIMITER ;

CALL fn_complete_transaction(1);