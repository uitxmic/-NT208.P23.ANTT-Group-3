DROP PROCEDURE IF EXISTS fn_create_user_for_google;
DELIMITER $$

CREATE PROCEDURE fn_create_user_for_google (
    IN p_username VARCHAR(30),
    IN p_fullname VARCHAR(30),
    IN p_password_hash VARCHAR(64),
    IN p_email VARCHAR(255)
)
proc_block: BEGIN
    DECLARE sql_error TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error = MESSAGE_TEXT;
        SELECT 'Created Failed' AS Message, sql_error AS ErrorDetail, -1 AS Id;
    END;

    IF p_email NOT LIKE '%@%.%' THEN
        SELECT 'Invalid email format' AS Message, 'Email must contain @ and a domain' AS ErrorDetail, -1 AS Id;
        LEAVE proc_block;
    END IF;

    IF EXISTS (SELECT 1 FROM `User` WHERE Email = p_email) THEN
        SELECT 'Email already exists' AS Message, 'Email' AS Field, -1 AS Id;
        LEAVE proc_block;
    END IF;

    INSERT INTO `User` (
        Username, Fullname, PasswordHash, Email, UserRoleId, AvgRate, BankAccount, AccountBalance, SoldAmount
    )
    VALUES (
        p_username, p_fullname, p_password_hash, p_email, 2, 0, NULL, 0, 0
    );

    SELECT 'User Created' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ;