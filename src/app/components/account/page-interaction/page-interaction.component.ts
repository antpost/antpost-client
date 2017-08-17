import {Component, OnInit} from '@angular/core';
import {FacebookPageService} from '../../../services/facebook-page.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import {Observable} from 'rxjs/Observable';
import {FbAccount} from '../../../models/fbaccount.model';
import {Toastr} from '../../../core/helpers/toastr';
import {FacebookPostService} from '../../../services/facebook-post.service';

@Component({
    selector: 'page-interaction',
    templateUrl: './page-interaction.component.html',
    styleUrls: ['./page-interaction.component.css']
})
export class PageInteractionComponent implements OnInit {
    public ranges: any[];
    public timeRange: number;
    public like = true; comment = true; share = true;
    public pageId: string;
    public antAccount$: Observable<FbAccount>;
    public loadingPost: number = 0;
    public loadingAccount: number = 0;
    public posts: any[];
    public accounts: FbAccount[];

    constructor(private store: Store<fromRoot.State>,
                private facebookPageService: FacebookPageService,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.antAccount$ = this.store.select(fromRoot.getDefaultAccount);

        this.ranges = [
            {text: '1 ngày trở lại', value: 1},
            {text: '2 ngày trở lại', value: 2},
            {text: '1 tuần trở lại', value: 7},
            {text: '2 tuần trở lại', value: 14},
            {text: '1 tháng trở lại', value: 30}
        ];

        this.timeRange = 1;
    }

    loadAccounts() {
        if(!this.pageId || !this.pageId.trim()) {
            Toastr.error('Chưa nhập Fanpage!');
        }

        this.posts = [];
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
        const untilDate = new Date(Date.now() - this.timeRange * ONE_DAY_TIME);

        this.loadingPost = 1;

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
        console.log('start loading interactions');
        this.accounts = [];
        this.loadingAccount = 1;

        const actions = {
            like: this.like,
            comment: this.comment,
            share: this.share
        };

        this.antAccount$.take(1).subscribe((antAccount) => {
            this.facebookPostService.loadAccountsInteractToPosts(antAccount, this.posts, actions).subscribe(
                (posts) => this.posts = this.posts.concat(posts),
                () => {},
                () => {this.loadInterations()}
            )
        });
    }
}
