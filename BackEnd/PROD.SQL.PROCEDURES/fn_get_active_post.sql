DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_active_post$$

CREATE PROCEDURE fn_get_active_post ()
BEGIN
    select *
    from Post
    where IsActive = True;
END$$

DELIMITER ;
