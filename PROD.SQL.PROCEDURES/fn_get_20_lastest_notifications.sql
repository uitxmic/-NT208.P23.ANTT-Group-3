DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_20_lastest_notifications$$

CREATE PROCEDURE fn_get_20_lastest_notifications ()

BEGIN
    select *
    from Notification
    ORDER BY CreateAt DESC
    LIMIT 20;
END$$

DELIMITER ;