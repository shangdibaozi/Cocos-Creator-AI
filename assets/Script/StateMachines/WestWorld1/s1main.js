var location_type = require('s1Locations').location_type;
var Miner = require('s1Miner').Miner;
var EntityType = require('s1EntityNames').EntityType;

cc.Class({
	extends : cc.Component,

	properties : {
		minerNode : {
			default : null,
			type : cc.Node
		}
	},

	onLoad : function() {
		var miner = this.minerNode.getComponent('s1Miner');
		miner.init(EntityType.ent_Miner_Bob);
		this.schedule(function() {
			miner.Update();
		}, 2.0, 20, 1);
	}
});