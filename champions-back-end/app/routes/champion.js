const express = require('express');
const router = express.Router();
const championController = require('../api/controllers/champion');

router.get('/', championController.getAll);
router.get('/team', championController.getTeam);
router.post('/create', championController.create);
router.post('/update/:id', championController.updateById);
router.delete('/delete/:id', championController.deleteById);

module.exports = router;