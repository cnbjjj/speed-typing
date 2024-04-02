class Score {
    #date;
    #hits;
    #percentage;
    #total;

    constructor( hits, total, date){
        this.#hits = hits;
        this.#total = total;
        this.#date = date;
    }

    get date() { return this.#date }
    get hits() { return this.#hits }
    get percentage() { return this.#hits/this.#total }
    get total() {return this.#total }

}

export { Score };