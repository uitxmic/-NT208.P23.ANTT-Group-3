DELIMITER $$

DROP PROCEDURE IF EXISTS fn_deactivate_news;$$

/*
* Hủy bỏ tin tức
* Input: in_post_id - ID bài đăng cần hủy bỏ
* Output: Message và ID của bài đăng đã hủy bỏ
*/

CREATE PROCEDURE fn_deactivate_news(IN in_post_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Deactivation Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET IsActive = FALSE
    WHERE PostId = in_post_id;
    
    SELECT 'News Deactivated Successfully' AS Message, in_post_id AS Id;
END$$

DELIMITER ; 