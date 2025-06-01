DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_users_with_filters;$$

CREATE PROCEDURE `fn_search_users_with_filters`(
    IN search_term VARCHAR(100),
    IN min_feedback DECIMAL(2, 1),
    IN sort_by VARCHAR(20)
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
        OR Email LIKE CONCAT('%', search_term, '%'))
        AND (AvgRate >= min_feedback OR min_feedback IS NULL)
        AND (SoldAmount >= min_sold OR min_sold IS NULL)
    ORDER BY 
        CASE 
            WHEN sort_by = 'feedback_desc' THEN -AvgRate
            WHEN sort_by = 'feedback_asc' THEN AvgRate
            ELSE UserId
        END;
END$$

DELIMITER ;