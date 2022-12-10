const express = require('express');
const router = express.Router();
const voteController = require('../api/controllers/vote');

router.post('/', voteController.takeVote);
router.get('/count', voteController.getVoteDetails);
module.exports = router;