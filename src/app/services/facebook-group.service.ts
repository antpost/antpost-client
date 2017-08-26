import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { AutomationService } from './automation.service';
import { FbAccount } from '../models/fbaccount.model';
import { InteractionType } from '../models/enums';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FacebookGroupService extends FacebookService {
    constructor(http: Http, jsonp: Jsonp, automationService: AutomationService) {
        super(http, jsonp, automationService);
    }

    public async getGroupId(account: FbAccount, groupName: string) {
        const info = await this.automationService.viewGroupInfo(account, groupName);
        return info ? info.groupId : null;
    }

    public loadMembers(account: FbAccount, groupId: string, state$: Observable<number>) {
        let api = this.createApi(`/${groupId}/members`, null, account);
        return this.pullPaging(api, 200, null, state$);
    }
}
