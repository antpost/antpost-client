import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { AutomationService } from './automation.service';
import { FbAccount } from '../models/fbaccount.model';
import { InteractionType, LoadingState } from '../models/enums';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
    public loadPostLikes(account: FbAccount, postId: string, state$: Observable<number>): Observable<any> {
        let api = this.createApi(`/${postId}/likes`, null, account);
        return this.pullPaging(api, 200, null, state$);
    }

    public loadPostComments(account: FbAccount, postId: string, state$: Observable<number>): Observable<any> {
        let api = this.createApi(`/${postId}/comments`, {fields: 'from'}, account);
        return this.pullPaging(api, 200, null, state$).map(data => data.map(item => item.from));
    }

    public loadPostShares(account: FbAccount, postId: string, state$: Observable<number>): Observable<any> {
        let api = this.createApi(`/${postId}/sharedposts`, {fields: 'from'}, account);
        return this.pullPaging(api, 200, null, state$).map(data => data.map(item => item.from));
    }

    /**
     * Get post id from url
     * @param {string} url
     * @returns {any}
     */
    public getPostIdFromUrl(url: string) {
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

    /**
     * Load accounts interacting to posts
     * @param {FbAccount} account
     * @param {string[]} postIds
     * @param actions
     * @returns {any}
     */
    public loadAccountsInteractToPosts(account: FbAccount, postIds: string[], actions: any, state$?: Observable<number>): Observable<any> {
        return Observable
            .range(0, postIds.length)
            .switchMap(i => this.loadAccountsInteractToOnePost(account, postIds[i], actions, state$));
    }

    public loadAccountsInteractToOnePost(account: FbAccount, postId: string, actions: any, state$?: Observable<number>): Observable<any> {

        return Observable.create(subject => {
            const loadInteractions = (account: FbAccount, postId: string, type: number) => {
                return Observable.create(observer => {
                    let subscription = type == InteractionType.Like ?
                        this.loadPostLikes(account, postId, state$)
                        : type == InteractionType.Comment ? this.loadPostComments(account, postId, state$)
                            : this.loadPostShares(account, postId, state$);

                    subscription.subscribe(
                        (data) => {
                            subject.next(data);
                        },
                        (error) => {
                            console.log(error);
                            observer.next(false);
                            observer.complete();
                        },
                        () => {
                            observer.next(true);
                            observer.complete();
                        }
                    )
                });
            }

            let source = Observable.of(1);

            const uncheckAll = !actions.like && !actions.comment && !actions.share;

            if(uncheckAll || actions.like) {
                source = source.flatMap(() => loadInteractions(account, postId, InteractionType.Like));
            }

            if(uncheckAll || actions.comment) {
                source = source.flatMap(() => loadInteractions(account, postId, InteractionType.Comment));
            }

            if(uncheckAll || actions.share) {
                source = source.flatMap(() => loadInteractions(account, postId, InteractionType.Share));
            }

            source.subscribe(() => {
                subject.complete();
                console.log('complete load account for post ' + postId);
            });
        });
    }
}
