import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FbAccount } from '../../../models/fbaccount.model';
import { FacebookPostService } from '../../../services/facebook-post.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { InteractionType } from '../../../models/enums';

@Component({
    selector: 'post-interaction',
    templateUrl: './post-interaction.component.html',
    styleUrls: ['./post-interaction.component.css']
})
export class PostInteractionComponent implements OnInit {

    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();
    public accounts: FbAccount[] = [];
    public defaultAccount$: Observable<FbAccount>;

    constructor(private store: Store<fromRoot.State>,
                private facebookPostService: FacebookPostService) {
    }

    ngOnInit() {
        this.defaultAccount$ = this.store.select(fromRoot.getDefaultAccount);
    }

    public loadAccount(postUrl: string) {
        const postId = this.facebookPostService.getPostIdFromUrl(postUrl);

        if (postId) {
            this.defaultAccount$.take(1).subscribe((defaultAccount) => {
                this.loadInterations(defaultAccount, postId, InteractionType.Like)
                    .flatMap(() => this.loadInterations(defaultAccount, postId, InteractionType.Comment))
                    .flatMap(() => this.loadInterations(defaultAccount, postId, InteractionType.Share));
            });
        } else {
            // notify error
        }
    }

    public onSelectAccounts(acounts: FbAccount[]) {
        this.onSelect.emit(acounts);
    }

    private loadInterations(account: FbAccount, postId: string, type: number) {
        return Observable.create(observer => {
            this.facebookPostService.loadPostInteraction(account, postId, type).subscribe(
                (data) => {
                    this.pushToAccounts(data);
                },
                () => {
                },
                () => observer.complete()
            )
        });
    }

    private pushToAccounts(data: FbAccount[]) {

    }
}
