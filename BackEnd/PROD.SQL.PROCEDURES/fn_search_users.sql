DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_users;$$

CREATE PROCEDURE fn_search_users(
    IN search_term VARCHAR(100),
    IN user_role_id INT
)
BEGIN
    SELECT 
        UserId,
        Username,
        Fullname,
        Email,
        PhoneNumber,
        AvgRate,
        UserRoleId,
        SoldAmount
    FROM User
    WHERE 
        (Username LIKE CONCAT('%', search_term, '%') 
        OR Fullname LIKE CONCAT('%', search_term, '%') 
        OR Email LIKE CONCAT('%', search_term, '%'))
        AND (UserRoleId = user_role_id or user_role_id IS NULL);
END$$

DELIMITER ;