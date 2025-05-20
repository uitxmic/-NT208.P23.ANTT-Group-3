const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const postingController = require('../controllers/PostingController');

// public api
router.use('/get20LastestPostings', postingController.Get20LastestPostings);

//router.use(authMiddleware);

// private api
router.use('/createPosting', postingController.CreatePosting);
router.use('/getPostingsByUserId/:UserId', postingController.GetPostingsByUserId);
router.use('/getAllPostings', postingController.GetAllPostings);
router.use('/getPostingByPostId/:PostId', postingController.GetPostingByPostId);
router.use('/updatePosting', postingController.UpdatePosting);
router.use('/deactivePosting', postingController.DeactivePosting);
router.patch('/activePosting', postingController.ActivePosting);
router.use('/getActivePostings', postingController.GetActivePostings);
router.use('/getDeactivePostings', postingController.GetDeactivePostings);
router.use('/getAllPostingsForAdmin', postingController.GetAllPostingsForAdmin);


module.exports = router;
