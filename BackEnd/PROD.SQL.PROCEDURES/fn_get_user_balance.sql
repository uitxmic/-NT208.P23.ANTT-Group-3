DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_user_balance;$$
CREATE PROCEDURE fn_get_user_balance(IN p_UserId INT)
BEGIN
    SELECT AccountBalance
    FROM User
    WHERE UserId = p_UserId;
END $$

DELIMITER ;

call fn_get_user_balance(18);