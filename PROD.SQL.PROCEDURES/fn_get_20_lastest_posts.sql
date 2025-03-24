DELIMITER $$
drop PROCEDURE if exists fn_get_20_lastest_posts$$
CREATE PROCEDURE fn_get_20_lastest_posts()
BEGIN
    SELECT *
    FROM Post
    ORDER BY Date DESC
    LIMIT 20;
END$$
DELIMITER ;