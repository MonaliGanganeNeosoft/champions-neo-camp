const express = require('express');
const router = express.Router();
const userController = require("../../app/api/controllers/user");

router.post('/register', userController.create);
router.post('/autenticate', userController.authenticate);
router.post('/signUp', userController.signUp);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword/:token', userController.resetPassword);

module.exports = router;