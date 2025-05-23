DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_transaction_history_by_id;$$
CREATE PROCEDURE fn_get_transaction_history_by_id(
    IN v_user_id INT,
    IN v_search_text VARCHAR(255),
    IN v_sort_column VARCHAR(50),
    IN v_sort_order VARCHAR(10)
)
proc: BEGIN
    -- Initialize default values for parameters
    SET v_search_text = IFNULL(v_search_text, '');
    SET v_sort_column = IFNULL(v_sort_column, 'CreateAt');
    SET v_sort_order = IFNULL(v_sort_order, 'DESC');

    -- Validate sort column to prevent SQL injection
    SET v_sort_column = CASE 
        WHEN v_sort_column IN ('TransactionId', 'TransactionAmount', 'CreateAt', 'Status') THEN v_sort_column
        ELSE 'CreateAt'
    END;

    -- Validate sort order
    SET v_sort_order = IF(v_sort_order IN ('ASC', 'DESC'), v_sort_order, 'DESC');

    -- Dynamic SQL for flexible query
    SET @sql = CONCAT('
        SELECT 
            T.TransactionId,
            T.TransactionAmount,
            S.Fullname AS Seller,
            T.CreateAt,
            Status,
            V.VoucherName,
            T.VoucherCode
        FROM Transaction T
        JOIN `User` S ON S.UserId = T.UserIdseller
        JOIN Voucher V ON V.VoucherId = T.VoucherId AND V.VoucherCode = T.VoucherCode
        WHERE T.UserIdbuyer = ?
        AND (
            T.TransactionId LIKE CONCAT(''%'', ?, ''%'')
            OR S.Fullname LIKE CONCAT(''%'', ?, ''%'')
            OR V.VoucherName LIKE CONCAT(''%'', ?, ''%'')
            OR T.VoucherCode LIKE CONCAT(''%'', ?, ''%'')
        )
        ORDER BY ', v_sort_column, ' ', v_sort_order
    );

    -- Prepare and execute the dynamic query
    PREPARE stmt FROM @sql;
    SET @user_id = v_user_id;
    SET @search_text = v_search_text;
    EXECUTE stmt USING @user_id, @search_text, @search_text, @search_text, @search_text;
    DEALLOCATE PREPARE stmt;
END proc $$

DELIMITER ;

CALL fn_get_transaction_history_by_id(38, '', 'CreateAt', 'DESC');
