const axios = require('axios');
module.exports = {
    getStockPrice: async function (symbol) {
        const url = 'https://api.twelvedata.com/price?symbol=' + symbol + '&apikey=' + process.env.TWELVE_DATA_API_KEY;
        let res = await axios.get(url);
        price = res.data.price;
        return price;
    },
  };