DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_notification_by_id$$

CREATE PROCEDURE fn_get_notification_by_id (
	IN in_NotiId INT
)

BEGIN
    select * 
    from Notification
    where NotiId = in_NotiId;
END$$

DELIMITER ;