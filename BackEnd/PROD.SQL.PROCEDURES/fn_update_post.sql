DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_post;$$

CREATE PROCEDURE fn_create_post (
	IN in_PostId INT,
    IN in_VoucherId INT,
    IN in_Postname VARCHAR(255),
    IN in_Content TEXT
)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Updating Failed' AS Message, -1 AS Id;
    END;
    
    INSERT INTO Post (PostId, VoucherId, PostName, Content)
    VALUES (
        in_PostId,
        in_VoucherId,
        in_Postname,
        in_Content
    );
END$$

DELIMITER ;

