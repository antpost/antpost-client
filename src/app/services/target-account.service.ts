import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {DbService} from '../core/database';
import {TargetAccount} from '../models/target-account.model';

@Injectable()
export class TargetAccountService extends BaseService<TargetAccount, number>{

    constructor(db: DbService) {
        super(db, 'targetAccounts');
    }

    public async deleteByTargetGroup(targetGroupId: number) {
        this.table.where('groupId').equals(targetGroupId).delete();
    }
}
