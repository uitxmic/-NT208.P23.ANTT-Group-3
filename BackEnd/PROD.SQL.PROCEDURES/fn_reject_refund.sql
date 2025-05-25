DELIMITER $$

DROP PROCEDURE IF EXISTS fn_reject_refund;$$
CREATE PROCEDURE fn_reject_refund(IN v_transaction_id INT)
proc: BEGIN
	DECLARE p_user_id_seller INT;
	DECLARE p_user_id_buyer INT;
    DECLARE p_amount INT;
	DECLARE p_status INT;
    
    SELECT `Status` INTO p_status
    FROM Transaction
    WHERE TransactionId = v_transaction_id;
    
    IF p_status != 2 THEN
        SELECT 'Giao dịch không hợp lệ để từ chối hoàn tiền (không ở trạng thái chờ xử lý)' AS Message, -1 AS Id;
        LEAVE proc;
    END IF;
    
    SELECT UserIdseller FROM Transaction WHERE TransactionId = v_transaction_id
    INTO p_user_id_seller;
    
	SELECT UserIdbuyer FROM Transaction WHERE TransactionId = v_transaction_id
    INTO p_user_id_buyer;
    
    SELECT TransactionAmount FROM Transaction WHERE TransactionId = v_transaction_id
    INTO p_amount;
    
	UPDATE Transaction
    SET `Status` = 3
    WHERE TransactionId = v_transaction_id;
    
	UPDATE `User`
    SET AccountBalance = AccountBalance - p_amount
    WHERE UserId = 1;
    
    UPDATE `User`
    SET AccountBalance = AccountBalance + p_amount
    WHERE UserId = p_user_id_seller;
    
    INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, 
						created_at, updated_at, is_read, is_deleted) VALUES
	(p_user_id_buyer, 'wallet', CONCAT('Không thể hoàn tiền cho giao dịch: ', v_transaction_id), 'Không thể hoàn tiền cho giao dịch bạn yêu cầu', 
    'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg', 
    NOW(), NOW(), 0, 0);
    
	INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, 
						created_at, updated_at, is_read, is_deleted) VALUES
	(p_user_id_seller, 'wallet', CONCAT('Giao dịch', v_transaction_id, 'đã hoàn thành'), 'Bạn có giao dịch đã hoàn thành, kiểm tra số dư ngay', 
    'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg', 
    NOW(), NOW(), 0, 0);
    
    SELECT 'Updated Successfully' AS Message, p_user_id_seller AS Id;
END proc $$

DELIMITER ;

CALL fn_accept_refund(1);