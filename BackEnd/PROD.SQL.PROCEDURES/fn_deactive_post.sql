DELIMITER $$

DROP PROCEDURE IF EXISTS fn_deactive_post;$$

CREATE PROCEDURE fn_deactive_post (
	IN in_PostId INT
)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET IsActive = False
    WHERE PostId = in_PostId;
END$$

DELIMITER ;
