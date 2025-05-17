DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_vouchers_with_filters;$$

CREATE PROCEDURE fn_search_vouchers_with_filters(
    IN search_term VARCHAR(100),
    IN category_filter VARCHAR(100),
    IN min_price DECIMAL(10, 2),
    IN max_price DECIMAL(10, 2),
    IN sort_by VARCHAR(20)
)
BEGIN
    IF search_term IS NULL OR search_term = '' THEN
        SET search_term = '%';
    END IF;
    SELECT 
        v.*,
        u.Username
    FROM Voucher v
    JOIN User u ON v.UserId = u.UserId
    WHERE 
        (v.VoucherName LIKE CONCAT('%', search_term, '%') OR v.Category LIKE CONCAT('%', search_term, '%'))
        AND (category_filter IS NULL OR v.Category = category_filter)
        AND (v.Price BETWEEN min_price AND max_price)
        AND (DATEDIFF(v.Expire, CURDATE()) <= expire_in_days OR expire_in_days IS NULL)
        AND v.Expire >= CURDATE()
        -- AND v.IsOnSale is TRUE
    ORDER BY 
        CASE 
            WHEN sort_by = 'price_asc' THEN v.Price
            WHEN sort_by = 'price_desc' THEN -v.Price
            WHEN sort_by = 'expire_asc' THEN DATEDIFF(v.Expire, CURDATE())
            WHEN sort_by = 'expire_desc' THEN -DATEDIFF(v.Expire, CURDATE())
        END;
END$$

DELIMITER ;