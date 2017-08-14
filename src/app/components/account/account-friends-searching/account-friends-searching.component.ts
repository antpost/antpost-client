import {Component, Injector, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FbAccount} from '../../../models/fbaccount.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { FacebookProfileService } from '../../../services/facebook-profile.service';

@Component({
    selector: 'account-friends-searching',
    templateUrl: './account-friends-searching.component.html',
    styleUrls: ['./account-friends-searching.component.css']
})
export class AccountFriendsSearchingComponent implements OnInit {
    public defaultAccount: FbAccount;
    public accounts$: Observable<FbAccount[]>;
    public accountId: string;
    public friends: FbAccount[] = [];

    constructor(private store: Store<fromRoot.State>,
                private facebookProfilekService: FacebookProfileService) {

    }

    ngOnInit() {
        this.store.select(fromRoot.getDefaultAccount).subscribe(account => {
            this.accountId = account ? account.id : null;
            this.defaultAccount = account;
        });
        this.accounts$ = this.store.select(fromRoot.getAccounts);
    }

    /**
     * Load friends
     * @param {string} accountId
     */
    public loadFriends(accountId: string) {
        this.friends = [];
        this.facebookProfilekService.loadFriend(this.defaultAccount, this.accountId).subscribe((friends) => {
            this.friends = this.friends.concat(friends || []);
        });
    }
}
