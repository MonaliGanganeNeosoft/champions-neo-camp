const express = require('express');
const router = express.Router();
const leadsController = require('../api/controllers/leads');

router.get('/', leadsController.getAll);
router.post('/create', leadsController.create);
router.post('/update/:id', leadsController.updateById);
router.delete('/delete/:id', leadsController.deleteById);

module.exports = router;