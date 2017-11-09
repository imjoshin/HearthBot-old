var config = {};

config.ALLOW_CARDS = true;
config.CARD_LIMIT = 4;
config.CARD_LENGTH_MIN = 3;
config.COLLECTIBLE_ONLY = true;

config.ALLOW_DECKS = true;
config.DECK_LIMIT = 1;

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
		"emoji": ":legendary-gem:",
		"dust": "1600",
	},
	"Epic": {
		"color": "#893BA0",
		"emoji": ":epic-gem:",
		"dust": "400",
	},
	"Rare": {
		"color": "#337FDF",
		"emoji": ":rare-gem:",
		"dust": "100",
	},
	"Common": {
		"color": "#8D9695",
		"emoji": ":common-gem:",
		"dust": "40",
	},
	"Free": {
		"color": "#8D9695",
		"emoji": ":common-gem:",
		"dust": "0",
	}
};

config.CLASSES = {
	"Druid": {
		"color": 0x7A4929
	},
	"Hunter": {
		"color": 0x02aa00
	},
	"Mage": {
		"color": 0x006eff
	},
	"Paladin": {
		"color": 0xffff54
	},
	"Priest": {
		"color": 0xc9c9c9
	},
	"Rogue": {
		"color": 0x474747
	},
	"Shaman": {
		"color": 0x42ffe5
	},
	"Warlock": {
		"color": 0x8600c9
	},
	"Warrior": {
		"color": 0xc90000
	}
};

config.API_URL = "http://joshjohnson.io/projects/hearthdetect/data.php?";

module.exports = config;
