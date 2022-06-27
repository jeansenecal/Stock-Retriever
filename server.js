const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;
const axios = require('axios');
const puppeteer = require('puppeteer');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
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
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto('https://dayminer.herokuapp.com/');
    const t = await page.waitForSelector("#dynamic");
    /*var text = await page.evaluate(element => {
        element = element.filter( e => e.classList.contains('symbol-col'));
        element = element.map( e => e.textContent);
        return element;
    }, t);*/
    var text = await page.evaluate(element => {
        let child = element.childNodes;
        let s = "";
        child.forEach( e =>{
            if(e.classList.contains('symbol-col')){
                s += e.textContent
            }
        });
        return s;
        //child = child.filter( e => e.classList.contains('symbol-col'));
        //child = child.map( e => e.textContent);
        //return child;
        //element.childNodes[1].textContent
    }, t);
    console.log(text);
    browser.close();
}