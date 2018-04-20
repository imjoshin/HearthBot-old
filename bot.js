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

function formatDeck(deckData, cardData, deck, userInfo) {
	var blankField = {"value": ""};

	var classCards = [];
	var neutralCards = [];
	var dust = 0;
	var classes = [];
	var curve = [0,0,0,0,0,0,0,0];

	deckData['heroes'].forEach(function(hero) {
		classes.push(cardData[hero]['class']);
	});

	var deckClass = classes.join(',');

	deckData['cards'].forEach(function(card) {
		cardData[card[0]]['count'] = card[1];

		if (cardData[card[0]]['class'] != 'Neutral') {
			classCards.push(cardData[card[0]])
		} else {
			neutralCards.push(cardData[card[0]])
		}

		rarity = cardData[card[0]]['rarity'];
		dust += config.RARITIES[rarity]['dust'] * card[1];
		
		curve[card_cost] += cardData[card[0]]['count'];
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
		classCardsText.push(formatDeckCard(card));
	});
	neutralCards.forEach(function(card) {
		neutralCardsText.push(formatDeckCard(card));
	});

	var format = deckData['format'] == 1 ? "Wild" : "Standard";

	// log deck in db (will probably replace with parsing on api side eventually)
	var url = config.API_URL + userInfo +
		"&deck=" + deck +
		"&f=" + format +
		"&c=" + deckClass +
		"&d=" + dust +
		"&key=" + auth.KEY;

	fetch(url, {method: 'GET'})

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
		},
		{
			"name": "Mana Curve",
			"value": "```Perl"+curveGen(curve)+"```",
			"inline": false
		}
	];

	return {
		"author": {
			"name": deckClass + " (" + format + ")",
			"icon_url": (classes.length == 1 ? config.CLASSES[deckClass]['icon'] : "")
		},
		"color": (classes.length == 1 ? config.CLASSES[deckClass]['color'] : config.CLASSES['Neutral']['color']),
		"fields": fields,
		"footer": {
			"icon_url": "http://joshjohnson.io/images/dust.png",
			"text": dust
		}
	};
}

function formatDeckCard(card) {
	var cost = card['cost'] in config.MANA_EMOJI ? config.MANA_EMOJI[card['cost']] : card['cost']
	var rarity = config.RARITIES[card['rarity']]['emoji'];
	return card['count'] + "x " + card['name'];
}
