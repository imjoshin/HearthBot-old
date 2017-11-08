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

bot.on('message', function (user, userID, channelID, message, evt) {
	// check if we are allowed to post here and this isn't a bot message
	if (config.CHANNEL_WHITELIST.length && config.CHANNEL_WHITELIST.indexOf(channelID) < 0 || userID == bot.id) {
		return;
	};

	// check for [[card]]
	if (config.ALLOW_CARDS) {
		var cards = message.match(/\[\[(.*?)\]\]/g);
		if (cards && cards.length) {
			// limit number of cards
			cards = cards.slice(0, config.CARD_LIMIT);

			cards.forEach(function(card) {
				name = "name=" + card.replace(/\[/g, '').replace(/\]/g, '');
				collectible = config.COLLECTIBLE_ONLY ? "&collectible=1" : "";

				// get card data
				fetch(config.API_URL + name + collectible, {method: 'GET'})
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

	if (config.ALLOW_DECKS) {
		var decks = message.match(/AAE(.*?)=/g);

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
					ids.push(hero[0]);
				});

				// get card data
				fetch(config.API_URL + "id=" + ids.join(','), {method: 'GET'})
				.then(function(response) {
					return response.json();
				})
				.then(function(cardData) {
					if (!("error" in cardData)) {
						bot.sendMessage({
							to: channelID,
							message: formatDeck(decoded, cardData)
						});
					} else {
						logger.error(cardData['error']);
					}
				});
			});
		}
	}
});

function formatDeck(deckData, cardData) {
	var print = "";
	deckData['cards'].forEach(function(card) {
		print += card[1] + "x " + cardData[card[0]]['name'] + " (" + cardData[card[0]]['cost'] + ")" + "\n";
	});

	return print;
}
