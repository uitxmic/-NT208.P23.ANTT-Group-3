DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_post;$$
CREATE PROCEDURE fn_get_all_post()
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
         'Status', CASE 
                     WHEN P.Expire < CURDATE() THEN 'Expired'
                     WHEN P.IsActive = FALSE THEN 'Inactive'
                     ELSE 'Active'
                  END
      )
   ) AS result
   FROM Post P
   WHERE P.IsVerified IS TRUE AND P.Quantity > 0
   GROUP BY P.VoucherId, P.PostId, P.UserId, P.PostName, P.VouImg, P.Content, P.Price, P.Date, P.Expire, P.Quantity, P.UpVote, P.UpDown, P.IsActive
   ORDER BY P.IsActive DESC;
END $$

DELIMITER ;

CALL fn_get_all_post();