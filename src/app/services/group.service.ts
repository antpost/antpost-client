import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {DbService} from '../core/database';
import {Group} from '../models/group.model';

@Injectable()
export class GroupService extends BaseService<Group, string> {
    constructor(db: DbService) {
        super(db, 'groups');
    }
}
