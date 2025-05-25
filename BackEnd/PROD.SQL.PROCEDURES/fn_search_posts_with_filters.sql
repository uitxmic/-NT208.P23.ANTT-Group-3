DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_posts_with_filters;$$

CREATE PROCEDURE fn_search_posts_with_filters(
    IN search_term VARCHAR(100),
    IN min_days_posted INT ,
    IN max_days_posted INT,
    IN sort_by VARCHAR(20),
    IN start_date date,
    IN end_date date
)
BEGIN
    SELECT 
        p.*,
        u.Username
    FROM Post p
    JOIN User u ON p.UserId = u.UserId
    WHERE 
        (p.Postname LIKE CONCAT('%', search_term, '%') OR p.Content LIKE CONCAT('%', search_term, '%'))
        -- AND (p.Interactions >= min_interactions OR min_interactions IS NULL)
        AND (DATEDIFF(CURDATE(), p.Date) BETWEEN min_days_posted AND max_days_posted OR min_days_posted IS NULL OR max_days_posted IS NULL)
        AND (start_date is null or start_date <= p.Date)
        AND (end_date is null or end_date >= p.Date) 
        AND p.Expire >= CURDATE()
    ORDER BY 
        CASE 
            WHEN sort_by = 'date_desc' THEN -DATEDIFF(CURDATE(), p.Date)
            WHEN sort_by = 'date_asc' THEN DATEDIFF(CURDATE(), p.Date)
        END;
END$$

DELIMITER ;