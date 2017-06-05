import Dexie from 'dexie';
import relationships from 'dexie-relationships';

export class DbService extends Dexie {

    constructor() {
        super('antpost', {addons: [relationships]});

        this.version(1).stores({
            posts: `
                ++id,
                title,
                type`,
            groups: `
                id,
                name,
                privacy,
                administrator`,
            schedulePosts: `
                ++id,
                postId,
                status`,
            nodePosts: `
                ++id,
                scheduleId -> schedulePosts.id`
        });
    }
}
