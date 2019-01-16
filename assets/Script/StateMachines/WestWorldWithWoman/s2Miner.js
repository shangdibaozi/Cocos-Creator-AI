var BaseGameEntity = require('s2BaseGameEntity');
var StateMachine = require('s2StateMachine');
var MinerStates = require('s2MinerOwnedStates');
var GoHomeAndSleepTilRested = MinerStates.GoHomeAndSleepTilRested;
var Message = require('Message');

// the amount of gold a miner must have before he feels comfortable
const ComfortLevel = 5;
// the amount of nuggets a miner can carry
const MaxNuggets = 3;
// above this value a miner is thirsty
const ThirstLevel = 5;
// above this value a miner is sleepy
const ThirednessThreshold = 5;

cc.Class({
	extends : BaseGameEntity,

	properties : {
		msgMgr : Message,
	},

	ctor() {
		this.m_pStateMachine = null;
		this.m_Location = null;
		this.m_iGoldCarried = 0;
		this.m_iMoneyInBank = 0;
		this.m_iThirst = 0;
		this.m_iFatigue = 0;

		this.m_pStateMachine = new StateMachine(this);
		this.m_pStateMachine.SetCurrentState(GoHomeAndSleepTilRested.Instance());
	},

	Update() {
		this.m_iThirst += 1;
		this.m_pStateMachine.Update();
	},

	GetFSM() {
		return this.m_pStateMachine;
	},

	Location() {
		return this.m_Location;
	},

	ChangeLocation(loc) {
		this.m_Location = loc;
	},

	GoldCarried() {
		return this.m_iGoldCarried;
	},

	SetGoldCarried(val) {
		this.m_iGoldCarried = val;
	},

	AddToGoldCarried(val) {
		this.m_iGoldCarried += val;
		if(this.m_iGoldCarried < 0) {
			this.m_iGoldCarried = 0;
		}
	},

	PocketsFull() {
		return this.m_iGoldCarried >= MaxNuggets;
	},

	Fatigued() {
		return this.m_iFatigue > ThirednessThreshold;
	},

	DecreaseFatigue() {
		this.m_iFatigue--;
	},

	IncreaseFatigue() {
		this.m_iFatigue++;
	},

	Wealth() {
		return this.m_iMoneyInBank;
	},

	SetWealth(val) {
		this.m_iMoneyInBank = val;
	},

	AddToWealth(val) {
		this.m_iMoneyInBank += val;
		if(this.m_iMoneyInBank < 0) {
			this.m_iMoneyInBank = 0;
		}
	},

	Thirsty() {
		return this.m_iThirst >= ThirstLevel;
	},

	BuyAndDrinkAWhiskey() {
		this.m_iThirst = 0;
		this.m_iMoneyInBank -= 2;
	},

	updateTip : function(msg) {
		cc.log(msg);
		this.msgMgr.addMsg(msg, cc.Color.RED);
	}
});