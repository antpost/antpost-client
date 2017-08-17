import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FbAccount } from '../../../models/fbaccount.model';
import { FacebookPostService } from '../../../services/facebook-post.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { InteractionType } from '../../../models/enums';
import {Toastr} from '../../../core/helpers/toastr';

@Component({
    selector: 'post-interaction',
    templateUrl: './post-interaction.component.html',
    styleUrls: ['./post-interaction.component.css']
})
export class PostInteractionComponent implements OnInit {

    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();
    public accounts: FbAccount[] = [];
    public defaultAccount$: Observable<FbAccount>;

    public like = true; comment = true; share = true;

    constructor(private store: Store<fromRoot.State>,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.defaultAccount$ = this.store.select(fromRoot.getDefaultAccount);
    }

    public loadAccount(postUrl: string) {
        const postId = this.facebookPostService.getPostIdFromUrl(postUrl);
        const uncheckAll = !this.like && !this.comment && !this.share;

        if (postId) {
            this.accounts = [];

            this.defaultAccount$.take(1).subscribe((defaultAccount) => {
                let source = Observable.of(1);

                if(uncheckAll || this.like) {
                    source = source.flatMap(() => this.loadInterations(defaultAccount, postId, InteractionType.Like));
                }

                if(uncheckAll || this.comment) {
                    source = source.flatMap(() => this.loadInterations(defaultAccount, postId, InteractionType.Comment));
                }

                if(uncheckAll || this.share) {
                    source = source.flatMap(() => this.loadInterations(defaultAccount, postId, InteractionType.Share));
                }

                source.subscribe(() => Toastr.success('Tải tài khoản tương tác bài đăng thành công!'));
            });
        } else {
            // notify error
            Toastr.error('Link bài đăng không đúng!');
        }
    }

    public onSelectAccounts(acounts: FbAccount[]) {
        this.onSelect.emit(acounts);
    }

    private loadInterations(account: FbAccount, postId: string, type: number) {
        return Observable.create(observer => {
            let subscription = type == InteractionType.Like ?
                this.facebookPostService.loadPostLikes(account, postId)
                : type == InteractionType.Comment ? this.facebookPostService.loadPostComments(account, postId)
                : this.facebookPostService.loadPostShares(account, postId);

            subscription.subscribe(
                (data) => {
                    this.pushToAccounts(data);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    observer.next(true);
                    observer.complete();
                }
            )
        });
    }

    private pushToAccounts(data: FbAccount[]) {
        if(!data) {return;}

        data.forEach(item => {
            const existing = this.accounts.find(a => a.id == item.id);
            if(!existing) {
                this.accounts.push(item);
            }
        });
    }
}
