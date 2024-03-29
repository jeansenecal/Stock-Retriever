const { EmailFrquencyOptions } = require('../models/User');
const User = require("../models/User");
const BoughtStock = require("../models/BoughtStock");
const SoldStock = require("../models/SoldStock");
const axios = require('axios');

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
      let boughtStocksFormatted = [];
      for await(const e of boughtStocks){
        const id = e._id.toString();
        const date = e.dateBought.toDateString();
        const currentPrice = await getStockPrice(e.symbol);
        const returnDollars = currentPrice - e.boughtPrice;
        const returnPercentage = (returnDollars /  e.boughtPrice) * 100;
        let stockInfo = {
          ...e,
          currentPrice: currentPrice,
          returnDollars: Number.parseFloat(returnDollars).toFixed(2),
          returnPercentage: Number.parseFloat(returnPercentage).toFixed(2),
          _id: id,
          dateBought: date
        }
        boughtStocksFormatted.push(stockInfo)
      }
      res.render("BoughtStockPage.ejs", {title: "Bought Stocks", boughtStocks: boughtStocksFormatted});
    },
    getSoldStocks: async (req, res) => {
      const soldStocks = await SoldStock.find({user: req.user.id}).lean();
      console.log(soldStocks)
      res.render("SoldStocksStats.ejs", {title: "Sold Stocks", soldStocks: soldStocks});
    },
    getSingleStock: (req, res) => {
      res.render("StockPage.ejs", {title: "Stock Name"});
    },
  };

async function getStockPrice(symbol){
  const url = 'https://api.twelvedata.com/price?symbol=' + symbol + '&apikey=' + process.env.TWELVE_DATA_API_KEY;
  let res = await axios.get(url);
  price = res.data.price;
  return Number.parseFloat(price).toFixed(2);
}
