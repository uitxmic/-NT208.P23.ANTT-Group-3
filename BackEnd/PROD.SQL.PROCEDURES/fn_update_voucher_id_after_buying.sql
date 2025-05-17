DELIMITER $$

DROP PROCEDURE IF EXISTS fn_update_voucher_id_after_buying;$$
CREATE PROCEDURE fn_update_voucher_id_after_buying(IN v_userId_buyer INT, IN v_userId_seller INT, IN v_voucherId INT, IN v_postId INT)
BEGIN
	DECLARE p_voucher_code TEXT;
    SELECT VoucherCode FROM 
    Voucher V JOIN Post P
    ON V.VoucherId = P.VoucherId
    WHERE P.VoucherId = v_voucherId AND P.PostId = v_postId AND V.UserId = v_userId_seller
    LIMIT 1
    INTO p_voucher_code;
    
    UPDATE Voucher
    SET UserId = v_userId_buyer
    WHERE VoucherId = v_voucherId and VoucherCode = p_voucher_code;
    
    UPDATE Post
    SET Quantity = Quantity - 1
    WHERE VoucherId = v_voucherId AND PostId = v_postId;
END $$

DELIMITER ;

CALL fn_update_voucher_id_after_buying(2,15,1,4);