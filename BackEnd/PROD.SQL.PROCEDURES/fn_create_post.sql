DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_post;$$

CREATE PROCEDURE fn_create_post (
	IN in_voucherId INT,
    IN in_UserId INT,
    IN in_Postname VARCHAR(255),
    IN in_Content TEXT,
    IN in_VouImg TEXT,
    IN in_Price INT,
    IN in_Quantity INT
)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    INSERT INTO Post (VoucherId, UserId, Postname, Content, VouImg, Price, `Date`, `Expire`, IsActive, Quantity)
    VALUES (
        in_voucherId,
        in_UserId,
        in_Postname,
        in_Content,
        in_VouImg,
        in_Price,
        CURRENT_DATE(),                            -- Ngày đăng là hôm nay
        DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),  -- Expire sau 7 ngày
        TRUE,
        in_Quantity
    );
	SELECT 'Post Created' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ;

CALL fn_create_post(1,2,'kk','kkkk','kkkkk',10,1);

    

