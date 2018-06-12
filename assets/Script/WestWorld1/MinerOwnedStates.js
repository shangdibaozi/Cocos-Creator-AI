var State = require('State');
var location_type = require('Locations').location_type;
var GetNameOfEntity = require('EntityNames').GetNameOfEntity;
var Miner = require('Miner');
/**
 * In this state the miner will walk to a goldmine and pick up a nugget
 * of gold. If the miner already has a nugget of gold he'll change state
 * to VisitBankAndDepositGold. If he gets thirsty he'll change state to
 * QuenchThirst
 */
var EnterMineAndDigForNugget = cc.Class({
	name : 'EnterMineAndDigForNugget',
	extends : State,

	statics : {
		_instance : null,
		Instance : function() {
			if(EnterMineAndDigForNugget._instance === null) {
				EnterMineAndDigForNugget._instance = new EnterMineAndDigForNugget();
			}
			return EnterMineAndDigForNugget._instance;
		}	
	},

	Enter : function(pMiner) {
		// if the miner is not already located at the goldmine, he must change location to the gold mine
		if(pMiner.Location() != location_type.goldmine) {
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Walkin' to the goldmner");

			pMiner.ChangeLocation(location_type.goldmine);
		}
	},

	Execute : function(pMiner) {
		// the miner digs for gold until he is carrying in excess of MaxNuggets.
		// If the gets thirsty during his digging the packs up work for a while and
		// changes state to go to the saloon for a whiskey.
		pMiner.AddToGoldCarried(1);
		pMiner.IncreaseFatigue();
		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Pickin' up a nugget");

		if(pMiner.PocketsFull()) {
			pMiner.ChangeState(VisitBankAndDepositGold.Instance());
		}

		if(pMiner.Thirsty()) {
			pMiner.ChangeState(QuenchThirst.Instance());
		}
	},

	Exit : function(pMiner) {
		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Ah'm leavin' the goldmine with mah pockets full o' sweet gold");
	}
});

/**
 * Entity will go to a bank and deposit any nuggets he is carrying. If the
 * miner is subsequently wealthy enough he'll walk home, otherwise he'll
 * keep going to get more gold
 */
var VisitBankAndDepositGold = cc.Class({
	name : 'VisitBankAndDepositGold',
	extends : State,

	statics : {
		_instance : null,
		Instance : function() {
			if(VisitBankAndDepositGold._instance === null) {
				VisitBankAndDepositGold._instance = new VisitBankAndDepositGold();
			}
			return VisitBankAndDepositGold._instance;
		}
	},

	Enter : function(pMiner) {
		// on entry the miner makes sure he is located at the bank
		if(pMiner.Location() != location_type.bank) {
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Goin' to the bank. Yes siree");
			pMiner.ChangeLocation(location_type.bank);
		}
	},

	Execute : function(pMiner) {
		// deposit the gold
		pMiner.AddToWealth(pMiner.GoldCarried());
		pMiner.SetGoldCarried(0);

		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Depositing gold. Total savings now:" << pMiner.Wealth());

		// wealthy enough to have a well earned rest?
		if(pMiner.Wealth() >= Miner.ComfortLevel) {
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "WooHoo! Rich enough for now. Back home to mah li'lle lady");
			pMiner.ChangeState(GoHomeAndSleepTilRested.Instance());
		} else {
			pMiner.ChangeState(EnterMineAndDigForNugget.Instance());
		}

	},

	Exit : function(pMiner) {
		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Leavin' the bank");
	}
});

/**
 * miner will go home and sleep until his fatigue is decreased sufficiently
 */
var GoHomeAndSleepTilRested = cc.Class({
	name : 'GoHomeAndSleepTilRested',
	extends : State,

	statics : {
		_instance : null,
		Instance : function() {
			if(GoHomeAndSleepTilRested._instance === null) {
				GoHomeAndSleepTilRested._instance = new GoHomeAndSleepTilRested();
			}
			return GoHomeAndSleepTilRested._instance;
		}
	},

	Enter : function(pMiner) {
		if(pMiner.Location() !== location_type.shack) {
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Walkin' home");
			pMiner.ChangeLocation(location_type.shack);
		}
	},

	Execute : function(pMiner) {
		// if miner is not fatigued start to dig for nuggets again.
		if(!pMiner.Fatigued()) {
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "What a God darn fantastic nap! Time to find more gold");
			pMiner.ChangeState(EnterMineAndDigForNugget.Instance());
		} else {
			pMiner.DecreaseFatigue();
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "ZZZZ... ");
		}
	},

	Exit : function(pMiner) {
		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " << "Leaving the hourse");
	}
});

var QuenchThirst = cc.Class({
	name : 'QuenchThirst',
	extends : State,

	statics : {
		_instance : null,
		Instance : function() {
			if(QuenchThirst._instance === null) {
				QuenchThirst._instance = new QuenchThirst();
			}
			return QuenchThirst._instance;
		}
	},

	Enter : function(pMiner) {
		if(pMiner.Location() !== location_type.saloon) {
			pMiner.ChangeLocation(location_type.saloon);
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Boy, ah sure is thusty! Walking to the saloon");
		}
	},

	Execute : function(pMiner) {
		if(pMiner.Thirsty()) {
			pMiner.BuyAndDrinkAWhiskey();
			pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "That's mighty fine sippin liquer");
			pMiner.ChangeState(EnterMineAndDigForNugget.Instance());
		} else {
			pMiner.updateTip("ERROR!ERROR!ERROR!");
		}
	},

	Exit : function(pMiner) {
		pMiner.updateTip(GetNameOfEntity(pMiner.ID()) + " : " + "Leaving the saloon, feelin' good");
	}
});

module.exports = {
	EnterMineAndDigForNugget : EnterMineAndDigForNugget,
	VisitBankAndDepositGold : VisitBankAndDepositGold,
	GoHomeAndSleepTilRested : GoHomeAndSleepTilRested,
	QuenchThirst : QuenchThirst
};