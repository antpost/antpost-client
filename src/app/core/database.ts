import Dexie from 'dexie';
import relationships from './db/relationship';

export class DbService extends Dexie {

    constructor() {
        super('antpost', {addons: [relationships]});

        this.version(1).stores({
            fbaccounts: `
                id,
                name,
                email
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
                status,
                scheduleType`,
            schedulePosts: `
                ++id,
                postId -> posts.id,
                status`,
            nodePosts: `
                ++id,
                scheduleId -> schedulePosts.id`
        });
    }
}
