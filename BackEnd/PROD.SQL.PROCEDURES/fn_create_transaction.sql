DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_transaction; $$
CREATE PROCEDURE fn_create_transaction (
    IN in_voucherId INT,
    IN in_postId INT,
    IN in_Amount INT,
    IN in_quantity INT,
    IN in_UserIdBuyer INT,
    IN in_UserIdSeller INT
)
BEGIN
	DECLARE p_transaction_id INT;
    DECLARE p_current_quantity INT;
    DECLARE p_balance INT;
    DECLARE done INT DEFAULT 0;
	DECLARE p_voucher_code VARCHAR(100);
    DECLARE p_voucher_name VARCHAR(100);
    -- Declare the exit handler first
    
    DECLARE voucher_cursor CURSOR FOR
        SELECT VoucherCode
        FROM Voucher V 
        JOIN Post P ON V.VoucherId = P.VoucherId
        WHERE P.VoucherId = in_voucherId 
          AND P.PostId = in_postId 
          AND V.UserId = in_UserIdSeller
          AND V.UserId IS NOT NULL
        LIMIT in_quantity;
        
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    START TRANSACTION;
    
    IF in_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng phải lớn hơn 0';
    END IF;
    
    IF in_Amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số tiền phải lớn hơn 0';
    END IF;
    
    SELECT AccountBalance INTO p_balance 
    FROM `User` 
    WHERE UserId = in_UserIdBuyer;
    
    SELECT VoucherName INTO p_voucher_name
    FROM `Voucher`
    WHERE VoucherId=in_voucherId;
    
    IF p_balance IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Người mua không tồn tại';
    END IF;
    
    IF p_balance < in_Amount * in_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số dư không đủ';
    END IF;

    -- Kiểm tra số lượng trong Post
    SELECT Quantity INTO p_current_quantity
    FROM Post
    WHERE VoucherId = in_voucherId AND PostId = in_postId;

    IF p_current_quantity IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bài đăng không tồn tại';
    END IF;

    IF p_current_quantity < in_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng voucher không đủ';
    END IF;

    -- Open cursor
    OPEN voucher_cursor;

    -- Loop through VoucherCode
    read_loop: LOOP
        FETCH voucher_cursor INTO p_voucher_code;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Insert vào Transaction
        INSERT INTO `Transaction` (TransactionAmount, UserIdBuyer, UserIdSeller, CreateAt, Status, PostId, VoucherId, VoucherCode)
        VALUES (in_Amount, in_UserIdBuyer, in_UserIdSeller, NOW(), 0, in_postId, in_voucherId, p_voucher_code);

        -- Lấy ID của giao dịch vừa tạo
        SET p_transaction_id = LAST_INSERT_ID();

        -- Cập nhật Voucher
        UPDATE Voucher
        SET UserId = in_UserIdBuyer
        WHERE VoucherId = in_voucherId AND VoucherCode = p_voucher_code;

        -- Tạo thông báo cho mỗi giao dịch
        INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, created_at, updated_at, is_read, is_deleted, transaction_id) 
        VALUES (
			in_UserIdBuyer, 
            'order', 
            CONCAT('Thanh toán voucher', p_voucher_name), 
            'Thanh toán thành công.', 
            'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg',
            NOW(), 
            NOW(), 
            0, 
            0, 
            p_transaction_id
        );
    END LOOP;

    -- Close cursor
    CLOSE voucher_cursor;

    UPDATE Post
    SET Quantity = Quantity - in_quantity
    WHERE VoucherId = in_voucherId AND PostId = in_postId;

    UPDATE `User`
    SET AccountBalance = AccountBalance + (in_Amount * in_quantity)
    WHERE UserId = in_UserIdSeller;

    UPDATE `User`
    SET AccountBalance = AccountBalance - (in_Amount * in_quantity)
    WHERE UserId = in_UserIdBuyer;

    -- Commit transaction
    COMMIT;

    SELECT 'Transaction Created' AS Message, p_transaction_id AS Id;
END $$

DELIMITER ;

