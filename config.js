var config = {};

config.ALLOW_CARDS = true;
config.ALLOW_DECKS = true;

config.CHANNEL_WHITELIST = [
	"377269780383531011"
];

config.FORMATS = {
	"1": "Wild",
	"2": "Standard"
};

config.RARITIES = {
	"Legendary": {
		"color": "#FDB90E",
		"emoji": ":legendary-gem:"
	},
	"Epic": {
		"color": "#893BA0",
		"emoji": ":epic-gem:"
	},
	"Rare": {
		"color": "#337FDF",
		"emoji": ":rare-gem:"
	},
	"Common": {
		"color": "#8D9695",
		"emoji": ":common-gem:"
	},
	"Free": {
		"color": "#8D9695",
		"emoji": ":common-gem:"
	}
};

config.CLASSES = {
	"Druid": {
		"color": "#7A4929"
	},
	"Hunter": {
		"color": "#02aa00"
	},
	"Mage": {
		"color": "#006eff"
	},
	"Paladin": {
		"color": "#ffff54"
	},
	"Priest": {
		"color": "#c9c9c9"
	},
	"Rogue": {
		"color": "#474747"
	},
	"Shaman": {
		"color": "#42ffe5"
	},
	"Warlock": {
		"color": "#8600c9"
	},
	"Warrior": {
		"color": "#c90000"
	}
};

config.API_URL = "https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/";

module.exports = config;
