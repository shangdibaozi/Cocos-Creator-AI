
var EntityType = cc.Enum({
	ent_Miner_Bob : -1,
	ent_Elsa : -1
});

module.exports = {
	GetNameOfEntity : function(n) {
		if(!Object.hasOwnProperty.call(EntityType, n + '')) {
			return 'UNKNOWN';
		} else {
			return EntityType[n];
		}
	},
	EntityType : EntityType
};