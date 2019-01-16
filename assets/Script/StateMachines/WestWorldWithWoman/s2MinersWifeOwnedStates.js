var State = require('s2State');
var utils = require('utils');
var GetNameOfEntity = require('s2EntityNames').GetNameOfEntity;

var RandInt = utils.RandInt;
var RandFloat = utils.RandFloat;

var WifesGlobalState = cc.Class({
	name : 'WifesGlobalState',
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!WifesGlobalState._instance) {
				WifesGlobalState._instance = new WifesGlobalState();
			}
			return WifesGlobalState._instance;
		}
	},

	Enter(wife) {

	},

	Execute(wife) {
		// 1 in 10 chance of needing the bathroom
		if(RandFloat() < 0.1) {
			wife.GetFSM().ChangeState(VisitBathroom.Instance());
		}
	},

	Exit(wife) {

	}
});

var DoHouseWork = cc.Class({
	name : 'DoHouseWork',
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!DoHouseWork._instance) {
				DoHouseWork._instance = new DoHouseWork();
			}
			return DoHouseWork._instance;
		}
	},

	Enter(wife) {

	},

	Execute(wife) {
		switch(RandInt(0, 2)) {
			case 0:
				wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Moppin' the floor");
				break;
			case 1:
				wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Washin' the dishes");
				break;
			case 2:
				wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Makin' the bed");
				break;
		}
	},

	Exit(wife) {

	}
});

var VisitBathroom = cc.Class({
	name : 'VisitBathroom',
	extends : State,

	statics : {
		_instance : null,
		Instance() {
			if(!VisitBathroom._instance) {
				VisitBathroom._instance = new VisitBathroom();
			}
			return VisitBathroom._instance;
		}
	},

	Enter(wife) {
		wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Walkin' to the can. Need to powda mah pretty li'lle nose");
	},

	Execute(wife) {
		wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Ahhhh! Seet felief!");
		wife.GetFSM().RevertToPreviousState();
	},

	Exit(wife) {
		wife.updateTip('\n' + GetNameOfEntity(wife.ID()) + ": Leavin' the Jon");
	}
});

module.exports = {
	WifesGlobalState,
	DoHouseWork,
	VisitBathroom
};