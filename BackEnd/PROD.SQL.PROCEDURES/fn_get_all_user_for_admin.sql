DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_user_for_admin;$$
CREATE PROCEDURE fn_get_all_user_for_admin(
	IN sortBy VARCHAR(50),
    IN sortOrder VARCHAR(4),
    IN searchTerm VARCHAR(100)
)
BEGIN

    SET @sql = 'SELECT * FROM `User` WHERE UserRoleId = 2';
    
    IF searchTerm IS NOT NULL AND searchTerm != '' THEN
        SET @sql = CONCAT(@sql, ' AND (Fullname LIKE ? OR Username LIKE ? OR Email LIKE ?)');
    END IF;
    

    SET @sql = CONCAT(@sql, ' ORDER BY ', sortBy, ' ', sortOrder);
    
    -- Chuẩn bị và thực thi câu truy vấn
    PREPARE stmt FROM @sql;
    IF searchTerm IS NOT NULL AND searchTerm != '' THEN
        SET @searchPattern = CONCAT('%', searchTerm, '%');
        EXECUTE stmt USING @searchPattern, @searchPattern, @searchPattern;
    ELSE
        EXECUTE stmt;
    END IF;
    
    DEALLOCATE PREPARE stmt;
END $$

DELIMITER ;

CALL fn_get_all_user_for_admin('UserId', 'DESC', 'Khôi');