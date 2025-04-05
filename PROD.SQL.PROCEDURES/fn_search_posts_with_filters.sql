DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_posts_with_filters;$$

CREATE PROCEDURE fn_search_posts_with_filters(
    IN search_term VARCHAR(100),
    IN is_verified BOOLEAN,
    IN min_interactions INT,
    IN min_days_posted INT,
    IN max_days_posted INT,
    IN sort_by VARCHAR(20)
)
BEGIN
    SELECT 
        p.*,
        u.Username,
        u.IsVerified
    FROM Post p
    JOIN User u ON p.UserId = u.UserId
    WHERE 
        (p.Postname LIKE CONCAT('%', search_term, '%') OR p.Content LIKE CONCAT('%', search_term, '%'))
        AND (u.IsVerified = is_verified OR is_verified IS NULL)
        AND (p.Interactions >= min_interactions OR min_interactions IS NULL)
        AND (DATEDIFF(CURDATE(), p.Date) BETWEEN min_days_posted AND max_days_posted OR min_days_posted IS NULL OR max_days_posted IS NULL)
        AND p.Expire >= CURDATE()
    ORDER BY 
        CASE 
            WHEN sort_by = 'interactions_desc' THEN -p.Interactions
            WHEN sort_by = 'date_desc' THEN -DATEDIFF(CURDATE(), p.Date)
            WHEN sort_by = 'date_asc' THEN DATEDIFF(CURDATE(), p.Date)
        END;
END$$

DELIMITER ;