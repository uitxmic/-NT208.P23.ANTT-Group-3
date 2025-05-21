DELIMITER $$

DROP PROCEDURE IF EXISTS fn_add_voucher; $$
CREATE PROCEDURE fn_add_voucher (
    IN p_VoucherName VARCHAR(255),
    IN p_UserId INT,
    IN p_Category VARCHAR(50),
    IN p_ExpirationDay DATE,
    IN p_VoucherCodes TEXT
)
BEGIN
    DECLARE v_VoucherId INT;
    DECLARE v_Code VARCHAR(255);
    DECLARE v_Done INT DEFAULT 0;
    DECLARE v_ErrorCode INT;
    DECLARE v_ErrorMessage VARCHAR(255);
    DECLARE v_Cursor CURSOR FOR
        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_VoucherCodes, ',', numbers.n), ',', -1)) AS code
        FROM (
            SELECT a.N + b.N * 10 + 1 AS n
            FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
                 (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
            ORDER BY n
        ) numbers
        WHERE numbers.n <= (LENGTH(p_VoucherCodes) - LENGTH(REPLACE(p_VoucherCodes, ',', '')) + 1);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_Done = 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Lấy thông tin lỗi
        GET DIAGNOSTICS CONDITION 1
            v_ErrorCode = MYSQL_ERRNO,
            v_ErrorMessage = MESSAGE_TEXT;

        -- Ghi log lỗi
        INSERT INTO ErrorLog (ErrorCode, ErrorMessage, ErrorTime, ProcedureName, InputParameters)
        VALUES (
            v_ErrorCode,
            v_ErrorMessage,
            NOW(),
            'fn_add_voucher',
            CONCAT('VoucherName: ', p_VoucherName, ', UserId: ', p_UserId, ', Category: ', p_Category, ', ExpirationDay: ', p_ExpirationDay, ', VoucherCodes: ', p_VoucherCodes)
        );

        ROLLBACK;
        SELECT 'Voucher creation failed' AS Message, -1 AS Id, v_ErrorCode AS ErrorCode, v_ErrorMessage AS ErrorMessage;
    END;

    START TRANSACTION;

    -- Sinh VoucherId bằng cách lấy MAX(VoucherId) + 1
    SELECT COALESCE(MAX(VoucherId), 0) + 1 INTO v_VoucherId FROM Voucher;

    -- Chèn từng VoucherCode với cùng VoucherId
    OPEN v_Cursor;
    read_loop: LOOP
        FETCH v_Cursor INTO v_Code;
        IF v_Done THEN
            LEAVE read_loop;
        END IF;
 
        INSERT INTO Voucher (VoucherId, VoucherCode, VoucherName, UserId, Category, ExpirationDay)
        VALUES (v_VoucherId, v_Code, p_VoucherName, p_UserId, p_Category, p_ExpirationDay);
    END LOOP;
    CLOSE v_Cursor;

    COMMIT;

    SELECT 'Voucher created successfully' AS Message, v_VoucherId AS Id, NULL AS ErrorCode, NULL AS ErrorMessage;
END $$

DELIMITER ;