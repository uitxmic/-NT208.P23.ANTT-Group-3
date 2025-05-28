DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_seller_post_by_sellerId;$$
CREATE PROCEDURE fn_get_all_seller_post_by_sellerId(
	IN P_userid INT,
	IN p_page INT,
    IN p_page_size INT
	)
BEGIN
	DECLARE p_offset INT;
    SET p_offset = (p_page - 1) * p_page_size;

   SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
         'PostId', P.PostId,
         'VoucherId', P.VoucherId,
         'UserId', P.UserId,
         'UserName', U.Username,
         'AvgRate', U.AvgRate,
         'SoldAmount', U.SoldAmount,
         'ProductAmount', (
            SELECT COUNT(*) 
            FROM Post P2 
            WHERE P2.UserId = P.UserId 
            AND P2.IsVerified IS TRUE 
            AND P2.IsActive IS TRUE 
            AND P2.Quantity > 0 
            AND P2.Price > 0
         ),
         'PostName', P.PostName,
         'VouImg', P.VouImg,
         'Content', P.Content,
         'Price', P.Price,
         'Date', P.Date,
         'Category', (SELECT V.Category FROM Voucher V WHERE V.VoucherId = P.VoucherId GROUP BY V.Category),
         'Expire', P.Expire,
         'Quantity', P.Quantity,
         'UpVote', P.UpVote,
         'UpDown', P.UpDown,
         'IsActive', P.IsActive,
         'Status', CASE 
                     WHEN P.Expire < CURDATE() THEN 'Expired'
                     WHEN P.IsActive = FALSE THEN 'Inactive'
                     ELSE 'Active'
                  END
      )
   ) AS result
    FROM Post P JOIN User U on P.UserId = U.UserId
   WHERE P.IsVerified IS TRUE AND P.IsActive IS TRUE AND P.Quantity > 0 AND P.Price > 0 AND P.UserId=P_userid
   GROUP BY P.VoucherId, P.PostId, P.UserId, P.PostName, P.VouImg, P.Content, P.Price, P.Date, P.Expire, P.Quantity, P.UpVote, P.UpDown, P.IsActive
   ORDER BY P.Date DESC
   LIMIT p_page_size OFFSET p_offset;
END $$

DELIMITER ;

CALL fn_get_all_seller_post_by_sellerId(35,1,100);