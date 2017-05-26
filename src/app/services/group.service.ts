import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {DbService} from '../core/database';
import {Group} from '../models/group.model';

@Injectable()
export class GroupService extends BaseService<Group> {
    constructor(db: DbService) {
        super(db, 'groups');
    }

    public async getJoinedGroups(): Promise<Array<Group>> {
        return await this.table.where('administrator').equals(0).toArray();
    }
}
