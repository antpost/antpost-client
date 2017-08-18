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

    public loadMembers(account: FbAccount, groupId: string) {
        let api = this.createApi(`/${groupId}/members`, null, account);
        return this.pullPaging(api);
    }
}
