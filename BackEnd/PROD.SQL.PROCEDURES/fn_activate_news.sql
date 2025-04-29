DELIMITER $$

DROP PROCEDURE IF EXISTS fn_activate_news;$$

/*
* Kích hoạt lại tin tức
* Input: in_post_id - ID bài đăng cần kích hoạt
* Output: Message và ID của bài đăng đã kích hoạt
*/

CREATE PROCEDURE fn_activate_news(IN in_post_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Activation Failed' AS Message, -1 AS Id;
    END;
    
    UPDATE Post
    SET IsActive = TRUE
    WHERE PostId = in_post_id;
    
    SELECT 'News Activated Successfully' AS Message, in_post_id AS Id;
END$$

DELIMITER ; 