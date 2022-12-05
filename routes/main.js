const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');

router.get('/', homeController.getIndex);
router.get('/home', homeController.getHome);
router.get('/BoughtStocks', homeController.getBoughtStocks);
router.get('/SoldStocks', homeController.getSoldStocks);
router.get('/StockName', homeController.getSingleStock);
router.get('/account', homeController.getAccount);
router.get('/login', authController.getLogin);
//router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
//router.post('/signup', authController.postSignup);
//router.post('/logout', authController.postLogout);

module.exports = router;