DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_user_for_admin;$$
CREATE PROCEDURE fn_get_all_user_for_admin(
	IN sortBy VARCHAR(50),
    IN sortOrder VARCHAR(4)
)
BEGIN
    SET @sql = CONCAT('SELECT * FROM `User` WHERE UserRoleId = 2 ORDER BY ', 
                     sortBy, ' ', sortOrder);
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END $$

DELIMITER ;

CALL fn_get_all_user_for_admin('UserId DESC, AccountBalance ASC', '');