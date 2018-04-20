module.exports.card = function(card) {
	cardText = card['text'].replace(/\[x\]/g, "").replace(/\\n|_/g, " ").replace(/\$([0-9]+)/g, "$1").replace(/\(([0-9]+)\)/g, "$1");

	// bold keywords
	config.KEYWORDS.forEach(function(keyword) {
		if (cardText.indexOf(keyword) >= 0)
		{
			if (keyword == "Recruit") {
				var regex = new RegExp("^(?!Silver Hand )(Recruit[\.|:]?)", "g");
			} else {
				var regex = new RegExp("(" + keyword + "[\.|:]?)", "g");
			}
			cardText = cardText.replace(regex, "**$1**");
		}
	});

	// get details
	var type = "**Type:** " + card['type'] + "\n";
	var classt = "**Class:** " + card['class'] + "\n";
	var rarity = "**Rarity:** " + card['rarity'];

	// get stats
	var attackEmoji = card['type'] == 'Weapon' ? config.WEAPON_ATTACK_EMOJI : config.ATTACK_EMOJI;
	var healthEmoji = card['type'] == 'Weapon' ? config.WEAPON_HEALTH_EMOJI : config.HEALTH_EMOJI;
	var attack = 'attack' in card && card['attack'] != null ? (attackEmoji + ' **' + card['attack'] + '**  ') : '';
	var health = 'health' in card && card['health'] != null ? (healthEmoji + ' **' + card['health'] + '**  ') : '';
	var stats = (attack != '' || health != '') ? (attack + health + "\n\n") : "";

	// other info
	var text = cardText != '' ? ("\n\n*" + cardText + "*") : '';
	var set = "Set: " + card['set'];

	return {
		"author": {
			"name": card['name'],
			"icon_url": "https://jjdev.io/hearthbot/img/mana-" + card['cost'] + ".png"
		},
		"color": config.RARITIES[card['rarity']]['color'],
		"description": stats + type + classt + rarity + text,
		"footer": {
			"text": set
		},
		"thumbnail": {
			"url": card['img']
		}
	}
};

module.exports.deckCard = function(card) {
	var cost = card['cost'] in config.MANA_EMOJI ? config.MANA_EMOJI[card['cost']] : card['cost']
	var rarity = config.RARITIES[card['rarity']]['emoji'];
	return card['count'] + "x " + card['name'];
};

module.exports.deck = function(deckData, cardData, deck, userInfo) {
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
};
