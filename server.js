const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000
const figlet = require('figlet')

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/css/style.css', (req, res) => {
    res.sendFile(__dirname + '/css/style.css');
});
app.get('/js/main.js', (req, res) => {
    res.sendFile(__dirname + '/js/main.js');
});
app.get('/stock/:stockName', (req, res) => {
    const stockName = req.params.stockName.toLowerCase()
    if(stockName !== ""){
        const options = {
            method: 'GET',
            params: {modules: 'defaultKeyStatistics,assetProfile'},
            headers: {
              'X-API-KEY': '0KhpZ6tcGv57qyvZ1G8IEaPDcIIVAAMW65yo2enN'
            }
          };
        const url = 'https://yfapi.net/v6/finance/quote?region=US&lang=eng&symbols=' + stockName;
        fetch(url, options)
            .then(result => result.json()) // parse response as JSON
            .then(data => {
                const objToJson = {
                    price: data.quoteResponse.result[0].regularMarketPrice,
                    exchange: data.quoteResponse.result[0].fullExchangeName,
                    name: data.quoteResponse.result[0].longName
                }
                return res.json(objToJson);
            })
            .catch(err => {
                res.json({err: "Stock not found"});
            });
    }else{
        res.json({err: "No stock entered"});
    }  
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
});