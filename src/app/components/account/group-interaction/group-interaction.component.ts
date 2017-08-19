import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FbAccount } from '../../../models/fbaccount.model';
import { FacebookPostService } from '../../../services/facebook-post.service';
import * as fromRoot from '../../../reducers/index';
import { Toastr } from '../../../core/helpers/toastr';
import { FacebookGroupService } from '../../../services/facebook-group.service';
import { Subscription } from 'rxjs/Subscription';
import * as accountSearchAction from '../../../actions/account-search.action';
import { LoadingState } from '../../../models/enums';

@Component({
    selector: 'group-interaction',
    templateUrl: './group-interaction.component.html',
    styleUrls: ['./group-interaction.component.css']
})
export class GroupInteractionComponent implements OnInit, OnDestroy {

    public ranges: any[];
    public timeRange: number;
    public like = true; comment = true; share = true;
    public action: number = 1;
    public groupId: string = '720086518171901';
    public antAccount$: Observable<FbAccount>;
    public loadingPost: number = 0;

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
            this.onSelect.emit(accounts);
        });
        this.loadingAccount$ = Observable.of(LoadingState.None);
        this.loadingAccount$.subscribe(state => {
            if(state == LoadingState.Completed) {
                Toastr.success('Tải tài khoản tương tác nhóm thành công!');
            }
        });

        this.ranges = [
            {text: '1 ngày trở lại', value: 1},
            {text: '2 ngày trở lại', value: 2},
            {text: '1 tuần trở lại', value: 7},
            {text: '2 tuần trở lại', value: 14},
            {text: '1 tháng trở lại', value: 30}
        ];

        this.timeRange = 1;
    }

    ngOnDestroy() {
        this.stopLoading();
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
        this.store.dispatch(new accountSearchAction.SearchInteractionCancelledAction());
    }

    loadAccounts(groupId: string) {
        this.posts = [];
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
        const untilDate = new Date(Date.now() - this.timeRange * ONE_DAY_TIME);

        this.loadingPost = 1;
        this.loadingAccount$ = this.store.select(fromRoot.getSearchInteractionState);

        this.antAccount$.take(1).subscribe((antAccount) => {
            this.facebookGroupService.loadPosts(antAccount, groupId, untilDate).subscribe(
                (posts) => this.posts = this.posts.concat(posts),
                () => {},
                () => {this.loadInterations()}
            )
        });
    }

    loadMembers(groupId: string) {
        this.loadingAccount$ = this.store.select(fromRoot.getSearchGroupMembersState);
        this.accounts = [];
        this.store.dispatch(new accountSearchAction.SearchResetAction());
        this.store.dispatch(new accountSearchAction.SearchGroupMembersAction(groupId));
    }

    loadInterations() {
        this.loadingPost = 2;
        this.accounts = [];

        const actions = {
            like: this.like,
            comment: this.comment,
            share: this.share
        };

        this.store.dispatch(new accountSearchAction.SearchResetAction());
        this.store.dispatch(new accountSearchAction.SearchInteractionAction({
            postIds: this.posts.map(p => p.id),
            actions
        }));
    }

}
