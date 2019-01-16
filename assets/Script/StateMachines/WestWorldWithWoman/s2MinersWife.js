var BaseGameEntity = require('s2BaseGameEntity');
var StateMachine = require('s2StateMachine');
var WifeStates = require('s2MinersWifeOwnedStates');
var DoHouseWork = WifeStates.DoHouseWork;
var WifesGlobalState = WifeStates.WifesGlobalState;
var Message = require('Message');


cc.Class({
	extends : BaseGameEntity,

	properties : {
		msgMgr : Message,
		
	},

	ctor() {
		this.m_pStateMachine = null;
		this.m_Location = null;
		this.m_pStateMachine = new StateMachine(this);
		this.m_pStateMachine.SetCurrentState(DoHouseWork.Instance());
		this.m_pStateMachine.SetGlobalState(WifesGlobalState.Instance());
	},

	Update() {
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

	updateTip : function(msg) {
		cc.log(msg);
		this.msgMgr.addMsg(msg, cc.Color.GREEN);
	}
});