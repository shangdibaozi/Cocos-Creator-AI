
var BaseGameEntity = cc.Class({
	extends : cc.Component,

	ctor : function() {
		this.m_ID = 0;
	},

	init : function(val) {
		this.SetID(val);
	},

	statics : {
		m_iNextValidID : 0 // this is the next valid ID. Each time a BaseGameEntity is instantiated. this value is updated
	},

	/**
	 * this must be called within the constructor to make sure the ID is set correctly. It verifies that the value passed
	 * to the method is greater or equal to the next valid ID, before setting the ID and incrementing the next valid ID
	 * @param {[type]} val [description]
	 */
	SetID : function(val) {
		cc.assert(val >= BaseGameEntity.m_iNextValidID, 'BaseGameEntity::SetID: invalid ID');
		this.m_ID = val;
		BaseGameEntity.m_iNextValidID = this.m_ID + 1;
	},

	// all entities must implement an update function
	Update : function() {

	},

	ID : function() {
		return this.m_ID;
	}
});