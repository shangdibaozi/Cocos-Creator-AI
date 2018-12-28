var State = require('s1State');
var BaseGameEntity = require('s1BaseGameEntity');
var location_type = require('s1Locations').location_type;
var MinerStates = require('s1MinerOwnedStates');
var constVal = require('s1Constants');

cc.Class({
	extends : BaseGameEntity,

	properties : {
		tip : {
			default : null,
			type : cc.Label
		}
	},

	/**
	 * BaseGameEntity的ctor会被自动调用
	 * @param  {[type]} id [description]
	 */
	ctor : function() { 
		this.m_pCurrentState = MinerStates.GoHomeAndSleepTilRested.Instance();
		this.m_Location = location_type.shack;
		this.m_iGoldCarried = 0; // how many nuggets the miner has in his pockets
		this.m_iMoneyInBank = 0;
		this.m_iThirst = 0; // the higher the value, the thirstier the miner
		this.m_iFatigue = 0; // the higher the value, the more tired the miner
	},

	// this must be implemented
	Update : function() {
		this.m_iThirst += 1;
		if(this.m_pCurrentState) {
			this.m_pCurrentState.Execute(this);
		}
	},

	/**
	 * this method changes the current state to the new state. It first
	 * calls the Exit() method of the current state, then assigns the new 
	 * state to m_pCurrentState and finally calls the Entry() method of the new state.
	 * @param {[type]} new_state [description]
	 */
	ChangeState : function(pNewState) {
		// make sure both states are both valid before attempting to call their methods
		cc.assert(this.m_pCurrentState && pNewState, "");

		// call the exit method of the existing state
		this.m_pCurrentState.Exit(this);
		// change state to the new state
		this.m_pCurrentState = pNewState;
		// call the entry method of the new state
		this.m_pCurrentState.Enter(this);
	},

	Location : function() {
		return this.m_Location;
	},

	ChangeLocation : function(loc) {
		this.m_Location = loc;
		if(loc === location_type.shack) {
			this.node.setPosition(380, 218);
		} else if(loc === location_type.goldmine) {
			this.node.setPosition(382, -239);
		} else if(loc === location_type.bank) {
			this.node.setPosition(-402, -242);
		} else if(loc === location_type.saloon) {
			this.node.setPosition(-397, 218);
		}
	},

	GoldCarried : function() {
		return this.m_iGoldCarried;
	},

	SetGoldCarried : function(val) {
		this.m_iGoldCarried = val;
	},

	AddToGoldCarried : function(val) {
		this.m_iGoldCarried += val;
		if(this.m_iGoldCarried < 0) {
			this.m_iGoldCarried = 0;
		}
	},

	PocketsFull : function() {
		return this.m_iGoldCarried >= constVal.MaxNuggets;
	},

	Fatigued : function() {
		if(this.m_iFatigue > constVal.ThirednessThreshold) {
			return true;
		} else {
			return false;
		}
	},

	DecreaseFatigue : function() {
		this.m_iFatigue -= 1;
	},

	IncreaseFatigue : function() {
		this.m_iFatigue += 1;
	},

	Wealth : function() {
		return this.m_iMoneyInBank;
	},

	SetWealth : function(val) {
		this.m_iMoneyInBank = val;
	},

	AddToWealth : function(val) {
		this.m_iMoneyInBank += val;
		if(this.m_iMoneyInBank < 0) {
			this.m_iMoneyInBank = 0;
		}
	},

	Thirsty : function() {
		if(this.m_iThirst >= constVal.ThirstLevel) {
			return true;
		} else {
			return false;
		}
	},

	BuyAndDrinkAWhiskey : function() {
		this.m_iThirst = 0;
		this.m_iMoneyInBank -= 2;
	},

	updateTip : function(msg) {
		cc.log(msg);
		this.tip.string += msg + '\n';
	}
});

