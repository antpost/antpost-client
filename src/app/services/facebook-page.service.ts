import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { AutomationService } from './automation.service';
import { FbAccount } from '../models/fbaccount.model';
import { InteractionType } from '../models/enums';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FacebookPageService extends FacebookService {
    constructor(http: Http, jsonp: Jsonp, automationService: AutomationService) {
        super(http, jsonp, automationService);
    }

    /**
     *
     * @param {FbAccount} account
     * @param {string} pageId
     * @returns {Promise<any>}
     */
    public loadPageInfoAsync(account: FbAccount, pageId: string) {
        let api = this.createApi(pageId, null, account);
        return this.pullAsync(api);
    }

    public loadPosts(account: FbAccount, pageId: string, until?: Date, max?: number): Observable<any> {
        let api = this.createApi(`/${pageId}/feed`, {fields: 'created_time'}, account);

        const completeFn = (data) => {
            if(until) {
                // find post has time created < until
                const post = data.find(item => new Date(item.created_time).getTime() < until.getTime());
                if(post) {
                    return true;
                }
            }

            return false;
        };

        const filterFn = (data) => data.filter(item => new Date(item.created_time).getTime() >= until.getTime());

        return this.pullPaging(api, 200, completeFn).map(filterFn);
    }
}
