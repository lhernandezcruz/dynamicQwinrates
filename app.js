// dependensies 
var api = require('./api');

var async = require('async');

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "localhost";

var app = express();
app.use(express.static(__dirname + "/public"));


// need this for recieving summoner names
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.post('/getIds', function (req, res) {
    // get region, amount of players and summoner names
    var region = req.body.region;
    var amount = req.body.amount;
    var sumNames = [];
    for (var i =0; i < req.body.amount; i++){
        var name = req.body["name" + (i+1)];
        sumNames.push( name.replace(/\s/g, '').toLowerCase() );
    }

    // start riot api calls
    async.waterfall([
        // 'fake' callback function so i can pass the data to next call
        function (callback) {
            callback(null, sumNames, region, amount);
        }
        // get summoner id's
        , getIDS
        // get all matches
        , getMatches
        // get similarMatches
        , getSimilarMatches
        // get winrate
        , winRate
    ], function (err, summonerNames, region, amount, arg2) {
        
        if (err) {
            // on error return error (don't actually know if it works )
            res.status(404).send(err);
            
            return;
        }
        // if no error was found, return winrate percentage, amount of games played, and summoner names
        var result = {};
        result.winRate = Math.round(arg2[0] * 100);
        result.gamesPlayed = arg2[1];
        result.sumNames = sumNames;
        res.send(result);

    });

});

// get the functions from (own) api module
var getIDS = api.getIds;
var getMatches = api.getMatches;
var getSimilarMatches = api.getSimMatches;
var winRate = api.getWinRate;

// not sure if i actually need this
app.listen(server_port, server_ip_address, function () {
    
});