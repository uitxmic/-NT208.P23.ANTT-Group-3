DELIMITER $$

DROP PROCEDURE IF EXISTS fn_rating;$$

CREATE PROCEDURE fn_rating (
	IN in_UserId INT,
    IN in_PostId INT,
    IN in_Vote INT,
    IN in_Rate INT,
    In in_TransactionId INT
)

BEGIN
    Insert into Rating (UserId, RatingPoint)
    value (in_UserId, in_Rate);
    IF in_Vote = 1
    then 
		update Post
        set UpVote = Upvote + 1
        where PostId = in_PostId;
	end if;
    if in_Vote = -1 
    then 
		update Post
        set Updown = Updown - 1
        where PostId = in_PostId;
	end if;
    update Transaction
    set IsRating = 1
    where TransactionId = in_TransactionId;
END$$

DELIMITER ;