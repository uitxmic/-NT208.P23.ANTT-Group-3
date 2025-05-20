DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_notification_by_id$$

CREATE PROCEDURE fn_get_notification_by_id (
	IN in_NotiId INT
)

BEGIN
	SELECT P.PostId, P.VoucherId, VoucherCode, TransactionAmount, UserIdbuyer, UserIdseller, Status,
			noti_id, user_id, noti_type, noti_title, noti_content, VouImg, created_at, updated_at, is_read, is_deleted, transaction_id
	FROM noti N
    JOIN Transaction T
    ON N.transaction_id = T.TransactionId
    JOIN Post P
    ON P.PostId = T.PostId
    WHERE noti_id = in_NotiId;
END$$

DELIMITER ;

CALL fn_get_notification_by_id(3);