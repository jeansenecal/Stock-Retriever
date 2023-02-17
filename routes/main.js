const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const {ensureAuth, ensureGuest} = require("../middleware/auth");

router.get('/', homeController.getIndex);
router.get('/home', ensureAuth, homeController.getHome);
router.get('/BoughtStocks', ensureAuth, homeController.getBoughtStocks);
router.get('/SoldStocks', ensureAuth, homeController.getSoldStocks);
router.get('/StockName', ensureAuth, homeController.getSingleStock);
router.get('/account', ensureAuth, homeController.getAccount);
router.get('/login', ensureGuest, authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', ensureGuest, authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/logout', ensureAuth, authController.logout);

module.exports = router;