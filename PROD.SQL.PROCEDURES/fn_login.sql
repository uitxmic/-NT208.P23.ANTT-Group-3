CALL fn_login('chien', 'af4663c41acb498f8170533283749444610b8225baeff5e9ab55039f4ca63ad9');
delete from `User` where Username='chien';
SELECT * FROM `User`;
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

	IF Id is not null then
		SELECT 'Login Successful' AS Message, Id AS UserId, Mail as Email ;
	ELSE
		SELECT 'Login Failed' AS Message, NULL AS UserId, NULL AS Email;
	END IF;
END$$

DELIMITER ;

