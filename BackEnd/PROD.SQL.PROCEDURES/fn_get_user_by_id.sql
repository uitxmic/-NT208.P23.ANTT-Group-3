CALL fn_get_user_by_id('13');
DELIMITER $$
DROP PROCEDURE IF EXISTS fn_get_user_by_id; $$

CREATE PROCEDURE `fn_get_user_by_id`(IN uid INT)
BEGIN
    SELECT * FROM `User` WHERE UserId = uid;
END $$

DELIMITER ;
