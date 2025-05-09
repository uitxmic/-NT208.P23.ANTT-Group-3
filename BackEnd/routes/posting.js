const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const postingController = require('../controllers/PostingController');

// public api

router.use(authMiddleware);

// private api
router.use('/createPosting', postingController.CreatePosting);
router.use('/getPostingsByUserId/:UserId', postingController.GetPostingsByUserId);
router.use('/getAllPostings', postingController.GetAllPostings);
router.use('/getPostingByPostId/:PostId', postingController.GetPostingByPostId);
router.use('/updatePosting', postingController.UpdatePosting);
router.use('/deactivePosting', postingController.DeactivePosting);
router.use('/activePosting', postingController.ActivePosting);
router.use('/getActivePostings', postingController.GetActivePostings);
router.use('/getDeactivePostings', postingController.GetDeactivePostings);

module.exports = router;
