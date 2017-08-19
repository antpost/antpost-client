import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import * as accountSeachAction from '../actions/account-search.action';
import { of } from 'rxjs/observable/of';
import {FbAccountService} from '../services/fbaccount.service';
import { FacebookGroupService } from '../services/facebook-group.service';
import * as fromRoot from '../reducers/index';

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

    constructor(private actions$: Actions,
                private store$: Store<fromRoot.State>,
                private fbAccountService: FbAccountService,
                private facebookGroupService: FacebookGroupService) {
    }
}
