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

@Injectable()
export class AutomationService extends ProxyService {
    private mbasicUrl: string = 'https://mbasic.facebook.com';

    constructor(private http: Http, private appManager: AppManager) {
        super();
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
    public publishPost(post: Post, nodeId: string) {
        let procedure = AutomationUtils.createPostProcedure(post, nodeId, this.appManager.currentUser.cookies);

        return new Observable(observer => {
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

                    observer.next({
                        id: fbPostId,
                    });
                    observer.complete();
                } else {
                    let error = null;
                    if(post.type == PostType.Sale) {
                        error = 'Không phải nhóm bán hàng'
                    }

                    observer.next({
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

    public viewGroupInfo(groupId: string): Observable<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}?view=info`, this.appManager.currentUser.cookies)
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
        });
    }

    /**
     *  Check group has pending posts
     * @param groupId
     * @returns {Observable<any>}
     */
    public checkPendingPost(groupId: string): Observable<any> {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}/madminpanel`, this.appManager.currentUser.cookies)
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
        });
    }

    /**
     * Join group
     * @param groupId
     * @returns {Observable<any>}
     */
    public joinGroup(groupId: string) {
        let procedure = new AutomationReq()
            .access(`${this.mbasicUrl}/groups/${groupId}?view=info`, this.appManager.currentUser.cookies)
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
        });
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
}
