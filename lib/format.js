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
}
