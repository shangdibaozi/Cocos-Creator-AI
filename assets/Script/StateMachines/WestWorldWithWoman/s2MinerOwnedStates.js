var State = require('s2State');
var GetNameOfEntity = require('s2EntityNames').GetNameOfEntity;
var Locations = require('s2Locations');

var shack = Location.shack;
var goldmine = Location.goldmine;
var bank = Location.bank;
var saloon = Location.saloon;

// the amount of gold a miner must have before he feels comfortable
const ComfortLevel = 5;
// the amount of nuggets a miner can carry
const MaxNuggets = 3;
// above this value a miner is thirsty
const ThirstLevel = 5;
// above this value a miner is sleepy
const ThirednessThreshold = 5;

var EnterMineAndDigForNugget = cc.Class({
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!EnterMineAndDigForNugget._instance) {
				EnterMineAndDigForNugget._instance = new EnterMineAndDigForNugget();
			}
			return EnterMineAndDigForNugget._instance;
		}
	},

	Enter(pMiner) {
		// if the miner is not already located at the goldmine, he must change location to the gold mine
		if(pMiner.Location() != goldmine) {
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Walkin' to the goldmine");
			pMiner.ChangeLocation(goldmine);
		}
	},

	Execute(pMiner) {
		// if the miner is at the goldmine he digs for gold until he is carrying in excess of MaxNuggets.
		// if the gets thirsty during his digging he packs up work for a while and changes state to go to the saloon for a whiskey.
		pMiner.AddToGoldCarried(1);
		pMiner.IncreaseFatigue();
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Pickin' up a nugget");

		// if enough gold mined, go and put it in the bank
		if(pMiner.PocketsFull()) {
			pMiner.GetFSM().ChangeState(VisitBankAndDepositGold.Instance());
		}

		if(pMiner.Thirsty()) {
			pMiner.GetFSM().ChangeState(QuenchThirst.Instance());
		}
	},

	Exit(pMiner) {
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Ah'm leavin' the goldmine with mah pockets full o' sweet gold");
	}
});

var VisitBankAndDepositGold = cc.Class({
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!VisitBankAndDepositGold._instance) {
				VisitBankAndDepositGold._instance = new VisitBankAndDepositGold();
			}
			return VisitBankAndDepositGold._instance;
		}
	},

	Enter(pMiner) {
		// on entry the miner makes sure he is located at the bank
		if(pMiner.Location() != bank) {
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Goin' to the bank. yes siree");
			pMiner.ChangeLocation(bank);
		}
	},

	Execute(pMiner) {
		// deposit the gold
		pMiner.AddToWealth(pMiner.GoldCarried());
		pMiner.SetGoldCarried(0);
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Depositing gold. Total savings now: " + pMiner.Wealth());

		// wealthy enough to have a well earned rest?
		if(pMiner.Wealth() >= ComfortLevel) {
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "WooHoo! Rich enough for now. Back home to mah li'lle lady");
			pMiner.GetFSM().ChangeState(GoHomeAndSleepTilRested.Instance());
		} else { // otherwise get more gold
			pMiner.GetFSM().ChangeState(EnterMineAndDigForNugget.Instance());
		}
	},

	Exit(pMiner) {
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Leavin' the bank");
	}
});

var GoHomeAndSleepTilRested = cc.Class({
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!GoHomeAndSleepTilRested._instance) {
				GoHomeAndSleepTilRested._instance = new GoHomeAndSleepTilRested();
			}
			return GoHomeAndSleepTilRested._instance;
		}
	},

	Enter(pMiner) {
		if(pMiner.Location() != shack) {
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Walkin' home");
			pMiner.ChangeLocation(shack);
		}
	},

	Execute(pMiner) {
		// if miner is not fatigued stat to dig for nuggets again.
		if(!pMiner.Fatigued()) {
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "What a God darn fantastic nap! Time to find more gold");
			pMiner.GetFSM().ChangeState(EnterMineAndDigForNugget.Instance());
		} else {
			// sleep
			pMiner.DecreaseFatigue();
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "ZZZZ... ");
		}
	},

	Exit(pMiner) {
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Leaving the house");
	}
});

var QuenchThirst = cc.Class({
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!QuenchThirst._instance) {
				QuenchThirst._instance = new QuenchThirst();
			}
			return QuenchThirst._instance;
		}
	},

	Enter(pMiner) {
		if(pMiner.Location() != saloon) {
			pMiner.ChangeLocation(saloon);
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Boy, ah sure is thusty! Walking to the saloon");
		}
	},

	Execute(pMiner) {
		if(pMiner.Thirsty()) {
			pMiner.BuyAndDrinkAWhiskey();
			pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "That's mighty fine sippin' liquer");
			pMiner.GetFSM().ChangeState(EnterMineAndDigForNugget.Instance());
		} else {
			pMiner.updateTip('\nERROR!\nERROR!\nERROR!');
		}
	},

	Exit(pMiner) {
		pMiner.updateTip('\n' + GetNameOfEntity(pMiner.ID()) + ': ' + "Leaving the saloon, feelin' good");
	}
});

module.exports = {
	EnterMineAndDigForNugget,
	VisitBankAndDepositGold,
	GoHomeAndSleepTilRested,
	QuenchThirst
};