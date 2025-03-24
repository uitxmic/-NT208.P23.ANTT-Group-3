DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_active_post;$$

CREATE PROCEDURE fn_get_active_post ()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    select *
    from post
    where IsActive = True;
END$$

DELIMITER ;
