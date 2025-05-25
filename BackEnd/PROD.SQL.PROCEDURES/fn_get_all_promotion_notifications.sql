DELIMITER $$
DROP PROCEDURE IF EXISTS fn_get_all_promotion_notifications; $$

CREATE PROCEDURE fn_get_all_promotion_notifications(IN p_user_id INT)
BEGIN
    SELECT * FROM Noti
    WHERE p_user_id = user_id and is_deleted = 0 and noti_type='promotion'
    ORDER BY created_at DESC;
END$$ //
DELIMITER ;

