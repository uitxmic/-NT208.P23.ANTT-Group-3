DELIMITER $$

DROP PROCEDURE IF EXISTS fn_get_cart;$$

CREATE PROCEDURE fn_get_cart (
	IN in_UserId INT
)

BEGIN
    select CartItem.ItemId, CartItem.Quantity, Post.PostName, Price, Post.VouImg, UpdateAt, Post.VoucherId, Post.UserId, Post.PostId
    from CartItem join Post
    where CartItem.PostId = Post.PostId
    and CartItem.UserId = in_UserId
    group by CartItem.ItemId, CartItem.Quantity, Post.PostName, Price, Post.VouImg, UpdateAt, Post.VoucherId, Post.UserId, Post.PostId
    order by CartItem.UpdateAt desc;
END$$

DELIMITER ;