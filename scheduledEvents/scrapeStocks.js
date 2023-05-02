const axios = require('axios');
const puppeteer = require('puppeteer');
const ScrappedStock = require('../models/ScrappedStock');

async function scrapeDayminer(){
    //Get hyped reddit stock list
    console.log("Starting scraping process");
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
    const dateOfRetrieval = year + "-" + month + "-" + date;
    
    stockScoreDateArray = stockScoreDateArray.filter( e => e.score > 10)
        .map( e => {
            return {symbol: e.symbol, score: e.score, date: dateOfRetrieval, price: 0};
        });
    console.log(`Inserting ${stockScoreDateArray.length} lines`);
    const intervalId = setInterval( async () => {
        if(stockScoreDateArray.length > 0){
            let stock = stockScoreDateArray.shift();
            stock.price = await getStockPrice(stock.symbol);

            let res = await ScrappedStock.findOneAndUpdate(
                { symbol: stock.symbol },
                { $push: { history: { score: stock.score, price: stock.price, date: stock.date }}},
                { upsert: true}
            );
        }else{
            clearInterval(intervalId);
            console.log("Finished inserting stocks");
        }
    },10000, stockScoreDateArray);
    
}
async function getStockPrice(symbol){
    const url = 'https://api.twelvedata.com/price?symbol=' + symbol + '&apikey=' + process.env.TWELVE_DATA_API_KEY;
    let res = await axios.get(url);
    price = res.data.price;
    return price;
}

function testDeployedScheduleEvent(){
    console.log("it's working")
}
module.exports = scrapeDayminer;