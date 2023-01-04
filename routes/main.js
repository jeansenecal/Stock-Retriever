const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const {ensureAuth, ensureGuest} = require("../middleware/auth");

router.get('/', homeController.getIndex);
router.get('/home', homeController.getHome);
router.get('/BoughtStocks', ensureAuth, homeController.getBoughtStocks);
router.get('/SoldStocks', homeController.getSoldStocks);
router.get('/StockName', homeController.getSingleStock);
router.get('/account', homeController.getAccount);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout', authController.logout);

module.exports = router;