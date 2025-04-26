DELIMITER $$
drop PROCEDURE if exists fn_get_20_lastest_posts$$
CREATE PROCEDURE fn_get_20_lastest_posts()
BEGIN
    SELECT PostId, P.VoucherId, P.UserId, Postname, Content, `Date`, `Expire`, IsActive, isVerified, Interactions, 
			Price, VoucherImage, VoucherName
    FROM Post P JOIN Voucher V
    ON V.VoucherId = P.VoucherId
    WHERE IsActive = 1
    ORDER BY Date DESC
    LIMIT 20;
END$$
DELIMITER ;