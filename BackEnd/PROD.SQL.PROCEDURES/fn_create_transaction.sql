
DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_transaction;
$$
CREATE PROCEDURE fn_create_transaction (
    IN in_voucherId INT,
    IN in_postId INT,
    IN in_Amount INT,
    IN in_quantity INT,
    IN in_UserIdBuyer INT,
    IN in_UserIdSeller INT,
    OUT out_message VARCHAR(255),
    OUT out_id INT
)
BEGIN
    DECLARE p_transaction_id INT;
    DECLARE p_current_quantity INT;
    DECLARE p_balance INT;
    DECLARE done INT DEFAULT 0;
    DECLARE p_voucher_code VARCHAR(100);
    DECLARE p_voucher_name VARCHAR(100);
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_voucher_count INT;

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
        GET DIAGNOSTICS CONDITION 1 
            @sql_error_code = MYSQL_ERRNO, 
            @sql_error_message = MESSAGE_TEXT;
        INSERT INTO debug_log (log_message, log_time, procedure_name, sql_error_code, sql_error_message)
        VALUES ('SQLEXCEPTION occurred', NOW(), 'fn_create_transaction', @sql_error_code, @sql_error_message);
        ROLLBACK;
        SET out_message = 'Created Failed';
        SET out_id = -1;
    END;

    START TRANSACTION;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Bắt đầu kiểm tra đầu vào', NOW(), 'fn_create_transaction');
    
    IF in_quantity <= 0 THEN
        SET v_error_message = 'Số lượng phải lớn hơn 0';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    IF in_Amount <= 0 THEN
        SET v_error_message = 'Số tiền phải lớn hơn 0';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Kiểm tra số dư người mua', NOW(), 'fn_create_transaction');
    
    SELECT AccountBalance INTO p_balance 
    FROM User 
    WHERE UserId = in_UserIdBuyer 
    LIMIT 1 FOR UPDATE;
    
    IF p_balance IS NULL THEN
        SET v_error_message = 'Người mua không tồn tại';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    IF p_balance < in_Amount * in_quantity THEN
        SET v_error_message = 'Số dư không đủ';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Kiểm tra tên voucher', NOW(), 'fn_create_transaction');
    
    SELECT VoucherName INTO p_voucher_name
    FROM Voucher
    WHERE VoucherId = in_voucherId
    LIMIT 1;
    
    IF p_voucher_name IS NULL THEN
        SET v_error_message = 'Voucher không tồn tại';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Kiểm tra số lượng bài đăng', NOW(), 'fn_create_transaction');
    
    SELECT Quantity INTO p_current_quantity
    FROM Post
    WHERE VoucherId = in_voucherId AND PostId = in_postId
    LIMIT 1 FOR UPDATE;
    
    IF p_current_quantity IS NULL THEN
        SET v_error_message = 'Bài đăng không tồn tại';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    IF p_current_quantity < in_quantity THEN
        SET v_error_message = 'Số lượng voucher không đủ';
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Kiểm tra số lượng VoucherCode', NOW(), 'fn_create_transaction');
    
    SELECT COUNT(*) INTO v_voucher_count
    FROM Voucher V 
    JOIN Post P ON V.VoucherId = P.VoucherId
    WHERE P.VoucherId = in_voucherId 
      AND P.PostId = in_postId 
      AND V.UserId = in_UserIdSeller
      AND V.UserId IS NOT NULL
    FOR UPDATE;
    
    IF v_voucher_count < in_quantity THEN
        SET v_error_message = CONCAT('Không đủ VoucherCode khả dụng. Đã tìm thấy: ', v_voucher_count, ', cần: ', in_quantity);
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (v_error_message, NOW(), 'fn_create_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;

    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Mở cursor VoucherCode', NOW(), 'fn_create_transaction');
    
    OPEN voucher_cursor;

    read_loop: LOOP
        FETCH voucher_cursor INTO p_voucher_code;
        IF done THEN
            LEAVE read_loop; -- Thoát vòng lặp nếu cursor hết dữ liệu
        END IF;

        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (CONCAT('Insert Transaction cho VoucherCode: ', p_voucher_code), NOW(), 'fn_create_transaction');

        INSERT INTO Transaction (TransactionAmount, UserIdBuyer, UserIdSeller, CreateAt, Status, PostId, VoucherId, VoucherCode)
        VALUES (in_Amount, in_UserIdBuyer, in_UserIdSeller, NOW(), 0, in_postId, in_voucherId, p_voucher_code);

        SET p_transaction_id = LAST_INSERT_ID();

        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (CONCAT('Update Voucher cho VoucherCode: ', p_voucher_code), NOW(), 'fn_create_transaction');

        UPDATE Voucher
        SET UserId = in_UserIdBuyer
        WHERE VoucherId = in_voucherId AND VoucherCode = p_voucher_code;

        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (CONCAT('Insert Noti cho Transaction: ', p_transaction_id), NOW(), 'fn_create_transaction');

        INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, created_at, updated_at, is_read, is_deleted, transaction_id) 
        VALUES (
            in_UserIdBuyer, 
            'order', 
            CONCAT('Thanh toán voucher ', p_voucher_name), 
            'Thanh toán thành công.', 
            'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg',
            NOW(), 
            NOW(), 
            0, 
            0, 
            p_transaction_id
        );
    END LOOP;

    CLOSE voucher_cursor;

    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Cập nhật số lượng Post', NOW(), 'fn_create_transaction');

    UPDATE Post
    SET Quantity = Quantity - in_quantity
    WHERE VoucherId = in_voucherId AND PostId = in_postId;

    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Cập nhật số dư Seller', NOW(), 'fn_create_transaction');

    UPDATE `User`
    SET AccountBalance = AccountBalance + (in_Amount * in_quantity)
    WHERE UserId = in_UserIdSeller;

    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Cập nhật số dư Buyer', NOW(), 'fn_create_transaction');

    UPDATE `User`
    SET AccountBalance = AccountBalance - (in_Amount * in_quantity)
    WHERE UserId = in_UserIdBuyer;

    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Commit transaction', NOW(), 'fn_create_transaction');

    COMMIT;

    SET out_message = 'Transaction Created';
    SET out_id = p_transaction_id;
END $$

DELIMITER ;

CALL fn_create_transaction(5, 20, 1, 1, 29, 7, @out_message, @out_id);
select @out_message, @out_id