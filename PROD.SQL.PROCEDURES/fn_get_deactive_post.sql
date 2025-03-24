DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_deactive_post;$$

CREATE PROCEDURE fn_get_deactive_post ()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    select *
    from post
    where IsActive = False;
END$$

DELIMITER ;
