DELIMITER $$

DROP PROCEDURE IF EXISTS fn_create_news;$$

/*
* Tạo tin tức mới về voucher
* Input:
*   - in_voucher_id: ID của voucher
*   - in_user_id: ID người đăng
*   - in_postname: Tiêu đề bài đăng
*   - in_content: Nội dung bài đăng
*   - in_expire_days: Số ngày hết hạn (mặc định là 7 ngày)
* Output: Message và ID của bài đăng mới
*/

CREATE PROCEDURE fn_create_news(
    IN in_voucher_id INT,
    IN in_user_id INT,
    IN in_postname VARCHAR(100),
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