import Dexie from 'dexie';

export class DbService extends Dexie {

    constructor() {
        super('antpost');

        this.version(2).stores({
            fbaccounts: `
                id,
                name,
                email,
                lastLogin
            `,
            posts: `
                ++id,
                title,
                type`,
            groups: `
                id,
                name,
                privacy,
                administrator`,
            schedules: `
                ++id,
                uid,
                scheduleType,
                active,
                updatedAt`
        });
    }
}
