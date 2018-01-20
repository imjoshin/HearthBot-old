/**
 * Card attribute search
 * @param {string} input the search string
 */
module.exports = function(input) {
    var Discord = require('discord.io');
    var logger = require('winston');
    var config = require('./config');
    var fetch = require('node-fetch');
    fetch.Promise = require('bluebird');

    // will only return first result
    String.prototype.matchWithArray = function(array) {
        var r = {bool, str = []};
        var regex = new RegExp(array.join("|"), "gi");
        r.bool = (this.search(regex) >= 0);
        this.match(regex).forEach(v => {
            r.str.push(v);
        });
        return r;
    };

    // to make sure the trigger word is valid, it should be by itself and not part of another word
    if(input.search(new RegExp(`\b(${config.search.ALL.join("|")})\b`, "i")) == -1)
        return;

    var toSearch = {};
    var searchResult = [];
    var pushSearch = function(array, s) {
        if(input.matchWithArray(array).bool) {
            if(!toSearch[s]) toSearch[s] = new Array();
            input.matchWithArray(array).str.forEach(v => {
                toSearch[s].push(v);
            });
        }
    };

    // if a search word is found, add it to the toSearch object
    pushSearch(config.search.RARITY, "rarity");
    pushSearch(config.search.TYPE, "type");
    pushSearch(config.search.CLASS, "class");
    pushSearch(config.search.TEXT, "text");
    if(input.includes("/")) {
        var numbers = input.match(/\d+\/\d+/)[0];
        toSearch.attack = parseInt(numbers.slice(0, numbers.indexOf("/")));
        toSearch.health = parseInt(numbers.slice(numbers.indexOf("/")+1));
    }
    if(input.includes("mana")) {
        var mana = input.match(/\d+\smana\b/i)[0];
        toSearch.cost = parseInt(mana.match(/\d+/)[0]);
    }

    // use the card database specified in config.SEARCH_URL to search for cards that meet the search requirements
    fetch(config.SEARCH_URL)
    .then(function(result) {
        return result.json();
    })
    .then(function(search_cards) {
        for(var prop in search_cards) {
            var isMatch = true;
            for(var attribute in toSearch) {
                if(isNaN(toSearch[attribute])) isMatch = (isMatch && cards[prop].toLowerCase().includes(toSearch[attribute].toLowerCase()));
                else isMatch = (isMatch && cards[prop] == toSearch[attribute]);
                if(config.COLLECTIBLE_ONLY && !cards[prop].collectible) isMatch = false;
            }
            if(isMatch && searchResult.length <= config.SEARCH_RESULT_LIMIT) {
                searchResult.push(search_cards[prop].name);
            }
        }
    });

    // return an array of card names that meet the requirements
    return searchResult;
}
