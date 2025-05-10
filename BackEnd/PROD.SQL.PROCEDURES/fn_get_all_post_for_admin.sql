DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_post_for_admin;$$
CREATE PROCEDURE fn_get_all_post_for_admin()
BEGIN
   SELECT P.PostId, P.VoucherId,P.UserId, P.PostName, P.VouImg,
         P.Content, P.Price, P.Date, P.Expire, P.Quantity, P.UpVote, P.UpDown,
         P.IsActive, P.IsVerified, CASE 
                     WHEN P.Expire < CURDATE() THEN 'Expired'
                     WHEN P.IsActive = FALSE THEN 'Inactive'
                     ELSE 'Active'
                  END AS `Status`
   FROM Post P
   GROUP BY P.VoucherId, P.PostId, P.UserId, P.PostName, P.VouImg, P.Content, P.Price, P.Date, P.Expire, P.Quantity, P.UpVote, P.UpDown, P.IsActive
   ORDER BY P.IsActive DESC;
END $$

DELIMITER ;

CALL fn_get_all_post_for_admin();