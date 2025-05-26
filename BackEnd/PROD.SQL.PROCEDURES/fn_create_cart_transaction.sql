DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_cart_transaction;
$$
CREATE PROCEDURE fn_create_cart_transaction (
    IN in_cart_data JSON,
    IN in_UserIdBuyer INT
)
BEGIN
    DECLARE v_done INT DEFAULT 0;
    DECLARE v_voucher_id INT;
    DECLARE v_post_id INT;
    DECLARE v_amount INT;
    DECLARE v_quantity INT;
    DECLARE v_user_id_seller INT;
    DECLARE v_total_amount INT DEFAULT 0;
    DECLARE v_balance INT;
    DECLARE v_transaction_id INT;
    DECLARE v_final_message VARCHAR(255) DEFAULT 'Cart Transaction Created';
    DECLARE v_final_id INT DEFAULT -1;
    DECLARE v_message VARCHAR(255);
    DECLARE v_error_code INT;
    DECLARE v_error_message VARCHAR(255);

    -- Cursor duyệt từng mục trong giỏ hàng
    DECLARE cart_cursor CURSOR FOR
        SELECT 
            CAST(JSON_EXTRACT(cart_item, '$.VoucherId') AS UNSIGNED) AS VoucherId,
            CAST(JSON_EXTRACT(cart_item, '$.PostId') AS UNSIGNED) AS PostId,
            CAST(JSON_EXTRACT(cart_item, '$.Amount') AS UNSIGNED) AS Amount,
            CAST(JSON_EXTRACT(cart_item, '$.Quantity') AS UNSIGNED) AS Quantity,
            CAST(JSON_EXTRACT(cart_item, '$.UserIdSeller') AS UNSIGNED) AS UserIdSeller
        FROM JSON_TABLE(
            in_cart_data,
            '$[*]' COLUMNS (
                cart_item JSON PATH '$'
            )
        ) AS cart_items;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 
            @sql_error_code = MYSQL_ERRNO, 
            @sql_error_message = MESSAGE_TEXT;
        INSERT INTO debug_log (log_message, log_time, procedure_name, sql_error_code, sql_error_message)
        VALUES ('SQLEXCEPTION occurred', NOW(), 'fn_create_cart_transaction', @sql_error_code, @sql_error_message);
        ROLLBACK;
        SELECT 'Created Failed' AS Message, -1 AS LastTransactionId, @sql_error_code AS ErrorCode, @sql_error_message AS ErrorMessage;
    END;

    -- Kiểm tra JSON đầu vào
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Input JSON: ', in_cart_data), NOW(), 'fn_create_cart_transaction');

    IF JSON_VALID(in_cart_data) = 0 THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Invalid JSON input', NOW(), 'fn_create_cart_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'JSON đầu vào không hợp lệ';
    END IF;

    -- Kiểm tra JSON path trước khi sử dụng
    BEGIN
        DECLARE v_test_amount INT;
        DECLARE v_test_quantity INT;
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Testing JSON path', NOW(), 'fn_create_cart_transaction');
        SELECT 
            CAST(JSON_EXTRACT(cart_item, '$.Amount') AS UNSIGNED),
            CAST(JSON_EXTRACT(cart_item, '$.Quantity') AS UNSIGNED)
        INTO v_test_amount, v_test_quantity
        FROM JSON_TABLE(
            in_cart_data,
            '$[0]' COLUMNS (
                cart_item JSON PATH '$'
            )
        ) AS cart_items
        LIMIT 1;
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES (CONCAT('JSON path test: Amount=', COALESCE(v_test_amount, 'NULL'), ', Quantity=', COALESCE(v_test_quantity, 'NULL')), NOW(), 'fn_create_cart_transaction');
    END;

    -- Tính tổng tiền cần thanh toán
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES ('Calculating total amount', NOW(), 'fn_create_cart_transaction');

    SELECT COALESCE(SUM(
        CAST(JSON_EXTRACT(cart_item, '$.Amount') AS UNSIGNED) * 
        CAST(JSON_EXTRACT(cart_item, '$.Quantity') AS UNSIGNED)
    ), 0)
    INTO v_total_amount
    FROM JSON_TABLE(
        in_cart_data,
        '$[*]' COLUMNS (
            cart_item JSON PATH '$'
        )
    ) AS cart_items;

    -- Log tổng tiền
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Total Amount: ', v_total_amount), NOW(), 'fn_create_cart_transaction');

    -- Kiểm tra số dư
    SELECT AccountBalance INTO v_balance 
    FROM `User` 
    WHERE UserId = in_UserIdBuyer 
    LIMIT 1 FOR UPDATE;

    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Buyer Balance: ', COALESCE(v_balance, 'NULL')), NOW(), 'fn_create_cart_transaction');

    IF v_balance IS NULL THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Người mua không tồn tại', NOW(), 'fn_create_cart_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Người mua không tồn tại';
    END IF;

    IF v_balance < v_total_amount THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Số dư không đủ', NOW(), 'fn_create_cart_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số dư không đủ';
    END IF;

    START TRANSACTION;

    OPEN cart_cursor;

    read_cart_loop: LOOP
        FETCH cart_cursor INTO v_voucher_id, v_post_id, v_amount, v_quantity, v_user_id_seller;
        IF v_done THEN
            INSERT INTO debug_log (log_message, log_time, procedure_name)
            VALUES ('Cursor done, no data fetched', NOW(), 'fn_create_cart_transaction');
            LEAVE read_cart_loop;
        END IF;

        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES (CONCAT('Processing item: VoucherId=', v_voucher_id, ', PostId=', v_post_id, ', Amount=', v_amount, ', Quantity=', v_quantity, ', UserIdSeller=', v_user_id_seller), NOW(), 'fn_create_cart_transaction');

        -- Gọi thủ tục tạo giao dịch con với 6 tham số và 2 tham số đầu ra
        CALL fn_create_transaction(
            v_voucher_id,
            v_post_id,
            v_amount,
            v_quantity,
            in_UserIdBuyer,
            v_user_id_seller,
            @out_message,
            @out_id
        );

        -- Lấy kết quả từ tham số đầu ra
        SET v_message = @out_message;
        SET v_transaction_id = @out_id;

        -- Lấy mã lỗi và thông báo lỗi nếu có (nếu cần)
        SET v_error_code = @sql_error_code;
        SET v_error_message = @sql_error_message;

        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES (CONCAT('fn_create_transaction result: Message=', COALESCE(v_message, 'NULL'), ', Id=', COALESCE(v_transaction_id, 'NULL'), ', ErrorCode=', COALESCE(v_error_code, 'NULL'), ', ErrorMessage=', COALESCE(v_error_message, 'NULL')), NOW(), 'fn_create_cart_transaction');

        IF v_message != 'Transaction Created' THEN
            SET v_final_message = COALESCE(v_message, 'Unknown error from fn_create_transaction');
            SET v_final_id = COALESCE(v_transaction_id, -1);
            INSERT INTO debug_log (log_message, log_time, procedure_name)
            VALUES (CONCAT('Transaction failed: ', v_final_message, ', ErrorCode=', COALESCE(v_error_code, 'NULL'), ', ErrorMessage=', COALESCE(v_error_message, 'NULL')), NOW(), 'fn_create_cart_transaction');
            ROLLBACK;
            SELECT v_final_message AS Message, v_final_id AS LastTransactionId, v_error_code AS ErrorCode, v_error_message AS ErrorMessage;
            LEAVE read_cart_loop;
        ELSE
            SET v_final_id = v_transaction_id;
        END IF;
    END LOOP;

    CLOSE cart_cursor;

    -- Kiểm tra nếu không có giao dịch nào được tạo
    IF v_final_id = -1 THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Không tạo được giao dịch nào', NOW(), 'fn_create_cart_transaction');
        ROLLBACK;
        SET v_final_message = 'Không tạo được giao dịch nào';
        SELECT v_final_message AS Message, v_final_id AS LastTransactionId;
    ELSE
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Committing transaction', NOW(), 'fn_create_cart_transaction');
        COMMIT;
        SELECT v_final_message AS Message, v_final_id AS LastTransactionId;
    END IF;
END $$

DELIMITER ;