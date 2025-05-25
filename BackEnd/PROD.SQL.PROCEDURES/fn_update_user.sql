
DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_user; $$
CREATE PROCEDURE fn_update_user(
    IN p_userId INT,
    IN p_Fullname VARCHAR(255),
    IN p_Email VARCHAR(255),
    IN p_PhoneNumber VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while updating the user';
    END;

    -- Update user information in the users table
    UPDATE `User`
    SET 
        Fullname = COALESCE(p_Fullname, Fullname),
        Email = COALESCE(p_Email, Email),
        PhoneNumber = COALESCE(p_PhoneNumber, PhoneNumber)
    WHERE UserId = p_userId;

    -- Check if any row was affected
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User not found';
    END IF;

    -- Return updated user information
    SELECT 
        UserId,
        Fullname,
        Email,
        PhoneNumber
    FROM `User`
    WHERE UserId = p_userId;
END $$

DELIMITER ;

CALL fn_update_user(26, 'Nguyễn Trần Minh Khôi', '', '0123765123');