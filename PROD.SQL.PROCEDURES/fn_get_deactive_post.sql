DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_deactive_post$$

CREATE PROCEDURE fn_get_deactive_post ()
BEGIN
    select *
    from Post
    where IsActive = False;
END$$

DELIMITER ;
