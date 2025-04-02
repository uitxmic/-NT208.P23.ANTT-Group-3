DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_news;$$

CREATE PROCEDURE fn_create_news(
    IN in_voucher_id INT,
    IN in_user_id INT,
    IN in_postname VARCHAR(255),
    IN in_content TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Creation Failed' AS Message, -1 AS Id;
    END;
    
    INSERT INTO Post (
        VoucherId,
        UserId,
        Postname,
        Content,
        Date,
        Expire,
        IsActive
    )
    VALUES (
        in_voucher_id,
        in_user_id,
        in_postname,
        in_content,
        CURRENT_DATE(),
        DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),
        TRUE
    );
    
    SELECT 'News Created Successfully' AS Message, LAST_INSERT_ID() AS Id;
END$$

DELIMITER ; 