DELIMITER $$

DROP PROCEDURE IF EXISTS fn_login; $$

CREATE PROCEDURE fn_login (
    IN User_name VARCHAR(30),
    IN Hashed_password VARCHAR(64)
)
BEGIN
    DECLARE sql_error TEXT;
    DECLARE Id int;
    DECLARE Mail varchar(40);
    DECLARE p_user_role_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error = MESSAGE_TEXT;
        SELECT 'Login Failed' AS Message, sql_error AS ErrorDetail, -1 AS Id;
    END;
	
	SELECT UserId into Id FROM `User` 
    WHERE Username = User_name and PasswordHash=Hashed_password
    Limit 1;
    
    SELECT Email into Mail FROM `User` 
    WHERE Username = User_name and PasswordHash=Hashed_password
    Limit 1;
    
    SELECT UserRoleId INTO p_user_role_id FROM `User` 
	WHERE Username = User_name and PasswordHash=Hashed_password
    Limit 1;

	IF Id is not null then
		SELECT 'Login Successful' AS Message, Id AS UserId, Mail as Email, p_user_role_id AS UserRoleId;
	ELSE
		SELECT 'Login Failed' AS Message, NULL AS UserId, NULL AS Email, NULL AS UserRoleId;
	END IF;
END$$

DELIMITER ;

CALL fn_login('alo', 'b6b4377acb039899003d81ca5979c3c7daf566815916859c567390e143314183');