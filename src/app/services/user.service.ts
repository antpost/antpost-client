import {DbService} from '../core/database';
import {User} from '../models/user.model';
import {BaseService} from './base.service';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService extends BaseService<User, string> {
    constructor(db: DbService) {
        super(db, 'users');
    }

    /**
     * Load recent users
     * @returns {Promise<Array<User>>}
     */
    public async loadRecentUser(): Promise<Array<User>> {
        let list = this.table.orderBy('lastLogin');
        list = list.reverse();

        return await list.toArray();
    }
}
