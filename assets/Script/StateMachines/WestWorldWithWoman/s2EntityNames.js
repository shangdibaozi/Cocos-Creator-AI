var ENTITY_TYPE = cc.Enum({
	ent_Miner_Bob : -1,
	ent_Elsa : -1
});

module.exports = {
	GetNameOfEntity : function(n) {
		switch(n) {
			case ENTITY_TYPE.ent_Miner_Bob:
				return 'Miner Bob';
			case ENTITY_TYPE.ent_Elsa:
				return 'Elsa';
			default:
				return 'UNKNOWN!';
		}
	}
};