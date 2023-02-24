const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

//router.get('/', userController.getUser);
//router.delete('/delete', userController.deleteUser);
router.put('/updateEmailSettings', userController.updateEmailSettings);
//router.put('/updateEmail', userController.updateEmail);
//router.put('/updatePassword', userController.updatePassword);

module.exports = router;