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
			
			// limit number of cards
			cards = cards.slice(0, config.CARD_LIMIT);

			cards.forEach(function(card) {
				name = card.replace(/\[/g, '').replace(/\]/g, '');

				// get card data
				fetch(config.API_URL + name, {method: 'GET'})
				.then(function(response) {
					return response.json();
				})
				.then(function(card) {
					if (!("error" in card)) {
						bot.sendMessage({
							to: channelID,
							message: card['img']
						});
					}
				});
			});
		}
	}
});
