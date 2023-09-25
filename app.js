const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// --- TO GET THE DATA ---
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    // API URL : 
    const query = req.body.cityName;
    const apikey = "65756b6c72f33dcdf36e274a5f5010d8";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;

    // GETTING the data from the API by HTTPS request
    https.get(url, (response) => {
        console.log(response.statusCode);

        // DATA is shown in the console...
        response.on("data", function (data) {
            // Data is recieved in the form of HexaDecimal.
            // console.log(data);

            // For converting the data into READABLE format : 
            const weatherData = JSON.parse(data);
            // console.log(weatherData);

            const temp = weatherData.main.temp;
            const weatherDesp = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write('<html><head><style>');
            res.write('body { text-align: center; background: #32329d;}');
            res.write('body {display: flex;justify-content: center;align-items: center;flex-direction: column;}');
            res.write('h1 { color: #F1FFFA; font-size: 4rem }');
            res.write('h2 { color: #F1FFFA; font-size: 3rem }');
            res.write('</style></head><body>');

            console.log("Tempeature : " + temp);
            console.log("Weather Description : " + weatherDesp);
            console.log("Weather Condition Icon : " + icon);

            // res.write("<h2>The temperature in London is " + temp + " degrees celcius</h2>");
            // res.write("<h3>The weather condition in London is " + weatherDesp + " 🚬</h3>");
            res.write("<h1> The temperature in " + query + " is " + temp + "</h1>");
            res.write("<h2>The atomsphere in " + query + " is " + weatherDesp + "</h2>");
            res.write("<img src = " + imageURL + ">");
            res.send()
        })
    })
});

app.listen(3000, function () {
    console.log("Server is running on port 3000 !!");
})
