DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_users;$$

CREATE PROCEDURE fn_search_users(
    IN search_term VARCHAR(100),
    IN is_verified BOOLEAN
)
BEGIN
    SELECT 
        UserId,
        Username,
        Fullname,
        Email,
        PhoneNumber,
        AvgRate,
        IsVerified
    FROM User
    WHERE 
        (Username LIKE CONCAT('%', search_term, '%') 
        OR Fullname LIKE CONCAT('%', search_term, '%') 
        OR Email LIKE CONCAT('%', search_term, '%'))
        AND (IsVerified = is_verified);
END$$

DELIMITER ;