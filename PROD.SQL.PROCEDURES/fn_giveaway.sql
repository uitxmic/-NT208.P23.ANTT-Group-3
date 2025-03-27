select * from `Voucher`;
select * from `User`;

SELECT * FROM `User` WHERE PhoneNumber = '0797997991';
SELECT * FROM `Voucher` WHERE VoucherName = 'Free Coffee' AND UserId = 15;
CALL fn_giveaway('0987654323', 5, '1+1 Movie Tickets');



DELIMITER $$

DROP PROCEDURE IF EXISTS fn_giveaway; $$

CREATE PROCEDURE fn_giveaway (
    IN recipient_phonenumber VARCHAR(10),
    IN Sender_ID int,
    IN in_Voucher varchar(100)
)
BEGIN
    DECLARE sql_error TEXT;
    DECLARE recipient_Id int;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error = MESSAGE_TEXT;
        SELECT 'Login Failed' AS Message, sql_error AS ErrorDetail, -1 AS Id;
    END;
	
	SELECT UserId into recipient_Id FROM `User` 
    WHERE PhoneNumber = recipient_phonenumber
    Limit 1;

	IF recipient_Id is not null then
		UPDATE `Voucher`
        SET UserId = recipient_Id
        WHERE VoucherName = in_Voucher and UserId =  Sender_ID;
		SELECT 'Voucher transferred successfully' AS Message, recipient_Id AS UserId;
    ELSE
        SELECT 'Recipient does not exist' AS Message, NULL AS UserId;
	END IF;
END$$

DELIMITER ;
