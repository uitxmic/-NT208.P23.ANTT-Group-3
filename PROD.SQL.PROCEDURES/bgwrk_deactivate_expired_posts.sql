DELIMITER $$

CREATE PROCEDURE bgwrk_deactivate_expired_posts ()
BEGIN
	UPDATE Post
    SET IsActive = FALSE
    WHERE IsActive = TRUE
      AND Expire < CURRENT_DATE();
END$$

DELIMITER ;
