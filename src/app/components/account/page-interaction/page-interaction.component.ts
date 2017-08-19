import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {FacebookPageService} from '../../../services/facebook-page.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {FbAccount} from '../../../models/fbaccount.model';
import {Toastr} from '../../../core/helpers/toastr';
import {FacebookPostService} from '../../../services/facebook-post.service';
import { LoadingState } from '../../../models/enums';
import * as accountSearchAction from '../../../actions/account-search.action';

@Component({
    selector: 'page-interaction',
    templateUrl: './page-interaction.component.html',
    styleUrls: ['./page-interaction.component.css']
})
export class PageInteractionComponent implements OnInit, OnDestroy {
    public ranges: any[];
    public timeRange: number;
    public like = true; comment = true; share = true;
    public pageId: string = 'meyeucon.24h';
    public antAccount$: Observable<FbAccount>;
    public loadingPost: number = 0;
    public loadingAccount$: Observable<number>;
    public posts: any[];
    public accounts: FbAccount[] = [];

    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();

    constructor(private store: Store<fromRoot.State>,
                private facebookPageService: FacebookPageService,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.antAccount$ = this.store.select(fromRoot.getDefaultAccount);

        this.loadingAccount$ = Observable.of(LoadingState.None);
        this.loadingAccount$.subscribe(state => {
            if(state == LoadingState.Completed) {
                Toastr.success('Tải tài khoản tương tác fanpage thành công!');
            }
        });

        this.store.select(fromRoot.getFoundAccounts).subscribe(accounts => {
            this.accounts = this.accounts.concat(accounts);
            this.onSelect.emit(accounts);
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

    stopLoading() {
        this.store.dispatch(new accountSearchAction.SearchGroupMembersCancelledAction());
        this.store.dispatch(new accountSearchAction.SearchInteractionCancelledAction());
    }

    loadAccounts() {
        if(!this.pageId || !this.pageId.trim()) {
            Toastr.error('Chưa nhập Fanpage!');
        }

        this.posts = [];
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
        const untilDate = new Date(Date.now() - this.timeRange * ONE_DAY_TIME);

        this.loadingPost = 1;
        this.loadingAccount$ = this.store.select(fromRoot.getSearchInteractionState);

        this.antAccount$.take(1).subscribe((antAccount) => {
            this.facebookPageService.loadPosts(antAccount, this.pageId, untilDate).subscribe(
                (posts) => this.posts = this.posts.concat(posts),
                () => {},
                () => {this.loadInterations()}
            )
        });
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
