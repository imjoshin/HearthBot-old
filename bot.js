var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth');
var config = require('./config');
var fetch = require('node-fetch');
fetch.Promise = require('bluebird');

logger.level = 'debug';
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

var bot = new Discord.Client({
   token: auth.TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
});

bot.on('message', function (user, userID, channelID, message, evt) {
	// check if we are allowed to post here
	if (config.CHANNEL_WHITELIST.length && config.CHANNEL_WHITELIST.indexOf(channelID) < 0) {
		return;
	};

	// check for [[card]]
	if (config.ALLOW_CARDS) {
		var cards = message.match(/\[\[(.*?)\]\]/g);
		if (cards && cards.length) {
			cards.forEach(function(card) {
				name = card.replace(/\[/g, '').replace(/\]/g, '');

				// search API
				headers = {"X-Mashape-Key": auth.API_KEY};
				fetch(config.API_URL + name, {method: 'GET', headers: headers})
				.then(function(response) {
					return response.json();
				})
				.then(function(receivedCards) {
					if (receivedCards.length) {
						receivedCards.some(function(testCard) {
							testName = testCard['name'].toLowerCase();
							if (testName == name) {
								// send image
								bot.sendMessage({
									to: channelID,
									message: testCard['img']
								});

								// break loop
								return true;
							}
						});
					}
				});
			});
		}
	}
});
