DROP PROCEDURE IF EXISTS fn_create_user;
DELIMITER $$

CREATE PROCEDURE fn_create_user (
    IN p_username VARCHAR(30),
    IN p_fullname VARCHAR(30),
    IN p_password_hash VARCHAR(64),
    IN p_email VARCHAR(255),
    IN p_phone_number VARCHAR(10)
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

    IF p_phone_number NOT REGEXP '^[0-9]{10}$' THEN
        SELECT 'Invalid phone number' AS Message, 'Phone number must be exactly 10 digits' AS ErrorDetail, -1 AS Id;
        LEAVE proc_block;
    END IF;

    IF EXISTS (SELECT 1 FROM `User` WHERE Username = p_username) THEN
        SELECT 'Username already exists' AS Message, 'Username' AS Field, -1 AS Id;
        LEAVE proc_block;
    END IF;

    IF EXISTS (SELECT 1 FROM `User` WHERE PhoneNumber = p_phone_number) THEN
        SELECT 'Phone number already exists' AS Message, 'PhoneNumber' AS Field, -1 AS Id;
        LEAVE proc_block;
    END IF;
    
    IF EXISTS (SELECT 1 FROM `User` WHERE Email = p_email) THEN
        SELECT 'Email already exists' AS Message, 'Email' AS Field, -1 AS Id;
        LEAVE proc_block;
    END IF;

    INSERT INTO `User` (
        Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, AvgRate, BankAccount, AccountBalance, SoldAmount
    )
    VALUES (
        p_username, p_fullname, p_password_hash, p_email, p_phone_number, 2, 0, NULL, 0, 0
    );

    SELECT 'User Created' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ;