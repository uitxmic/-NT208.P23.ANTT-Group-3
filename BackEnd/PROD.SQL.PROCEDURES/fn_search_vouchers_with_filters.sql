DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_vouchers_with_filters;$$

CREATE PROCEDURE fn_search_vouchers_with_filters(
    IN search_term VARCHAR(100),
    IN category_filter VARCHAR(100),
    IN min_price DECIMAL(10, 2),
    IN max_price DECIMAL(10, 2),
    IN sort_by VARCHAR(20),
    IN is_verified BOOLEAN,
    IN min_feedback DECIMAL(2, 1),
    IN min_sold INT,
    IN expire_in_days INT
)
BEGIN
    SELECT 
        v.*,
        u.Username,
        u.AvgRate,
        u.IsVerified
    FROM Voucher v
    JOIN User u ON v.UserId = u.UserId
    WHERE 
        (v.VoucherName LIKE CONCAT('%', search_term, '%') OR v.Label LIKE CONCAT('%', search_term, '%'))
        AND (category_filter IS NULL OR v.Category = category_filter)
        AND (v.Price BETWEEN min_price AND max_price)
        AND (u.IsVerified = is_verified OR is_verified IS NULL)
        AND (u.AvgRate >= min_feedback OR min_feedback IS NULL)
        AND (v.Sold >= min_sold OR min_sold IS NULL)
        AND (DATEDIFF(v.Expire, CURDATE()) <= expire_in_days OR expire_in_days IS NULL)
        AND v.Expire >= CURDATE()
    ORDER BY 
        CASE 
            WHEN sort_by = 'price_asc' THEN v.Price
            WHEN sort_by = 'price_desc' THEN -v.Price
            WHEN sort_by = 'expire_asc' THEN DATEDIFF(v.Expire, CURDATE())
            WHEN sort_by = 'expire_desc' THEN -DATEDIFF(v.Expire, CURDATE())
        END;
END$$

DELIMITER ;