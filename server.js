const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;
const axios = require('axios');

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
        const axiosOptions ={
            params: {modules: 'defaultKeyStatistics,assetProfile'},
            headers: {
              'X-API-KEY': '0KhpZ6tcGv57qyvZ1G8IEaPDcIIVAAMW65yo2enN'
            }
        };
        const url = 'https://yfapi.net/v6/finance/quote?region=US&lang=eng&symbols=' + stockName;
        axios.get(url, axiosOptions)
            .then(response => {
                const objToJson = {
                    price: response.data.quoteResponse.result[0].regularMarketPrice,
                    exchange: response.data.quoteResponse.result[0].fullExchangeName,
                    name: response.data.quoteResponse.result[0].longName
                }
                return res.json(objToJson);
            })
            .catch(error => {
                res.json({error: "Stock not found"});
        });
            
       /*fetch(url, options)
            .then(result => console.log(result)) // parse response as JSON
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
            });*/
    }else{
        res.json({err: "No stock entered"});
    }  
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
});