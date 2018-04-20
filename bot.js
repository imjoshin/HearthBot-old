var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth');
var config = require('./config');
var deckstrings = require('deckstrings');
var curveGen = require('hs-mana-curve');
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
			var parseCard = require("./lib/card");
			parseCard(cards, user, userID, channelID, config, fetch);
		}
	}

	if (config.ALLOW_DECKS) {
		var decks = message.match(/AAE(.*?)(=|$)/g);

		if (decks && decks.length) {
			// limit number of decks
			decks = decks.slice(0, config.DECK_LIMIT);

			decks.forEach(function(deck) {
				try {
					decoded = deckstrings.decode(deck);
				} catch (err){
					logger.error("Error decoding deck string: '" + deck + "'");
					return;
				}

				// get list of card ids
				ids = [];
				decoded['cards'].forEach(function(card) {
					ids.push(card[0]);
				});
				decoded['heroes'].forEach(function(hero) {
					ids.push(hero);
				});

				// get card data
				fetch(config.API_URL + "id=" + ids.join(',') + "&key=" + auth.KEY, {method: 'GET'})
				.then(function(response) {
					return response.json();
				})
				.then(function(cardData) {
					userInfo = "&u=" + user + "&uid=" + userID + "&cid=" + channelID;
					if (!("error" in cardData)) {
						bot.sendMessage({
							to: channelID,
							embed: formatDeck(decoded, cardData, deck, userInfo)
						});
					} else {
						logger.error(cardData['error']);
					}
				});
			});
		}
	}
});
