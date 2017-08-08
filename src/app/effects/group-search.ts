
import {Injectable} from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {FacebookService} from '../services/facebook.service';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import * as groupSearch from '../actions/group-search';
import * as fromRoot from '../reducers/index';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class GroupSearchEffects {
    @Effect()
    search$: Observable<Action> = this.actions$
        .ofType(groupSearch.SEARCH)
        .map(toPayload)
        .switchMap((query: string) => {
            return new Observable<Action>((observer) => {
                this.store.select(fromRoot.getDefaultAccount).subscribe((account: FbAccount) => {
                    this.facebookService.searchGroup(account, query)
                        .then(result => observer.next(new groupSearch.SearchCompleteAction(result.data)))
                        .catch(error => observer.next(new groupSearch.SearchCompleteAction([])));
                });
            });
        });

    constructor(private actions$: Actions,
                private store: Store<fromRoot.State>,
                private facebookService: FacebookService) {

    }
}
