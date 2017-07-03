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
import {ActionStep} from '../core/automation/actionStep';
import {Post} from "../models/post.model";
import {AutomationRes} from "../core/automation/automationRes";
import * as $ from 'jquery';

@Injectable()
export class AutomationService extends ProxyService {
    private mbasicUrl: string = 'https://mbasic.facebook.com/';

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
                        id: fbPostId
                    });
                    observer.complete();
                }
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
