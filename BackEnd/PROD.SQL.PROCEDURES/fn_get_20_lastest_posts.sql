DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_20_lastest_posts;$$
CREATE PROCEDURE fn_get_20_lastest_posts()
BEGIN
   SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
         'PostId', P.PostId,
         'VoucherId', P.VoucherId,
         'UserId', P.UserId,
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
   FROM Post P
   WHERE P.IsVerified IS TRUE 
   AND P.IsActive IS TRUE
   AND P.Quantity > 0
   ORDER BY P.Date DESC
   LIMIT 20;
END $$

DELIMITER ;