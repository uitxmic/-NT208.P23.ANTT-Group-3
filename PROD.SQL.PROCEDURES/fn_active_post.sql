DELIMITER $$

DROP PROCEDURE IF EXISTS fn_active_post;$$

CREATE PROCEDURE fn_active_post (
	IN in_PostId INT
)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET IsActive = True
    WHERE PostId = in_PostId;
END$$

DELIMITER ;
