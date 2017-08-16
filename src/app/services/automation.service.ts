/**
 * Created by Nguyen Manh Cuong on 6/29/2017.
 */

import {ProxyService} from "./proxy.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutomationReq} from '../core/automation/automationReq';
import {Http, Response} from '@angular/http';
import {AppManager} from '../core/appManager';
import {AutomationUtils} from '../core/automation/automationUtils';
import {Post} from "../models/post.model";
import {AutomationRes} from "../core/automation/automationRes";
import * as $ from 'jquery';
import {PostType} from "../models/enums";
import {link} from 'fs';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class AutomationService extends ProxyService {
    private mbasicUrl: string = 'https://mbasic.facebook.com';
    private mUrl: string = 'https://m.facebook.com';

    constructor(http: Http, private appManager: AppManager) {
        super(http);
    }

    /**
     * Simulate login facebook
     * @param username
     * @param password
     */
    public login(username: string, password: string) {

        let procedure = new AutomationReq()
            .access(this.mbasicUrl)
            .input("input[name='email']", username)
            .input("input[name='pass']", password)
            .submit("#login_form")
            .completeWhenUrlContains('mbasic.facebook.com/login/save-device');

        return this.simulate(procedure);
    }

    /**
     * Simulate publish post to node (feed, group, page, ...)
     * @param post
     * @returns {Observable<any>}
     */
    public publishPost(account: FbAccount, post: Post, nodeId: string): Promise<any> {
        let procedure = AutomationUtils.createPostProcedure(post, nodeId, account.cookies);

        return new Promise<any>((resolve) => {
            this.simulate(procedure).subscribe((res) => {
                if(res.status == 0) {
                    // parse post id
                    let fbPostId = null;

                    let element = $('<div></div>');
                    element.html(res.data.content);
                    let postElement = element.find('div[data-ft]').first();
                    if(postElement) {
                        let obj = JSON.parse(postElement.attr('data-ft'));
                        fbPostId = obj.mf_story_key;
                    }

                    resolve({
                        id: fbPostId,
                    });
                } else {
                    let error = null;
                    if(post.type == PostType.Sale) {
                        error = 'Không phải nhóm bán hàng'
                    }

                    resolve({
                        error
                    });
                }
            });
        });
    }

    /**
     * Simulate to get group members
     * @param groupId
     * @returns {Observable<any>}
     */
    public getGroupMembers(groupId: string): Observable<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}?view=info`, this.appManager.currentUser.cookies)
            .responseContent('#u_0_0');

        return new Observable(observer => {
            this.simulate(procedure).subscribe((res) => {
                if(res.status == 0) {
                    let members = parseInt(res.data.content);

                    observer.next(members);
                    observer.complete();
                } else {
                    //observer.error('error');
                    observer.next(0);
                    observer.complete();
                }
            });
        });
    }

    public viewGroupInfo(account: FbAccount, groupId: string): Promise<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}?view=info`, account.cookies)
            .responseContent('#root');

        return new Observable(observer => {
            this.simulate(procedure).subscribe((res) => {
                if(res.status == 0) {
                    let element = $('<div></div>');
                    element.html(res.data.content);
                    let members = parseInt(element.find('#u_0_0').html());

                    let linkElementLength = element.find('a[href*="/join"]').length;

                    observer.next({
                        members,
                        requested: linkElementLength ? false : true
                    });
                    observer.complete();
                } else {
                    //observer.error('error');
                    observer.next({
                        members: 0
                    });
                    observer.complete();
                }
            });
        }).toPromise();
    }

    /**
     *  Check group has pending posts
     * @param groupId
     * @returns {Observable<any>}
     */
    public checkPendingPost(account: FbAccount, groupId: string): Promise<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}/madminpanel`, account.cookies)
            .responseContent('.bz');

        return new Observable(observer => {
            this.simulate(procedure).subscribe((res) => {
                let pendingPost = false;
                if(res.data.content) {
                    pendingPost = true;
                }

                observer.next(pendingPost);
                observer.complete();
            });
        }).toPromise();
    }

    /**
     * Join group
     * @param groupId
     * @returns {Observable<any>}
     */
    public joinGroup(account: FbAccount, groupId: string): Promise<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}?view=info`, account.cookies)
            .click('a[href*="join"]');

        return new Observable(observer => {
            this.simulate(procedure).subscribe((res) => {
                if(res.status == 0) {
                    observer.next(true);
                } else {
                    observer.next(false);
                }
                observer.complete();
            });
        }).toPromise();
    }

    public async comment(account: FbAccount, post: any, message: string, like: boolean, replyOnTop: boolean) {
        let ids = post.id.split('_');
        let postId = ids[1];

        //https://mbasic.facebook.com/groups/257702558042509?view=permalink&id=273147693164662&comment_id=279997012479730&_rdr
        let procedure = new AutomationReq().access(`${this.mbasicUrl}/${postId}`, account.cookies);

        // if has like action
        // if(like) {
        //     procedure = procedure.click('a[data-sigil*="like-reaction-flyout like"]');
        // }

        // if comment to last
        if(!replyOnTop || !post.comments) {
            procedure = procedure
                .input('#composerInput', message)
                .submit(`#composer-${postId} form`);

            let res = await this.simulateAsync(procedure);
            return true;
        } else {
            let comment = post.comments.data[0];
            procedure = new AutomationReq()
                .access(`${this.mbasicUrl}/${comment.id}`, account.cookies)
                .responseContent(`div[id="${comment.id}"] a[href*="/comment/replies/"]`);

            let res = await this.simulateAsync(procedure);
            let element = this.createElement(res.data.content);
            let href = element.find('a').attr('href');

            // create reply procedure
            let reply = new AutomationReq().access(this.mbasicUrl + href, account.cookies)
                .input('#composerInput', message)
                .submit('form');

            await this.simulateAsync(reply);
            return true;
        }

    }

    /**
     * Get profile id
     * @param {FbAccount} account
     * @param {string} username
     * @returns {Promise<any>}
     */
    public async getUidAsync(account: FbAccount, username: string) {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/${username}`, account.cookies)
            .responseContent(`a[href*="/photo.php?fbid="]`);

        const res = await this.simulateAsync(procedure);

        if(res.data.content) {
            const element = this.createElement(res.data.content);
            const href = element.find('a').attr('href');
            const id = href.split('&id=').pop().split('&').shift();
            return id;
        } else {
            return null;
        }
    }

    /**
     *
     * @param procedure
     * @returns {Observable<R>}
     */
    protected simulate(procedure: AutomationReq): Observable<AutomationRes> {
        return this.http.post(`${this.host}/simulate`, procedure)
            .map((response: Response) => {
                return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    protected simulateAsync(procedure: AutomationReq): Promise<any> {
        return this.http.post(`${this.host}/simulate`, procedure)
            .map((response: Response) => {
                return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            }).toPromise();
    }

    private createElement(content: string) {
        let element = $('<div></div>');
        element.html(content);
        return element;
    }
}
