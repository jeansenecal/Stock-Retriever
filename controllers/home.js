const { EmailFrquencyOptions } = require('../models/User');
const User = require("../models/User");
const BoughtStock = require("../models/BoughtStock")

module.exports = {
    getIndex: (req, res) => {
      res.render("Home.ejs", {title: "Stock Tracker"});
    },
    getHome: (req, res) => {
      res.render("HighlightedStockListPage.ejs", {title: "Stock Tracker"});
    },
    getAccount: async (req, res) => {
      const user = await User.findOne({id: req.user.id});
      res.render("Account.ejs", {title: "Account Settings", frequencyOptions: EmailFrquencyOptions, user: user});
    },
    getBoughtStocks: async (req, res) => {

      const boughtStocks = await BoughtStock.find({user: req.user.id}).lean();
      res.render("BoughtStockPage.ejs", {title: "Bought Stocks", boughtStocks: boughtStocks});
    },
    getSoldStocks: (req, res) => {
      res.render("SoldStocksStats.ejs", {title: "Sold Stocks"});
    },
    getSingleStock: (req, res) => {
      res.render("StockPage.ejs", {title: "Stock Name"});
    },
  };