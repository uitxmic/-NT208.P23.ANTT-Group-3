DELIMITER $$

DROP PROCEDURE IF EXISTS fn_deactivate_news;$$

CREATE PROCEDURE fn_deactivate_news(IN in_post_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Deactivation Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET IsActive = FALSE
    WHERE PostId = in_post_id;
    
    SELECT 'News Deactivated Successfully' AS Message, in_post_id AS Id;
END$$

DELIMITER ; 