import {AddedAccount} from '../models/added-account.model';
import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {DbService} from '../core/database';

@Injectable()
export class AddedAccountService extends BaseService<AddedAccount, number>{

    constructor(db: DbService) {
        super(db, 'addedAccounts');
    }
}
