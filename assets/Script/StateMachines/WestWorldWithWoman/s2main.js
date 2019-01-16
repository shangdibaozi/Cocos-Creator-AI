
cc.Class({
	extends : cc.Component,

	properties : {
		miner : cc.Node,
		minersWife : cc.Node
	},

	onLoad() {
		let s2Miner = this.miner.getComponent('s2Miner');
		let s2MinersWife = this.minersWife.getComponent('s2MinersWife');

		this.schedule(function() {
			s2Miner.Update();
			s2MinersWife.Update();
		}, 2.0, 20, 1);
	}
});