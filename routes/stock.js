const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock');

//get list of highlighted stocks
router.get('/', userController.getStockInfo);
//get info on single stock
router.get('/:id', userController.getStockInfo);
//Add stock to bought list
router.put('/boughtStock/:id', userController.addBoughtStock);
//remove stock to bought list
router.delete('/boughtStock/:id', userController.deleteBoughtStock);
//mark stock in stock to bought list as sold
router.put('/markStockAsSold/:id', userController.markStockSold);
//get list of bought unsold stock
router.get('/boughtStock/', userController.getBoughtStock);
//get list of sold stock
router.get('/soldStock/', userController.getSoldStock);

module.exports = router;