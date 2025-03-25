DELIMITER $$

CREATE PROCEDURE bgwrk_deactivate_expired_posts ()
BEGIN
	UPDATE Post
    SET IsActive = FALSE
    WHERE Expire < CURDATE();

    UPDATE Post
    SET IsActive = FALSE
    WHERE Expire >= CURDATE();
    
    UPDATE Post p1
    JOIN (
        SELECT MAX(PostId) AS PostId
        FROM Post
        WHERE Expire >= CURDATE()
        GROUP BY UserId, VoucherId
    ) p2 ON p1.PostId = p2.PostId
    SET p1.IsActive = TRUE;
END$$

DELIMITER ;
