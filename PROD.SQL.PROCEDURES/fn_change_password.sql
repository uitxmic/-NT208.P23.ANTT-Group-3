SELECT * FROM `User`;
CALL fn_change_password('user2','hash_pw2','chien');
DELIMITER $$

DROP PROCEDURE IF EXISTS fn_change_password; $$

CREATE PROCEDURE fn_change_password (
    IN User_name VARCHAR(30),
    IN Oldpassword VARCHAR(64),
    IN Newpassword VARCHAR(64)
)
BEGIN
    DECLARE sql_error TEXT;
    DECLARE Id int;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error = MESSAGE_TEXT;
        SELECT 'Login Failed' AS Message, sql_error AS ErrorDetail, -1 AS Id;
    END;
	
	SELECT UserId into Id from `User`
    where Username=User_name and PasswordHash=Oldpassword
    limit 1;

	IF Id is not null then
		begin
			UPDATE `User`
			SET PasswordHash = Newpassword
			WHERE UserId=Id;
            SELECT 'Change Password Successfully' AS Message;
		end;
        
	ELSE
		SELECT 'OldPassword is incorrect!' AS Message;
	END IF;
END$$

DELIMITER ;

