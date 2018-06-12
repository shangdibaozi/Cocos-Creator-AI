var location_type = require('Locations').location_type;
var Miner = require('Miner').Miner;
var EntityType = require('EntityNames').EntityType;

cc.Class({
	extends : cc.Component,

	properties : {
		minerNode : {
			default : null,
			type : cc.Node
		}
	},

	onLoad : function() {
		var miner = this.minerNode.getComponent('Miner');
		miner.init(EntityType.ent_Miner_Bob);
		this.schedule(function() {
			miner.Update();
		}, 2.0, 20, 1);
	}
});