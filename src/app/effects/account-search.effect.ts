import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import * as accountSeachAction from '../actions/account-search.action';
import { of } from 'rxjs/observable/of';
import {FbAccountService} from '../services/fbaccount.service';
import { FacebookGroupService } from '../services/facebook-group.service';
import * as fromRoot from '../reducers/index';
import { FacebookPostService } from '../services/facebook-post.service';

@Injectable()
export class AccountSearchEffects {
    @Effect()
    loadGroupMembers$: Observable<Action> = this.actions$
        .ofType(accountSeachAction.SEARCH_GROUP_MEMBERS)
        .map(toPayload)
        .withLatestFrom(this.store$.select(fromRoot.getDefaultAccount))
        .switchMap(([groupId, antAccount]) => {
            return new Observable<Action>(observer => {
                this.facebookGroupService.loadMembers(antAccount, groupId, this.store$.select(fromRoot.getSearchGroupMembersState)).subscribe(
                    (accounts) => {
                        observer.next(new accountSeachAction.SearchPageCompleteAction(accounts))
                    },
                    () => {},
                    () => {
                        observer.next(new accountSeachAction.SearchCompleteAction());
                    });
            });
        });

    @Effect()
    loadGroupInteraction$: Observable<Action> = this.actions$
        .ofType(accountSeachAction.SEARCH_INTERACTION)
        .map(toPayload)
        .withLatestFrom(this.store$.select(fromRoot.getDefaultAccount))
        .switchMap(([payload, antAccount]) => {
            return new Observable<Action>(observer => {
                this.facebookPostService.loadAccountsInteractToPosts(antAccount, payload.postIds, payload.actions,
                        this.store$.select(fromRoot.getSearchInteractionState))
                    .subscribe(
                    (accounts) => {
                        observer.next(new accountSeachAction.SearchPageCompleteAction(accounts))
                    },
                    () => {},
                    () => {
                        observer.next(new accountSeachAction.SearchCompleteAction());
                    });
            });
        });

    constructor(private actions$: Actions,
                private store$: Store<fromRoot.State>,
                private facebookGroupService: FacebookGroupService,
                private facebookPostService: FacebookPostService) {
    }
}
