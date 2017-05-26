import Dexie from 'dexie';

export class DbService extends Dexie {

    constructor() {
        super('antpost');

        this.version(1).stores({
            posts: "++id",
            groups: "++id"
        });
    }
}
