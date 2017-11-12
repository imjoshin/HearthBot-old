var config = {};

// Card config
config.ALLOW_CARDS = true;
config.CARD_LIMIT = 4; // max cards to print from one message
config.CARD_LENGTH_MIN = 3; // minimum card string length to search
config.COLLECTIBLE_ONLY = true; // only show collectible cards
config.PRINT_CARD_DETAILS = true; // print details instead of the card image
config.ALLOW_CARD_ONLY = true; // allow suffix to only show card
config.CARD_ONLY_SUFFIX = "+c"; // suffix to only show card
config.KEYWORDS = [ // keywords to bold
	"Adapt",
	"Battlecry",
	"Charge",
	"Choose One",
	"Combo",
	"Counter",
	"Deathrattle",
	"Discover",
	"Divine Shield",
	"Enrage",
	"Freeze",
	"Immune",
	"Inspire",
	"Lifesteal",
	"Mega-Windury",
	"Overload",
	"Poisonous",
	"Quest",
	"Secret",
	"Silence",
	"Stealth",
	"Spell Damage",
	"Taunt",
	"Windfury"
]

// Deck config
config.ALLOW_DECKS = true;
config.DECK_LIMIT = 1; // max decks to print from one message

// Misc Settings
config.CHANNEL_WHITELIST = [
	"377269780383531011"
];

config.FORMATS = {
	"1": "Wild",
	"2": "Standard"
};

config.RARITIES = {
	"Legendary": {
		"color": 0xFDB90E,
		"emoji": ":legendary-gem:",
		"dust": "1600",
	},
	"Epic": {
		"color": 0x893BA0,
		"emoji": ":epic-gem:",
		"dust": "400",
	},
	"Rare": {
		"color": 0x337FDF,
		"emoji": ":rare-gem:",
		"dust": "100",
	},
	"Common": {
		"color": 0x8D9695,
		"emoji": ":common-gem:",
		"dust": "40",
	},
	"Free": {
		"color": 0x8D9695,
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
