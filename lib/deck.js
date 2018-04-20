
module.exports = (decks, config, user, userID, channelID, message, evt) => {
    var format = require("./format");
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
					embed: format.deck(decoded, cardData, deck, userInfo)
				});
			} else {
				logger.error(cardData['error']);
			}
		});
	});
};
