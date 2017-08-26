import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { AutomationService } from './automation.service';
import { Http, Jsonp } from '@angular/http';
import { FbAccount } from '../models/fbaccount.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FacebookProfileService extends FacebookService {
    constructor(http: Http, jsonp: Jsonp, automationService: AutomationService) {
        super(http, jsonp, automationService);
    }

    /**
     * Load friends of accountId
     * @param {FbAccount} account
     * @param {string} accountId
     * @param {number} max
     * @returns {Observable<FbAccount[]>}
     */
    public loadFriend(account: FbAccount, accountId: string, max: number = 5000): Observable<FbAccount[]> {
        let limit = 200;

        let api = this.createApi(`/${accountId}/friends`, null, account);
        return this.pullPaging(api);
    }

    /**
     * Get profile id
     * @param {FbAccount} account
     * @param {string} username
     * @returns {Promise<any>}
     */
    public async getUidAsync (account: FbAccount, username: string) {
        return this.automationService.getUidAsync(account, username);
    }

    /**
     * Get user infomation
     * @param uid
     * @param params
     * @returns {Observable<any>}
     */
    public async getUserInfoAsync(account: FbAccount, uid: string, params: any) {
        let api = this.createApi(`/${uid}`, params, account);
        return this.postAsync(api, 'GET');
    }
}
