import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Post} from '../models/post.model';
import {DbService} from '../core/database';

@Injectable()
export class PostService extends BaseService<Post, number> {
    constructor(db: DbService) {
        super(db, 'posts');
    }
}
