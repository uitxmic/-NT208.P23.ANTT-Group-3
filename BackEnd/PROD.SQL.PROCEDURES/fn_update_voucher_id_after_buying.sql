DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_voucher_id_after_buying;$$
CREATE PROCEDURE fn_update_voucher_id_after_buying(IN v_userId_buyer INT, IN v_userId_seller INT, IN v_voucherId INT, IN v_postId INT)
BEGIN
	DECLARE p_voucher_code TEXT;
	DECLARE p_price INT;
	DECLARE p_transaction_id INT;
    
    SELECT VoucherCode FROM 
    Voucher V JOIN Post P
    ON V.VoucherId = P.VoucherId
    WHERE P.VoucherId = v_voucherId AND P.PostId = v_postId AND V.UserId = v_userId_seller
    LIMIT 1
    INTO p_voucher_code;
    
    SELECT Price FROM Post WHERE PostId = v_postId AND VoucherId = v_voucherId AND UserId = v_userId_seller
    LIMIT 1
    INTO p_price;
    
    UPDATE Voucher
    SET UserId = v_userId_buyer
    WHERE VoucherId = v_voucherId and VoucherCode = p_voucher_code;
    
    UPDATE Post
    SET Quantity = Quantity - 1
    WHERE VoucherId = v_voucherId AND PostId = v_postId;
    
    INSERT INTO Transaction(TransactionAmount, UserIdbuyer, UserIdseller, CreateAt, Status, PostId, VoucherId, VoucherCode)
    VALUES
    (p_price, v_userId_buyer, v_userId_seller, NOW(), 1, v_postId, v_voucherId, p_voucher_code);
    
	SET p_transaction_id = LAST_INSERT_ID();
    
    INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, created_at, updated_at, is_read, is_deleted, transaction_id) 
    VALUES
    (v_userId_buyer, 'order', 'Đơn hàng đã giao', 'Đơn hàng của bạn đã được giao thành công.', 'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg',
    NOW(), NOW(), 0, 0, p_transaction_id);
END $$

DELIMITER ;

CALL fn_update_voucher_id_after_buying(3,2,1,4);