import {DbService} from '../core/database';
import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class FbAccountService extends BaseService<FbAccount, string> {
    constructor(db: DbService) {
        super(db, 'fbaccounts');
    }

    /**
     * Load recent users
     * @returns {Promise<Array<FbAccount>>}
     */
    public async loadRecentUser(): Promise<Array<FbAccount>> {
        let list = this.table.orderBy('lastLogin');
        list = list.reverse();

        return await list.toArray();
    }
}
