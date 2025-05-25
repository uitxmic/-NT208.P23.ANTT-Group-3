DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_5_latest_notifications $$
CREATE PROCEDURE fn_get_5_latest_notifications(IN p_user_id INT)
BEGIN
    SELECT * 
    FROM Noti
    WHERE is_deleted = 0
      AND user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 5;
END $$

DELIMITER ;
