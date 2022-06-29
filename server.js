const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;
const axios = require('axios');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
class Stock {
    constructor(symbol, score, price, date){
        this.symbol = symbol;
        this.score = score;
        this.price = price;
        this.date = date;
    }
}
app.get('/stock/:stockName', (req, res) => {
    const stockName = req.params.stockName.toLowerCase()
    scrapeDayminer();
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
    }else{
        res.json({err: "No stock entered"});
    }  
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

async function scrapeDayminer(){
    //Get hyped reddit stock list
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto('https://dayminer.herokuapp.com/');
    const grid = await page.waitForSelector("#dynamic");
  
    var stockScoreDateArray = await page.evaluate(element => {
        let child = element.childNodes;
        let arr = [];
        child.forEach( (e, i) =>{
            if(e.classList.contains('symbol-col')){
                const symbol = e.textContent
                const score = child[i+1].textContent;
                
                arr.push({symbol: symbol, score: score});
            }
        });
        return arr;
    }, grid);
    browser.close();

    //Get stock price
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    const dateOfRetrieval = year + "-" + month + "-" + date + " " + hours;

    stockScoreDateArray = stockScoreDateArray.filter( e => e.score > 1000).map( (e,i) => {
        const price = getStockPrice(e.symbol);
        const stock = new Stock(e.symbol, e.score, dateOfRetrieval, price);
        return stock;
    });
    console.table(stockScoreDateArray);
    
}
async function getStockPrice(symbol){
    const url = 'https://api.twelvedata.com/price?symbol=' + symbol + '&apikey=60a9ceb5ddc3441db6e910714832ead0';
    let res = await axios.get(url);
    console.log(res.data.price);
    await sleep(10000);
    return res.data.price;
}