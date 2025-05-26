DELIMITER $$

DROP PROCEDURE IF EXISTS fn_request_refund;$$
CREATE PROCEDURE fn_request_refund(IN v_transaction_id INT)
proc: BEGIN
	DECLARE p_user_id_buyer INT;
    DECLARE p_amount INT;
	DECLARE p_status INT;
    
    SELECT `Status` INTO p_status
    FROM Transaction
    WHERE TransactionId = v_transaction_id;
    
    IF p_status != 0 THEN
        SELECT 'Giao dịch không hợp lệ để xử lý (không ở trạng thái chờ xử lý)' AS Message, -1 AS Id;
        LEAVE proc;
    END IF;
    
	UPDATE Transaction
    SET `Status` = 2
    WHERE TransactionId = v_transaction_id;

    INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, 
						created_at, updated_at, is_read, is_deleted) VALUES
	(p_user_id_buyer, 'wallet', CONCAT('Bạn đã yêu cầu hoàn tiền cho giao dịch:', v_transaction_id), 'Yêu cầu của bạn đang được xử lý, vui lòng đợi trong giây lát!', 
    'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg', 
    NOW(), NOW(), 0, 0);
    
    SELECT 'Updated Successfully' AS Message, v_transaction_id AS Id;
END proc $$

DELIMITER ;

CALL fn_request_refund(60);