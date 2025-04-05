DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_users_with_filters;$$

CREATE PROCEDURE `fn_search_users_with_filters`(
    IN search_term VARCHAR(100),
    IN min_feedback DECIMAL(2, 1),
    IN min_sold INT,
    IN sort_by VARCHAR(20)
)
BEGIN
    SELECT 
        u.UserId,
        u.Username,
        u.Fullname,
        u.Email,
        u.PhoneNumber,
        u.AvgRate,
        u.IsVerified,
        u.SoldAmount
    FROM User u
    LEFT JOIN Feedback f ON u.UserId = f.UserId
    WHERE 
        (u.Username LIKE CONCAT('%', search_term, '%') 
        OR u.Fullname LIKE CONCAT('%', search_term, '%') 
        OR u.Email LIKE CONCAT('%', search_term, '%'))
        AND (u.AvgRate >= min_feedback OR min_feedback IS NULL)
        AND (u.SoldAmount >= min_sold OR min_sold IS NULL)
    ORDER BY 
        CASE 
            WHEN sort_by = 'feedback_desc' THEN u.AvgRate
            WHEN sort_by = 'feedback_asc' THEN -u.AvgRate
            WHEN sort_by = 'sold_desc' THEN u.SoldAmount
            WHEN sort_by = 'sold_asc' THEN -u.SoldAmount
            ELSE u.UserId -- Mặc định sắp xếp theo UserId nếu sort_by không hợp lệ
        END;
END$$

DELIMITER ;