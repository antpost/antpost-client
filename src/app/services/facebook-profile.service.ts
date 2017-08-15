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
        let count = 0;
        let reachToLast = false;

        const getApi = (pageSize: number, after: string = '') => {
            return this.createApi(`/${accountId}/friends`, {
                limit: pageSize,
            }, account);
        };

        return Observable.create(observer => {
            const onNext = (result) => {
                return result.paging && result.paging.next ? this.post(result.paging.next, 'GET') : Observable.empty();
            };

            let api = getApi(limit);
            this.post(api, 'GET')
                .expand(onNext)
                .catch(error => observer.error(error))
                .subscribe((result: any) => {
                    if(result.data && result.data.length > 0) {
                        observer.next(result.data);
                    } else {
                        observer.complete();
                    }
                });
        });
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
}
