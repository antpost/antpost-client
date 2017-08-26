import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {DbService} from '../core/database';
import {Schedule} from '../models/schedule.model';

@Injectable()
export class ScheduleService extends BaseService<Schedule, number> {
    constructor(db: DbService) {
        super(db, 'schedules');
    }

    public async listByType(type: number) {
        return await this.filter(s => s.scheduleType == type)
            .reverse().sortBy('updatedAt');
    }
}
