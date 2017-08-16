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
    public loadPostInteraction(account: FbAccount, postId: string, interactionType: number) {
        let limit = 200;
        let interactionNames = ['likes', 'comments', 'shares'];
        let api = this.createApi(`/${postId}/${interactionNames[interactionType]}`, {
            limit: limit,
            fields: 'from'
        }, account);

        return Observable.create(observer => {
            const onNext = (result) => {
                return result.paging && result.paging.next ? this.post(result.paging.next, 'GET') : Observable.empty();
            };

            this.post(api, 'GET')
                .expand(onNext)
                .catch(error => observer.error(error))
                .subscribe((result: any) => {
                    if(result.data && result.data.length > 0) {
                        observer.next(result.data.map(item => item.from));
                    } else {
                        observer.complete();
                    }
                });
        });
    }

    /**
     * Get post id from url
     * @param {string} url
     * @returns {any}
     */
    public getPostIdFromUrl(url: string) {
        // pattern
        // https://www.facebook.com/bimvai.net/posts/1593049284039216
        // https://www.facebook.com/photo.php?fbid=323754421369911&set=p.323754421369911&type=3&theater

        if(url.indexOf('post/') > 0) {
            let index = url.indexOf('post/');
            return url.substr(index);
        } else if(url.indexOf('photo.php?') > 0){
            let uri = new URL(url);
            let searchParams = new URLSearchParams(uri.search);
            return searchParams.get('fbid');
        }
    }
}
