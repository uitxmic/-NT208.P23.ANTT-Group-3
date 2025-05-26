DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_momo_cart_transaction;
$$
CREATE PROCEDURE fn_create_momo_cart_transaction (
    IN in_cart_data JSON,
    IN in_UserIdBuyer INT
)
BEGIN
    DECLARE v_done INT DEFAULT 0;
    DECLARE v_voucher_id INT;
    DECLARE v_post_id INT;
    DECLARE v_quantity INT;
    DECLARE v_user_id_seller INT;
    DECLARE v_total_amount INT DEFAULT 0;
    DECLARE v_momo_balance INT;
    DECLARE v_transaction_id INT;
    DECLARE v_final_message VARCHAR(255) DEFAULT 'Momo Cart Transaction Created';
    DECLARE v_final_id INT DEFAULT -1;
    DECLARE v_error_code INT;
    DECLARE v_error_message VARCHAR(255);

    -- Cursor duyệt từng mục trong giỏ hàng
    DECLARE cart_cursor CURSOR FOR
        SELECT 
            CAST(JSON_EXTRACT(cart_item, '$.VoucherId') AS UNSIGNED) AS VoucherId,
            CAST(JSON_EXTRACT(cart_item, '$.PostId') AS UNSIGNED) AS PostId,
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
        VALUES ('SQLEXCEPTION occurred', NOW(), 'fn_create_momo_cart_transaction', @sql_error_code, @sql_error_message);
        ROLLBACK;
        SELECT 'Created Failed' AS Message, -1 AS LastTransactionId, @sql_error_code AS ErrorCode, @sql_error_message AS ErrorMessage;
    END;

    -- Kiểm tra JSON đầu vào
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Input JSON: ', in_cart_data), NOW(), 'fn_create_momo_cart_transaction');

    IF JSON_VALID(in_cart_data) = 0 THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Invalid JSON input', NOW(), 'fn_create_momo_cart_transaction');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'JSON đầu vào không hợp lệ';
    END IF;

    -- Kiểm tra JSON path trước khi sử dụng
    BEGIN
        DECLARE v_test_quantity INT;
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Testing JSON path', NOW(), 'fn_create_momo_cart_transaction');
        SELECT 
            CAST(JSON_EXTRACT(cart_item, '$.Quantity') AS UNSIGNED)
        INTO v_test_quantity
        FROM JSON_TABLE(
            in_cart_data,
            '$[0]' COLUMNS (
                cart_item JSON PATH '$'
            )
        ) AS cart_items
        LIMIT 1;
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES (CONCAT('JSON path test: Quantity=', COALESCE(v_test_quantity, 'NULL')), NOW(), 'fn_create_momo_cart_transaction');
    END;

    -- Tính tổng tiền cần thanh toán
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES ('Calculating total amount', NOW(), 'fn_create_momo_cart_transaction');

    SELECT COALESCE(SUM(
        P.Price * 
        CAST(JSON_EXTRACT(cart_item, '$.Quantity') AS UNSIGNED)
    ), 0)
    INTO v_total_amount
    FROM JSON_TABLE(
        in_cart_data,
        '$[*]' COLUMNS (
            cart_item JSON PATH '$',
            VoucherId INT PATH '$.VoucherId',
            PostId INT PATH '$.PostId'
        )
    ) AS cart_items
    JOIN Post P ON P.VoucherId = cart_items.VoucherId AND P.PostId = cart_items.PostId;

    -- Log tổng tiền
    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Total Amount: ', v_total_amount), NOW(), 'fn_create_momo_cart_transaction');


    START TRANSACTION;

    OPEN cart_cursor;

    read_cart_loop: LOOP
        FETCH cart_cursor INTO v_voucher_id, v_post_id, v_quantity, v_user_id_seller;
        IF v_done THEN
            INSERT INTO debug_log (log_message, log_time, procedure_name)
            VALUES ('Cursor done, no data fetched', NOW(), 'fn_create_momo_cart_transaction');
            LEAVE read_cart_loop;
        END IF;

        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES (CONCAT('Processing item: VoucherId=', v_voucher_id, ', PostId=', v_post_id, ', Quantity=', v_quantity, ', UserIdSeller=', v_user_id_seller), NOW(), 'fn_create_momo_cart_transaction');

        -- Gọi fn_update_voucher_id_after_buying cho từng voucher
        WHILE v_quantity > 0 DO
            CALL fn_update_voucher_id_after_buying(
                in_UserIdBuyer,
                v_user_id_seller,
                v_voucher_id,
                v_post_id
            );
            SET v_quantity = v_quantity - 1;
            SET v_transaction_id = LAST_INSERT_ID();
        END WHILE;

        SET v_final_id = v_transaction_id;
    END LOOP;

    CLOSE cart_cursor;

    INSERT INTO debug_log (log_message, log_time, procedure_name)
    VALUES (CONCAT('Updated Buyer Momo Balance: ', v_momo_balance - v_total_amount), NOW(), 'fn_create_momo_cart_transaction');

    -- Kiểm tra nếu không có giao dịch nào được tạo
    IF v_final_id = -1 THEN
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Không tạo được giao dịch nào', NOW(), 'fn_create_momo_cart_transaction');
        ROLLBACK;
        SET v_final_message = 'Không tạo được giao dịch nào';
        SELECT v_final_message AS Message, v_final_id AS LastTransactionId;
    ELSE
        INSERT INTO debug_log (log_message, log_time, procedure_name)
        VALUES ('Committing transaction', NOW(), 'fn_create_momo_cart_transaction');
        COMMIT;
        SELECT v_final_message AS Message, v_final_id AS LastTransactionId;
    END IF;
END $$

DELIMITER ;