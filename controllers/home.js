module.exports = {
    getIndex: (req, res) => {
      res.render("Home.ejs", {title: "Stock Tracker"});
    },
    getHome: (req, res) => {
      res.render("HighlightedStockListPage.ejs", {title: "Stock Tracker"});
    },
    getAccount: (req, res) => {
      res.render("Account.ejs", {title: "Account Settings"});
    },
    getBoughtStocks: (req, res) => {
      res.render("BoughtStockPage.ejs", {title: "Bought Stocks"});
    },
    getSoldStocks: (req, res) => {
      res.render("SoldStocksStats.ejs", {title: "Sold Stocks"});
    },
    getSingleStock: (req, res) => {
      res.render("StockPage.ejs", {title: "Stock Name"});
    },
  };