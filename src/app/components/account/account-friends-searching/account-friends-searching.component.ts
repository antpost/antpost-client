import {Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FbAccount} from '../../../models/fbaccount.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { FacebookProfileService } from '../../../services/facebook-profile.service';
import {Toastr} from '../../../core/helpers/toastr';
import {GridComponent} from '@progress/kendo-angular-grid';

@Component({
    selector: 'account-friends-searching',
    templateUrl: './account-friends-searching.component.html',
    styleUrls: ['./account-friends-searching.component.css']
})
export class AccountFriendsSearchingComponent implements OnInit {
    @Input() public anyAccount: boolean;
    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();
    @ViewChild(GridComponent) grid: GridComponent;

    public defaultAccount: FbAccount;
    public accounts$: Observable<FbAccount[]>;
    public accountId: string;
    public friends: FbAccount[] = [];
    public username: string;

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

    public onSelectAccounts(friends: FbAccount[]) {
        this.onSelect.emit(friends);
    }

    public async loadFriendsFromUsername(username: string) {
        if(!username || !username.trim()) {
            Toastr.error('Bạn phải điên đầy đủ dường dẫn của tài khoản!');
            return;
        }

        const id = await this.facebookProfilekService.getUidAsync(this.defaultAccount, username.trim());
        if(!id) {
            Toastr.error('Tài khoản không tồn tại!');
        }

        const account = await this.facebookProfilekService.getUserInfoAsync(this.defaultAccount, id, {fields: 'name'});
        if(account) {
            this.friends = [];
            this.friends.push(account);
            this.grid.expandRow(0);
        }
    }

    public ngAfterViewInit(): void {
        // Expand the first row initially

    }
}
