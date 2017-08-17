import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { AutomationService } from './automation.service';
import { FbAccount } from '../models/fbaccount.model';
import { InteractionType } from '../models/enums';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FacebookPostService extends FacebookService {
    constructor(http: Http, jsonp: Jsonp, automationService: AutomationService) {
        super(http, jsonp, automationService);
    }

    /**
     * Get accounts like, comment or share one post
     * @param {FbAccount} account
     * @param {string} postId
     * @param {number} interactionType
     * @returns {any}
     */
    public loadPostLikes(account: FbAccount, postId: string): Observable<any> {
        let api = this.createApi(`/${postId}/likes`, null, account);
        return this.pullPaging(api);
    }

    public loadPostComments(account: FbAccount, postId: string): Observable<any> {
        let api = this.createApi(`/${postId}/comments`, {fields: 'from'}, account);
        return this.pullPaging(api).map(data => data.map(item => item.from));
    }

    public loadPostShares(account: FbAccount, postId: string): Observable<any> {
        let api = this.createApi(`/${postId}/sharedposts`, {fields: 'from'}, account);
        return this.pullPaging(api).map(data => data.map(item => item.from));
    }

    /**
     * Get post id from url
     * @param {string} url
     * @returns {any}
     */
    public getPostIdFromUrl(url: string) {
//https://www.facebook.com/bimvai.net/photos/a.951562798187871.1073741828.930105250333626/1595250757152402/?type=3

        if(url.indexOf('posts/') > 0) {
            let index = url.indexOf('posts/');
            return url.substr(index + 'posts/'.length);
        } else if(url.indexOf('photo.php?') > 0){
            let uri = new URL(url);
            let searchParams = new URLSearchParams(uri.search);
            return searchParams.get('fbid');
        } else {
            return null;
        }
    }

    loadAccountsInteractToPosts(account: FbAccount, postIds: string[], interactionTypes: number[]) {
        Observable
            .range(0, postIds.length)
            .map(i => postIds[i])
            .switchMap(postId => {
                return this.loadPostLikes(account, postId);
            });

    }
}
