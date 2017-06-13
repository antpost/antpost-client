import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {DbService} from '../core/database';
import {NodePost} from '../models/nodePost.model';

@Injectable()
export class NodePostService extends BaseService<NodePost, number> {
    constructor(db: DbService) {
        super(db, 'nodePosts');
        this.table.mapToClass(NodePost);
    }
}
