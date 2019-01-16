
//-------------------------------
// some random number functions.
//-------------------------------

// returns a random integer between x and y
function RandInt(x, y) {
	cc.assert(y >= x, '<RandInt>: y is less than x');
	return Math.floor(Math.random() * (y - x + 1) + x);
}

// returns a random double between zero and 1
function RandFloat() {
	return Math.random();
}

module.exports = {
	RandInt,
	RandFloat
};