export default {
    /**
     * returns a random double between zero and 1
     */
    RandFloat() : number {
        return Math.random();
    },

    /**
     * return a random double in the range -1 < n < 1
     */
    RandomClamped() : number {
        return this.RandFloat() - this.RandFloat();
    }
}