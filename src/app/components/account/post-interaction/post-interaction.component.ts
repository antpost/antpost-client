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
    public antAccount$: Observable<FbAccount>;

    public like = true; comment = true; share = true;

    constructor(private store: Store<fromRoot.State>,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.antAccount$ = this.store.select(fromRoot.getDefaultAccount);
    }

    public loadAccount(postUrl: string) {
        const postId = this.facebookPostService.getPostIdFromUrl(postUrl);
        const uncheckAll = !this.like && !this.comment && !this.share;

        if (postId) {
            this.accounts = [];

            const actions = {
                like: this.like,
                comment: this.comment,
                share: this.share
            };

            this.antAccount$.take(1).subscribe((antAccount) => {
                this.facebookPostService.loadAccountsInteractToOnePost(antAccount, postId, actions)
                    .subscribe(
                        (data) => {
                            this.pushToAccounts(data);
                        },
                        (error) => {
                            console.log(error);
                        },
                        () => {
                            Toastr.success('Tải tài khoản tương tác bài đăng thành công!')
                        }
                    );
            });
        } else {
            // notify error
            Toastr.error('Link bài đăng không đúng!');
        }
    }

    public onSelectAccounts(acounts: FbAccount[]) {
        this.onSelect.emit(acounts);
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
