DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_posting_by_post_id;$$
CREATE PROCEDURE fn_get_posting_by_post_id(IN post_id INT)
BEGIN
   SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
         'PostId', P.PostId,
         'VoucherId', P.VoucherId,
         'UserId', P.UserId,
         'UserName', U.Username,
         'AvgRate', U.AvgRate,
         'SoldAmount', U.SoldAmount,
         'PostName', P.PostName,
         'VouImg', P.VouImg,
         'Content', P.Content,
         'Price', P.Price,
         'Date', P.Date,
         'Expire', P.Expire,
         'Quantity', P.Quantity,
         'UpVote', P.UpVote,
         'UpDown', P.UpDown,
         'IsActive', P.IsActive,
         'IsVerified', P.IsVerified,
         'Status', CASE 
                     WHEN P.Expire < CURDATE() THEN 'Expired'
                     WHEN P.IsActive = FALSE THEN 'Inactive'
                     ELSE 'Active'
                  END
      )
   ) AS result
   FROM Post P JOIN User U on P.UserId = U.UserId
   WHERE P.IsVerified IS TRUE 
   AND P.IsActive IS TRUE
   AND P.PostId = post_id
   AND P.Quantity > 0;
END $$

DELIMITER ;

CALL fn_get_posting_by_post_id(22);