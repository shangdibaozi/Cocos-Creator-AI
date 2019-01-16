
var BaseGameEntity = cc.Class({
	extends : cc.Component,
	ctor() {
		// every entity must have a unique identifying number
		this.m_ID = 0;
	},

	init : function(val) {
		this.SetID(val);
	},
	
	statics : {
		// this is the next valid ID. Each time a BaseGameEntity is instantiated
		// this value is updated
		m_iNextValidID : 0
	},

	/**
	 * this must be called within the constructor to make sure the ID is set correctly.
	 * It verifies that the value passed to the method is greater or equal to the next valid ID,
	 * before setting the ID and incrementing the next valid ID
	 */
	SetID(val) {
		cc.assert((val >= BaseGameEntity.m_iNextValidID), "<BaseGameEntity::SetID>: invalid ID");
		this.m_ID = val;
		this.m_iNextValidID = this.m_ID + 1;
	},

	Update() {

	},

	ID() {
		return this.m_ID;
	}
});

module.exports = BaseGameEntity;