import { FacebookService } from './facebook.service';
import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { AutomationService } from './automation.service';
import { FbAccount } from '../models/fbaccount.model';

@Injectable()
export class FacebookPostService extends FacebookService {
    constructor(http: Http, jsonp: Jsonp, automationService: AutomationService) {
        super(http, jsonp, automationService);
    }

    public loadPostInteraction(account: FbAccount, postId: string) {

    }

    public getPostIdFromUrl(url: string) {
        // pattern
        // https://www.facebook.com/bimvai.net/posts/1593049284039216
        // https://www.facebook.com/photo.php?fbid=323754421369911&set=p.323754421369911&type=3&theater
         //   https://www.facebook.com/bimvai.net/photos/pcb.1593049284039216/1593046994039445/?type=3&theater

                }
}
