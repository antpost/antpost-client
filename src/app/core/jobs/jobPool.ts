export class JobPool {
    // maximum jobs that pool holds
    private poolSize: number;

    constructor(poolSize: number) {
        this.poolSize = poolSize;
    }
}
