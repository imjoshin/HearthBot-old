var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth');
var config = require('./config');
var deckstrings = require('deckstrings');
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

// reconnect
bot.on('disconnect', function(erMsg, code) {
    logger.info('----- Bot disconnected from Discord with code ' + code + 'for reason: ' + erMsg + ' -----');
    bot.connect();
});

bot.on('message', function (user, userID, channelID, message, evt) {
	// check if we are allowed to post here and this isn't a bot message
	if (
		config.CHANNEL_WHITELIST.length && config.CHANNEL_WHITELIST.indexOf(channelID) < 0 ||
		config.CHANNEL_BLACKLIST.length && config.CHANNEL_BLACKLIST.indexOf(channelID) >= 0 ||
		userID == bot.id
	) {
		return;
	};

	// check for [[card]]
	if (config.ALLOW_CARDS) {
		var cards = message.match(/\[\[(.*?)\]\]/g);
		if (cards && cards.length) {
			var doCard = require("./lib/card");
			doCard(cards, config, fetch, user, userID, channelID, message, evt);
		}
	}

	if (config.ALLOW_DECKS) {
		var decks = message.match(/AAE(.*?)(=|$)/g);

		if (decks && decks.length) {
			var doDeck = require("./lib.deck");
			doDeck(cards, config, fetch, user, userID, channelID, message, evt);
		}
	}
});
