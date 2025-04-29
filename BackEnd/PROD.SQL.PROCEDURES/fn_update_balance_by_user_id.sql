DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_balance_by_user_id;$$

CREATE PROCEDURE fn_update_balance_by_user_id (
    IN p_user_id INT,
    IN p_amount DECIMAL(10, 2),
    OUT p_status VARCHAR(50)
)

BEGIN
    DECLARE user_count INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Update Failed' AS Message, -1 AS Id;
        SET p_status = 'Update Failed';
    END;
    SELECT COUNT(*) INTO user_count
    FROM `User`	
    WHERE UserId = p_user_id;

    IF user_count = 0 THEN
        SET p_status = 'User not found';
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User not found';
    ELSE
        -- Cập nhật Balance
        UPDATE `User`
        SET AccountBalance = AccountBalance + p_amount
        WHERE UserId = p_user_id;

        SET p_status = 'Success';
    END IF;
END$$

DELIMITER ;

CALL fn_update_balance_by_user_id(22,100, @status);
SELECT @status
