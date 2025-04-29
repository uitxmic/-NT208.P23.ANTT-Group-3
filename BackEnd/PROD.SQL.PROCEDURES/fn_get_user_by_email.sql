DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_user_by_email;$$
CREATE PROCEDURE fn_get_user_by_email(IN p_email VARCHAR(255))
BEGIN
	SELECT * FROM `User` WHERE Email = p_email;
END $$

DELIMITER ;

CALL fn_get_user_by_email('s78776033@gmail.com');
