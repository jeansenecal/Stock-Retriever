const axios = require('axios');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const job = schedule.scheduleJob('0 30 9,15 ? * MON,TUE,WED,THU,FRI *', scrapeDayminer);

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
    let tod = "";
    if(hours > 12){
        tod = "pm";
    }else{
        tod = "am";
    }
    const dateOfRetrieval = year + "-" + month + "-" + date + " " + tod;
    
    stockScoreDateArray = stockScoreDateArray.filter( e => e.score > 10)
        .map( e => new Stock(e.symbol, e.score, 0, dateOfRetrieval));
    
    const intervalId = setInterval( async () => {
        if(stockScoreDateArray.length > 0){
            let stock = stockScoreDateArray.shift();
            stock.price = await getStockPrice(stock.symbol);
            if(stock.score > 200){
                db.collection('stockScoreGreater200').insertOne(stock)
                    .catch(error => console.error(error));
            }else if (stock.score > 50){
                db.collection('stockScoreGreater50').insertOne(stock)
                    .catch(error => console.error(error));
            }else{
                db.collection('stockScoreGreater10').insertOne(stock)
                    .catch(error => console.error(error));
            }
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