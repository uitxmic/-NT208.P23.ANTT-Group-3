CALL fn_create_user('john_doe', 'John Doe', 'hashed_password_123', 'john@example.com', '0987654321', 2, 0);

SELECT * FROM `User`;
DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_user; $$

CREATE PROCEDURE fn_create_user (
    IN User_name VARCHAR(30),
    IN Full_name VARCHAR(30),
    IN Hashed_password VARCHAR(64),
    IN E_mail VARCHAR(40),
    IN Phone_number VARCHAR(10),
    IN User_role INT,
    IN in_avg decimal(2,1)
)
proc_block: BEGIN
    DECLARE sql_error TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error = MESSAGE_TEXT;
        SELECT 'Created Failed' AS Message, sql_error AS ErrorDetail, -1 AS Id;
    END;


    IF EXISTS (SELECT 1 FROM `User` WHERE Username = User_name) THEN
        SELECT 'Username already exists' AS Message, -1 AS Id;
        LEAVE proc_block;
    END IF;

    IF EXISTS (SELECT 1 FROM `User` WHERE PhoneNumber = Phone_number) THEN
        SELECT 'Phone number already exists' AS Message, -1 AS Id;
        LEAVE proc_block;
    END IF;
    
    IF EXISTS (SELECT 1 FROM `User` WHERE Email = E_mail) THEN
        SELECT 'Email already exists' AS Message, -1 AS Id;
        LEAVE proc_block;
    END IF;

    INSERT INTO `User` (Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, AvgRate)
    VALUES (User_name, Full_name, Hashed_password, E_mail, Phone_number, User_role, in_avg);

    SELECT 'User Created' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ;
