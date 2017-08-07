
import {Injectable} from '@angular/core';
import {Actions, toPayload} from '@ngrx/effects';
import {FacebookService} from '../services/facebook.service';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import groupSearch from '../actions/group-search';
import * as fromRoot from '../reducers/index';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class GroupSearchEffect {
    search$: Observable<Action> = this.actions$
        .ofType(groupSearch.SEARCH)
        .map(toPayload)
        .switchMap((query: string) => {
            return new Observable<Action>((observer) => {
                return this.store.select(fromRoot.getDefaultAccount).subscribe((account: FbAccount) => {
                    return this.facebookService.searchGroup(account, query)
                        .then(result => new groupSearch.SearchCompleteAction(result.data))
                        .catch(error => new groupSearch.SearchCompleteAction([]));
                });
            });
        });

    constructor(private actions$: Actions,
                private store: Store<fromRoot.State>,
                private facebookService: FacebookService) {

    }
}
