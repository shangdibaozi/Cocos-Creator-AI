export default {
    RandFloat() : number {
        return Math.random();
    },

    // return a random double in the range -1 < n < 1
    RandomClamped() : number {
        return this.RandFloat() - this.RandFloat();
    }
}