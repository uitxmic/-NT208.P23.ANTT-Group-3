DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_post;$$

CREATE PROCEDURE fn_create_post (
	IN in_voucherId INT,
    IN in_UserId INT,
    IN in_Postname VARCHAR(255),
    IN in_Content TEXT
)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SELECT 'Created Failed' AS Message, -1 AS Id;
    END;
    
    INSERT INTO Post (VoucherId, UserId, Postname, Content, Date, Expire, IsActive)
    VALUES (
        in_voucherId,
        in_UserId,
        in_Postname,
        in_Content,
        CURRENT_DATE(),                            -- Ngày đăng là hôm nay
        DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),  -- Expire sau 7 ngày
        TRUE                                        -- Mặc định IsActive là TRUE
    );
	SELECT 'Post Created' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ;

