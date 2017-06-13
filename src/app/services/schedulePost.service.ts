import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Post} from '../models/post.model';
import {DbService} from '../core/database';
import {SchedulePost} from "../models/schedulePost.model";
import {SchedulePostStatus} from "../models/enums";
import {forEach} from "@angular/router/src/utils/collection";
import {GroupService} from "./group.service";

@Injectable()
export class SchedulePostService extends BaseService<SchedulePost, number> {
    constructor(db: DbService, private groupService: GroupService) {
        super(db, 'schedulePosts');
        this.table.mapToClass(SchedulePost);
    }

    /**
     * Get post schedules that status is Opened, Running or Paused
     * @returns {any}
     */
    public async getActiveSchedules(): Promise<Array<SchedulePost>> {
        let list = await this.table
            .where('status').notEqual(SchedulePostStatus.Stopped)
            .with({nodePosts: 'nodePosts', post: 'postId'});

        if(list) {
            list.forEach(async (item: SchedulePost) => {
                let ids = item.nodes.split(',');

                item.groups = await this.groupService.getByIds(ids);
            });
        }

        return list;
    }
}
