import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FbAccount } from '../../../models/fbaccount.model';
import { FacebookPostService } from '../../../services/facebook-post.service';
import * as fromRoot from '../../../reducers/index';
import { Toastr } from '../../../core/helpers/toastr';
import { FacebookGroupService } from '../../../services/facebook-group.service';
import { Subscription } from 'rxjs/Subscription';
import * as accountSearchAction from '../../../actions/account-search.action';

@Component({
    selector: 'group-interaction',
    templateUrl: './group-interaction.component.html',
    styleUrls: ['./group-interaction.component.css']
})
export class GroupInteractionComponent implements OnInit {

    public ranges: any[];
    public timeRange: number;
    public like = true; comment = true; share = true;
    public action: number = 2;
    public groupId: string = '192570010815258';
    public antAccount$: Observable<FbAccount>;
    public loadingPost: number = 0;
    public loadingAccount: number = 0;

    public loadingAccount$: Observable<number>;

    public posts: any[];
    public accounts: FbAccount[] = [];
    private subscription: Subscription;

    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();

    constructor(private store: Store<fromRoot.State>,
                private facebookGroupService: FacebookGroupService,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.antAccount$ = this.store.select(fromRoot.getDefaultAccount);
        this.store.select(fromRoot.getFoundAccounts).subscribe(accounts => {
            this.accounts = this.accounts.concat(accounts);
            this.onSelect.emit(accounts)
        });
        this.loadingAccount$ = this.store.select(fromRoot.getSearchGroupMembersState);

        this.ranges = [
            {text: '1 ngày trở lại', value: 1},
            {text: '2 ngày trở lại', value: 2},
            {text: '1 tuần trở lại', value: 7},
            {text: '2 tuần trở lại', value: 14},
            {text: '1 tháng trở lại', value: 30}
        ];

        this.timeRange = 1;
    }

    startLoading() {
        if(!this.groupId || !this.groupId.trim()) {
            Toastr.error('Chưa nhập nhóm!');
        }

        if(this.action == 1) {
            this.loadAccounts(this.groupId);
        } else {
            this.loadMembers(this.groupId);
        }
    }

    stopLoading() {
        this.store.dispatch(new accountSearchAction.SearchGroupMembersCancelledAction());
    }

    loadAccounts(groupId: string) {
        this.posts = [];
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
        const untilDate = new Date(Date.now() - this.timeRange * ONE_DAY_TIME);

        this.loadingPost = 1;
        this.loadingAccount = 0;

        this.antAccount$.take(1).subscribe((antAccount) => {
            /*this.facebookGroupService.loadPosts(antAccount, this.pageId, untilDate).subscribe(
                (posts) => this.posts = this.posts.concat(posts),
                () => {},
                () => {this.loadInterations()}
            )*/
        });
    }

    loadMembers(groupId: string) {
        this.accounts = [];
        this.store.dispatch(new accountSearchAction.SearchResetAction());
        this.store.dispatch(new accountSearchAction.SearchGroupMembersAction(groupId));
    }

    loadInterations() {
        this.loadingPost = 2;
        console.log('start loading interactions');
        this.accounts = [];
        this.loadingAccount = 1;

        const actions = {
            like: this.like,
            comment: this.comment,
            share: this.share
        };

        this.antAccount$.take(1).subscribe((antAccount) => {
            this.facebookPostService.loadAccountsInteractToPosts(antAccount, this.posts.map(p => p.id), actions).subscribe(
                (accounts) => {
                    this.accounts = this.accounts.concat(accounts);
                    this.onSelect.emit(accounts);
                },
                () => {},
                () => {
                    Toastr.success('Tải tài khoản tương tác nhóm thành công!');
                    this.loadingAccount = 2;
                }
            )
        });
    }

}
