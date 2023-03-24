const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

//router.get('/', userController.getUser);
//router.delete('/delete', userController.deleteUser);
router.put('/updateEmailSettings', userController.updateEmailSettings);
router.put('/updateEmail', userController.updateEmail);
router.put('/updatePassword', userController.updatePassword);
//mark stock in stock to bought list as sold
router.put('/markStockAsSold', userController.markStockSold);
//remove stock to bought list
router.delete('/boughtStock', userController.deleteBoughtStock);

module.exports = router;