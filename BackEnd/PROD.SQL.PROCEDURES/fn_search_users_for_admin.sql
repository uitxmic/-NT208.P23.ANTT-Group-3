DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_users_for_admin;$$

CREATE PROCEDURE fn_search_users_for_admin(
    IN search_term VARCHAR(100)
)
BEGIN
    SELECT 
        UserId,
        Username,
        Fullname,
        Email,
        PhoneNumber,
        AvgRate,
        SoldAmount
    FROM User 
    WHERE 
        (Username LIKE CONCAT('%', search_term, '%') 
        OR Fullname LIKE CONCAT('%', search_term, '%') 
        OR Email LIKE CONCAT('%', search_term, '%'));
END$$

DELIMITER ;

CALL fn_search_users_for_admin('Khôi');