DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_free_transaction;
$$
CREATE PROCEDURE fn_create_free_transaction (
    IN in_voucherId INT,
    IN in_postId INT,
    IN in_Amount INT,
    IN in_quantity INT,
    IN in_UserIdBuyer INT,
    IN in_UserIdSeller INT,
    OUT out_message VARCHAR(255),
    OUT out_id INT
)
proc_label: BEGIN
    DECLARE p_transaction_id INT;
    DECLARE p_current_quantity INT;
    DECLARE p_voucher_code VARCHAR(100);
    DECLARE p_voucher_name VARCHAR(100);
    DECLARE v_voucher_count INT;
    DECLARE v_collected_count INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 
            @sql_error_code = MYSQL_ERRNO, 
            @sql_error_message = MESSAGE_TEXT;
        INSERT INTO debug_log (log_message, log_time, procedure_name, sql_error_code, sql_error_message)
        VALUES ('Đã xảy ra SQLEXCEPTION không mong muốn', NOW(), 'fn_create_free_transaction', @sql_error_code, @sql_error_message);
        ROLLBACK;
        SET out_message = 'Đã xảy ra lỗi không mong muốn';
        SET out_id = -1;
    END;

    START TRANSACTION;
    
    INSERT INTO debug_log (log_message, log_time, procedure_name) 
    VALUES ('Bắt đầu kiểm tra đầu vào', NOW(), 'fn_create_free_transaction');
    
    -- Kiểm tra số lượng phải là 1
    IF in_quantity != 1 THEN
        SET out_message = 'Trong flash sale, mỗi người chỉ được thu thập 1 voucher';
        SET out_id = -1;
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (out_message, NOW(), 'fn_create_free_transaction');
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Kiểm tra nếu user đã thu thập voucher từ PostId này
    SELECT COUNT(*) INTO v_collected_count
    FROM Transaction
    WHERE UserIdBuyer = in_UserIdBuyer 
      AND PostId = in_postId 
      AND Status = 1;

    IF v_collected_count >= 1 THEN
        SET out_message = 'Bạn đã sở hữu voucher này!';
        SET out_id = -1;
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (out_message, NOW(), 'fn_create_free_transaction');
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Kiểm tra tên voucher
    SELECT VoucherName INTO p_voucher_name
    FROM Voucher
    WHERE VoucherId = in_voucherId
    LIMIT 1;

    IF p_voucher_name IS NULL THEN
        SET out_message = 'Voucher không tồn tại';
        SET out_id = -1;
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (out_message, NOW(), 'fn_create_free_transaction');
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Kiểm tra số lượng bài đăng
    SELECT Quantity INTO p_current_quantity
    FROM Post
    WHERE VoucherId = in_voucherId AND PostId = in_postId
    FOR UPDATE;

    IF p_current_quantity IS NULL OR p_current_quantity < 1 THEN
        SET out_message = 'Bài đăng không tồn tại hoặc số lượng voucher không đủ';
        SET out_id = -1;
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (out_message, NOW(), 'fn_create_free_transaction');
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Kiểm tra số lượng VoucherCode khả dụng
    SELECT VoucherCode INTO p_voucher_code
    FROM Voucher V 
    JOIN Post P ON V.VoucherId = P.VoucherId
    WHERE P.VoucherId = in_voucherId 
      AND P.PostId = in_postId 
      AND (V.UserId IS NULL OR V.UserId = in_UserIdSeller)
    LIMIT 1;

    IF p_voucher_code IS NULL THEN
        SET out_message = 'Không đủ VoucherCode khả dụng';
        SET out_id = -1;
        INSERT INTO debug_log (log_message, log_time, procedure_name) 
        VALUES (out_message, NOW(), 'fn_create_free_transaction');
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Thực hiện giao dịch
    INSERT INTO Transaction (TransactionAmount, UserIdBuyer, UserIdSeller, CreateAt, Status, PostId, VoucherId, VoucherCode)
    VALUES (0, in_UserIdBuyer, in_UserIdSeller, NOW(), 1, in_postId, in_voucherId, p_voucher_code);

    SET p_transaction_id = LAST_INSERT_ID();

    UPDATE Voucher
    SET UserId = in_UserIdBuyer
    WHERE VoucherId = in_voucherId AND VoucherCode = p_voucher_code;

    INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, created_at, updated_at, is_read, is_deleted, transaction_id) 
    VALUES (
        in_UserIdBuyer, 
        'order', 
        CONCAT('Thu thập voucher ', p_voucher_name), 
        'Thu thập voucher miễn phí thành công.', 
        'https://i.pinimg.com/736x/d3/42/10/d34210a2c783df91cc86df3b7fc5ec64.jpg',
        NOW(), 
        NOW(), 
        0, 
        0, 
        p_transaction_id
    );

    UPDATE Post
    SET Quantity = Quantity - 1
    WHERE VoucherId = in_voucherId AND PostId = in_postId;

    COMMIT;

    SET out_message = 'Thu thập voucher thành công';
    SET out_id = p_transaction_id;
END $$

DELIMITER ;