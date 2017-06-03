import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Post} from '../models/post.model';
import {DbService} from '../core/database';
import {SchedulePost} from "../models/schedulePost.model";

@Injectable()
export class SchedulePostService extends BaseService<SchedulePost, number> {
    constructor(db: DbService) {
        super(db, 'schedulePosts');
    }
}
