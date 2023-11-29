const axios = require('axios');
const puppeteer = require('puppeteer');
const ScrappedStock = require('../models/ScrappedStock');
const ScheduledJobHistory = require('../models/ScheduledJobHistory');

async function scrapeDayminer(){
    //Get hyped reddit stock list
    console.log("Starting scheduled job");

    //Check if the job ran in the last 12 hours
    let lastRunDate = await ScheduledJobHistory.findOne().sort({lastrun: 'desc'});
    let dateNow = new Date();
    let hoursDifferenceBetweenDates = lastRunDate == null ? null : (((dateNow - lastRunDate.lastrun)/ 1000)/60)/60 ;

    if(hoursDifferenceBetweenDates == null || hoursDifferenceBetweenDates > 12){
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

        let date = ("0" + dateNow.getDate()).slice(-2);
        let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);
        let year = dateNow.getFullYear();
        //let hours = date_ob.getHours();
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
            }
        },10000, stockScoreDateArray);
        console.log("Finished inserting stocks");
        const runDate = new ScheduledJobHistory({lastrun: dateNow});
        runDate.save();
    }else{
        console.log("Not scrapping time yet");
    }
}
async function getStockPrice(symbol){
    const url = 'https://api.twelvedata.com/price?symbol=' + symbol + '&apikey=' + process.env.TWELVE_DATA_API_KEY;
}
module.exports = scrapeDayminer;