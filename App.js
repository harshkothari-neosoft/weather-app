const express = require('express');
const app = express();
const request = require('request');
const port = 5400;

const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Indore&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";

// Static file path
app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');


function getWeather(url) {
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

app.get('/',(req,res) => {
    var dataPromise = getWeather();
    dataPromise.then(JSON.parse)
               .then(function(result) {
                    res.render('main',{result,title:'Weather App'})
                })
})

app.get('/weatherwithoutpromise',(req,res) => {
    request(weatherUrl, (err,response,body) =>{
        if(err){
            console.log(err);
        } else {
           
            const output = JSON.parse(body);
            result = output
            res.render('main',{result,title:'Weather App'})
        }
    });
});

app.listen(port ,(err) => {
    if(err) { console.log('error in api call')}
    else{ console.log ('App is running on port '+port)}
})