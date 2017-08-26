import { Injectable } from '@angular/core';
import {DbService} from '../core/database';
import {TargetGroup} from '../models/target-group.model';
import {BaseService} from './base.service';

@Injectable()
export class TargetGroupService extends BaseService<TargetGroup, number>{

    constructor(db: DbService) {
        super(db, 'targetGroups');
    }

}
