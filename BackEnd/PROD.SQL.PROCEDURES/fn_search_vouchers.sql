DELIMITER $$

DROP PROCEDURE IF EXISTS fn_search_vouchers;$$

CREATE PROCEDURE fn_search_vouchers(
    IN search_term VARCHAR(100),
    IN min_price DECIMAL(10, 2),
    IN max_price DECIMAL(10, 2),
    IN is_active BOOLEAN
)
BEGIN
    SELECT *
    FROM Voucher
    WHERE 
        (VoucherName LIKE CONCAT('%', search_term, '%') OR Category LIKE CONCAT('%', search_term, '%'))
        AND (Price BETWEEN min_price AND max_price)
        AND (IsActive = is_active OR is_active IS NULL);
END$$

DELIMITER ;