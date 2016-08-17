var limit = require("simple-rate-limiter");
var request = limit(require('request')).to(3000).per(13000);

var async = require('async');

var key = "";

module.exports = {
    /*  getIds
     *  input: sumNames = an array of summoner names (length 2-5), region = league region (2 letter string)
     *         amount = amount of summoners
     *  output: callback(null, sumNames, region, amount, ids) where ids = summonerIds for each summoner 
     */
    getIds: function (sumNames, region, amount, callback) {
        var names = sumNames.join(",");
        var URL = "https://" + region + ".api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + names + "?api_key=" + key;
        var ids = [];
        request({
            url: URL
            , json: true
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                for (var i = 0; i < sumNames.length; i++) {
                    ids.push(response.body[sumNames[i]].id);
                }
                
                callback(null, sumNames, region, amount, ids);

            } else {
                console.log(response.statusCode);
            }
        });

    },

    /*  getMatches
     *     input: sumNames, region, amount, idList = an array with summoner id's in them
     *     output: callback(null, sumNames, region, amount, allMatches) allMatches = list of all matches
     *             played by all summoners
     */
    getMatches: function (sumNames, region, amount, idList, callback) {
        var allMatches = [];
        async.forEachOf(idList, function (value, index, callback) {
            var URL = "https://" + region + ".api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + value + "?rankedQueues=TEAM_BUILDER_DRAFT_RANKED_5x5&api_key=" + key;
            request({
                url: URL
                , json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var matchIDs = [];
                    console.log(response.body.matches.length);

                    for (var i = 0; i < response.body.matches.length; i++) {
                        allMatches.push(response.body.matches[i]["matchId"]);
                    }
                    callback();

                } else {
                    console.log("Error!");
                }
            });

        }, function (err) {
            if (err) {
                console.log("better sucks");
            }
            callback(null, sumNames, region, amount, allMatches);

        });



    },

    /* getSimMatches
     *   input : sumNames, region, amount, gameList = an array with all matches played by summoners
     *   output : callback(null, sumNames, region, amount, results) results = amount of games played together
     */
    getSimMatches: function (sumNames, region, amount, gameList, callback) {
        // fix later
        console.log("findind similar matches");
        var needed = amount;
        console.log(needed);
        var sorted_arr = gameList.slice().sort(function (a, b) {
            return a - b;
        });

        var count = 0;
        var results = [];
        console.log(gameList.length);
        for (var i = 0; i < gameList.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                count++;
                if (count === needed) {
                    results.push(sorted_arr[i]);
                }

            } else {
                count = 1;
            }
        }
        console.log(results.length);
        callback(null, sumNames, region, amount, results);
    },
    
    /*  getWinrate
     *  input : sumNames, region, amount, matchIds = array with all matchIds
     *  ouput : callback(sumNames, region, amount, winrate 
     */
    getWinRate: function (sumNames, region, amount, matchIds, callback) {
        console.log("we gettin win rate");
        console.log(matchIds);
        var wins = 0;
        async.forEachOf(matchIds, function (value, index, callback) {

            var URL = "https://" + region + ".api.pvp.net/api/lol/na/v2.2/match/" + value + "?api_key=" + key;

            request({
                url: URL
                , json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log("got a match");
                    var index;

                    for (var i = 0; i < 5; i++) {
                        if (sumNames.indexOf(response.body['participantIdentities'][i]['player']['summonerName']) !== -1) {
                            //console.log(response.body['participantIdentities'][i]['player']['summonerName']);
                            index = 0;
                            break;
                        } else {
                            index = 1;
                        }
                    }

                    var win = response.body.teams[index].winner;
                    if (win) {
                        wins++;
                    }
                    
                    callback();

                } else {
                    if (error){
                        console.log(error);
                    }
                    console.log(response.statusCode);
                }
            });
        }, function (err) {
            if (err) {
                console.log(err);
            }
            callback(null, sumNames, region, amount, [wins / matchIds.length, matchIds.length]);

        });
    }
};

