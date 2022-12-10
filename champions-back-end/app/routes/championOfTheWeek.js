const express = require('express');
const router = express.Router();
const championOfTheWeekController = require('../api/controllers/championOfTheWeek');

router.post('/', championOfTheWeekController.setChampionOfWeek);
router.get('/champions', championOfTheWeekController.getChapionsOfWeek);
router.post('/update/:id', championOfTheWeekController.updateChapionsOfWeek);
module.exports = router;