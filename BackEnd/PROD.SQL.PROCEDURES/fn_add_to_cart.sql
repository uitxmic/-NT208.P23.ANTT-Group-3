DELIMITER $$

DROP PROCEDURE IF EXISTS fn_add_to_cart;$$

CREATE PROCEDURE fn_add_to_cart (
    IN in_UserId INT,
    IN in_PostId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Create Failed' AS Message, -1 AS Id;
    END;

    -- Kiểm tra xem đã có UserId + PostId trong giỏ hàng chưa
    IF EXISTS (
        SELECT 1 FROM CartItem WHERE UserId = in_UserId AND PostId = in_PostId
    ) THEN
        -- Nếu có thì cập nhật tăng số lượng lên 1
        UPDATE CartItem
        SET Quantity = Quantity + 1,
            UpdateAt = CURRENT_TIMESTAMP()
        WHERE UserId = in_UserId AND PostId = in_PostId;

        SELECT 'CartItem updated (quantity increased)' AS Message, -2 AS Id;

    ELSE
        -- Nếu chưa có thì thêm mới
        INSERT INTO CartItem (UserId, PostId, UpdateAt, Quantity)
        VALUES (in_UserId, in_PostId, CURRENT_TIMESTAMP(), 1);

        SELECT 'CartItem added' AS Message, LAST_INSERT_ID() AS Id;
    END IF;

END$$

DELIMITER ;
