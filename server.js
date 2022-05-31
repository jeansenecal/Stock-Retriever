const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet')

const server = http.createServer( (req, res) => {
    const page = url.parse(req.url).pathname;
    const params = querystring.parse(url.parse(req.url).query);
    
    if( page == '/'){
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else if ( page == '/css/style.css'){
        fs.readFile('css/style.css', function(err, data) {
            res.write(data);
            res.end();
          });
    }
    else if ( page == '/js/main.js'){
        fs.readFile('js/main.js', function(err, data){
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        })
    }
    else if ( page == '/api'){
        if(params['stock'] != ''){
            const options = {
                method: 'GET',
                params: {modules: 'defaultKeyStatistics,assetProfile'},
                headers: {
                  'X-API-KEY': '0KhpZ6tcGv57qyvZ1G8IEaPDcIIVAAMW65yo2enN'
                }
              };
            const url = 'https://yfapi.net/v6/finance/quote?region=US&lang=eng&symbols=' + params['stock'];
            fetch(url, options)
                .then(res => res.json()) // parse response as JSON
                .then(data => {
                    const objToJson = {
                        price: data.quoteResponse.result[0].regularMarketPrice,
                        exchange: data.quoteResponse.result[0].fullExchangeName,
                        name: data.quoteResponse.result[0].longName
                    }
                    res.end(JSON.stringify(objToJson));
                })
                .catch(err => {
                    res.end(JSON.stringify({err: "Stock not found"}));
                });
        }else{
            res.end(JSON.stringify({err: "No stock entered"}));
        }
        
    }
    else{
        figlet('404!!', function(err, data) {
          if (err) {
              console.log('Something went wrong...');
              console.dir(err);
              return;
          }
          res.write(data);
          res.end();
        });
    }
})
server.listen(8000);