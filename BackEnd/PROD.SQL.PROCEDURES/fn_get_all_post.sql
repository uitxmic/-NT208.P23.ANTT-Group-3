DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_all_post;$$
CREATE PROCEDURE fn_get_all_post()
BEGIN
   SELECT PostId, VoucherId, UserId, PostName, VouImg, Content, Price, Date, Expire, Quantity, UpVote, UpDown
        IsActive,
        CASE 
            WHEN Expire < CURDATE() THEN 'Expired'
            WHEN IsActive = FALSE THEN 'Inactive'
            ELSE 'Active'
        END AS Status 
    FROM Post P 
	WHERE IsVerified IS TRUE
    ORDER BY IsActive DESC;
END $$

DELIMITER ;

CALL fn_get_all_post()