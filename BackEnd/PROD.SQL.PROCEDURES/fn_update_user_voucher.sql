DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_user_voucher;$$

CREATE PROCEDURE fn_update_user_voucher (
    IN in_userid INT,
    IN in_vouchercode VARCHAR(100)
)

BEGIN
    DECLARE affected_rows INT DEFAULT 0;
    DECLARE voucher_name VARCHAR(255);
    DECLARE default_img text;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 
            @sql_error_code = MYSQL_ERRNO, 
            @sql_error_message = MESSAGE_TEXT;
        ROLLBACK;
        SELECT 'Created Failed' AS Message, -1 AS LastTransactionId, @sql_error_code AS ErrorCode, @sql_error_message AS ErrorMessage;
    END;

    SELECT VoucherName, DefaultImg INTO voucher_name, default_img
    FROM Voucher
    WHERE UserId = in_userid AND VoucherCode = in_vouchercode AND isUsed = 0 AND ExpirationDay >= CURDATE();

    UPDATE `Voucher` 
    SET isUsed = 1
    WHERE UserId = in_userid AND VoucherCode = in_vouchercode AND isUsed = 0 AND ExpirationDay >= CURDATE();

    SET affected_rows = ROW_COUNT();

    IF affected_rows > 0 THEN
        INSERT INTO Noti (user_id, noti_type, noti_title, noti_content, image_url, created_at, updated_at, is_read, is_deleted) 
        VALUES (
            in_userid, 
            'order', 
            CONCAT('Sử dụng voucher ', voucher_name), 
            CONCAT('Mã voucher đã dùng ', in_vouchercode), 
            default_img,
            NOW(), 
            NOW(), 
            0, 
            0
        );
        SELECT 'Update Successful' AS Message;
    ELSE
        SELECT 'No Voucher Found' AS Message; 
    END IF;
END$$

DELIMITER ;

call fn_update_user_voucher(29, 'ELECTRONICS4C');