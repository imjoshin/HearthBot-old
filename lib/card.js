
// limit number of cards
cardsSent = 0

cards.forEach(function(card) {
    name = card.replace(/\[/g, '').replace(/\]/g, '');
    collectible = config.COLLECTIBLE_ONLY ? "&collectible=1" : "";
    showDetails = config.PRINT_CARD_DETAILS;

    if (name.length < config.CARD_LENGTH_MIN || cardsSent >= config.CARD_LIMIT) {
        return;
    }

    // do flag stuff
    var flags = new RegExp(`(${config.CARD_ONLY_SUFFIX}|${config.SEARCH_TYPE_OVERRIDE_SUFFIX})`, "g");
    if (name.search(flags) > -1) {
        if(name.match(flags).indexOf(config.CARD_ONLY_SUFFIX) > -1 && config.ALLOW_CARD_ONLY) {
            showDetails = false;
            name = name.replace(config.CARD_ONLY_SUFFIX, "");
        }
        if(name.match(flags).indexOf(config.SEARCH_TYPE_OVERRIDE_SUFFIX) > -1 && config.ALLOW_SEARCH_TYPE_OVERRIDE) {
            collectible = "";
            name = name.replace(config.SEARCH_TYPE_OVERRIDE_SUFFIX, "");
        }
    }

    var searchType = showDetails ? '&t=detail' : '&t=card' + (!showDetails ? '&conly' : '');
    var details = "&key=" + auth.KEY + "&u=" + user + "&uid=" + userID + "&cid=" + channelID;

    // get card data
    fetch(config.API_URL + "name=" + name + collectible + searchType + details, {method: 'GET'})
    .then(function(response) {
        return response.json();
    })
    .then(function(card) {
        if (!("error" in card)) {
            // if card length is 1, only the image exists
            if (Object.keys(card).length > 1) {
                embed = formatCard(card);
            } else {
                embed = {
                    "color": config.CLASSES['Neutral']['color'],
                    "image": {
                        "url": card['img']
                    }
                };
            }

            bot.sendMessage({
                to: channelID,
                embed: embed
            });
        }
    });

cardsSent++;
});
