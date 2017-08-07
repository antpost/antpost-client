import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import * as joinedGroup from '../actions/joined-group';
import { FacebookService } from '../services/facebook.service';
import { of } from 'rxjs/observable/of';
import {FbAccountService} from '../services/fbaccount.service';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class JoinedGroupEffects {
    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(joinedGroup.LOAD)
        .map(toPayload)
        .switchMap((account: FbAccount) =>
            this.facebookService.getJoinedGroups(account)
                .then(result => new joinedGroup.LoadCompleteAction({
                    id: account.id,
                    groups: result.data
                }))
                .catch(error => of(new joinedGroup.LoadCompleteAction(null)))
        );

    constructor(private actions$: Actions, private facebookService: FacebookService,
                private fbAccountService: FbAccountService) {
    }
}
