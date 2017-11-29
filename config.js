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
	"Recruit",
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

// only use whitelist OR blacklist
config.CHANNEL_WHITELIST = [];
config.CHANNEL_BLACKLIST = [
	"377296505096110080",
	"301092519981088771"
];

// Emoji Settings
config.ATTACK_EMOJI = "<:attack:385274433830649869>";
config.HEALTH_EMOJI = "<:health:385274434203680788>";
config.WEAPON_ATTACK_EMOJI = "<:weapon_attack:385567336272363530>";
config.WEAPON_HEALTH_EMOJI = "<:weapon_dur:385567315330072586>";

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
		"icon": "https://jjdev.io/hearthbot/img/Druid.png"
	},
	"Hunter": {
		"color": 0x027c00,
		"icon": "https://jjdev.io/hearthbot/img/Hunter.png"
	},
	"Mage": {
		"color": 0x006eff,
		"icon": "https://jjdev.io/hearthbot/img/Mage.png"
	},
	"Paladin": {
		"color": 0xcec400,
		"icon": "https://jjdev.io/hearthbot/img/Paladin.png"
	},
	"Priest": {
		"color": 0xc9c9c9,
		"icon": "https://jjdev.io/hearthbot/img/Priest.png"
	},
	"Rogue": {
		"color": 0x474747,
		"icon": "https://jjdev.io/hearthbot/img/Rogue.png"
	},
	"Shaman": {
		"color": 0x42ffe5,
		"icon": "https://jjdev.io/hearthbot/img/Shaman.png"
	},
	"Warlock": {
		"color": 0x8855b2,
		"icon": "https://jjdev.io/hearthbot/img/Warlock.png"
	},
	"Warrior": {
		"color": 0xa80000,
		"icon": "https://jjdev.io/hearthbot/img/Warrior.png"
	},
	"Neutral": {
		"color": 0x34363B,
		"icon": ""
	}
};

config.API_URL = "http://jjdev.io/hearthbot/data.php?";

module.exports = config;
