var config = {};

config.ALLOW_CARDS = true;
config.CARD_LIMIT = 4;
config.CARD_LENGTH_MIN = 3;
config.COLLECTIBLE_ONLY = true;
config.PRINT_CARD_DETAILS = true;

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
		"color": 0x7A4929,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Druid.png"
	},
	"Hunter": {
		"color": 0x027c00,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Hunter.png"
	},
	"Mage": {
		"color": 0x006eff,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Mage.png"
	},
	"Paladin": {
		"color": 0xcec400,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Paladin.png"
	},
	"Priest": {
		"color": 0xc9c9c9,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Priest.png"
	},
	"Rogue": {
		"color": 0x474747,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Rogue.png"
	},
	"Shaman": {
		"color": 0x42ffe5,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Shaman.png"
	},
	"Warlock": {
		"color": 0x8855b2,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Warlock.png"
	},
	"Warrior": {
		"color": 0xa80000,
		"icon": "http://joshjohnson.io/projects/hearthdetect/img/Warrior.png"
	},
	"Neutral": {
		"color": 0x34363B,
		"icon": ""
	}
};

config.API_URL = "http://joshjohnson.io/projects/hearthdetect/data.php?";

module.exports = config;
