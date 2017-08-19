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
}
