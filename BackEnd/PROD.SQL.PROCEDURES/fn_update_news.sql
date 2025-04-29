DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_news;$$

/*
* Cập nhật thông tin tin tức
* Output: Message và ID của bài đăng đã cập nhật
*/

CREATE PROCEDURE fn_update_news(
    IN in_post_id INT,
    IN in_voucher_id INT,
    IN in_postname VARCHAR(100),
    IN in_content TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Update Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET 
        VoucherId = in_voucher_id,
        Postname = in_postname,
        Content = in_content,
        Date = CURRENT_DATE(),
        Expire = DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
    WHERE PostId = in_post_id;
    
    SELECT 'News Updated Successfully' AS Message, in_post_id AS Id;
END$$

DELIMITER ; 