DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_cart;$$

CREATE PROCEDURE fn_update_cart (
    IN in_UserId INT,
    IN in_ItemId INT,
    IN in_Quantity INT
)
BEGIN
    DECLARE current_quantity INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Update Failed' AS Message, -1 AS Id;
    END;

    -- Tăng số lượng
    IF in_Quantity = 1 THEN
        UPDATE CartItem
        SET Quantity = Quantity + 1,
            UpdateAt = CURRENT_TIMESTAMP()
        WHERE ItemId = in_ItemId AND UserId = in_UserId;

        SELECT 'Quantity increased' AS Message, in_ItemId AS Id;

    -- Giảm số lượng
    ELSEIF in_Quantity = -1 THEN
        SELECT Quantity INTO current_quantity
        FROM CartItem
        WHERE ItemId = in_ItemId AND UserId = in_UserId;

        IF current_quantity <= 1 THEN
            DELETE FROM CartItem
            WHERE ItemId = in_ItemId AND UserId = in_UserId;

            SELECT 'CartItem deleted (quantity <= 0)' AS Message, in_ItemId AS Id;
        ELSE
            UPDATE CartItem
            SET Quantity = Quantity - 1,
                UpdateAt = CURRENT_TIMESTAMP()
            WHERE ItemId = in_ItemId AND UserId = in_UserId;

            SELECT 'Quantity decreased' AS Message, in_ItemId AS Id;
        END IF;

    -- Xóa nếu bằng 0
    ELSEIF in_Quantity = 0 THEN
        DELETE FROM CartItem
        WHERE ItemId = in_ItemId AND UserId = in_UserId;

        SELECT 'CartItem deleted (explicit)' AS Message, in_ItemId AS Id;

    -- Giá trị không hợp lệ
    ELSE
        SELECT 'Invalid quantity value' AS Message, -2 AS Id;
    END IF;

END$$

DELIMITER ;
