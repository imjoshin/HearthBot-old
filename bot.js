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
    logger.info('----- Bot disconnected from Discord with code' + code + 'for reason:' + erMsg + ' -----');
    bot.connect();
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
			cardsSent = 0

			cards.forEach(function(card) {
				name = card.replace(/\[/g, '').replace(/\]/g, '');
				collectible = config.COLLECTIBLE_ONLY ? "&collectible=1" : "";

				if (name.length < config.CARD_LENGTH_MIN || cardsSent >= config.CARD_LIMIT) {
					return
				}

				// get card data
				fetch(config.API_URL + "name=" + name + collectible, {method: 'GET'})
				.then(function(response) {
					return response.json();
				})
				.then(function(card) {
					if (!("error" in card)) {
						bot.sendMessage({
							to: channelID,
							embed: {
								"image": {
									"url": card['img']
								}
							}
						});
					}
				});

				cardsSent++;
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
							embed: formatDeck(decoded, cardData)
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
	var blankField = {"value": ""};

	var classCards = [];
	var neutralCards = [];

	deckData['cards'].forEach(function(card) {
		cardData[card[0]]['count'] = card[1];

		if (cardData[card[0]]['class'] != 'Neutral') {
			classCards.push(cardData[card[0]])
		} else {
			neutralCards.push(cardData[card[0]])
		}
	});

	var classCardsText = [];
	var neutralCardsText = [];

	classCards.sort(function(a, b) {
	    return a['cost'] - b['cost'];
	});
	neutralCards.sort(function(a, b) {
	    return a['cost'] - b['cost'];
	});

	classCards.forEach(function(card) {
		classCardsText.push(formatCard(card));
	});
	neutralCards.forEach(function(card) {
		neutralCardsText.push(formatCard(card));
	});

	var fields = [
		{
			"name": "Class Cards",
			"value": classCardsText.join('\n'),
			"inline": true
		},
		{
			"name": "Neutral Cards",
			"value": neutralCardsText.join('\n'),
			"inline": true
		}
	];

	return {
		"fields": fields
	};
}

function formatCard(card) {
	return card['count'] + "x [" + card['name'] + "](" + card['img'] + ") (" + card['cost'] + ")";
}
