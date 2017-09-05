import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import * as account from '../actions/account';
import { of } from 'rxjs/observable/of';
import {FbAccountService} from '../services/fbaccount.service';

@Injectable()
export class AccountEffects {
    /**
     * This effect makes use of the `startWith` operator to trigger
     * the effect immediately on startup.
     */
    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(account.LOAD)
        .startWith(new account.LoadAction())
        .switchMap(async () => {
            let accounts = await this.fbAccountService.getAll().toArray();
            return new account.LoadCompleteAction(accounts);
        });

    constructor(private actions$: Actions, private fbAccountService: FbAccountService) {
    }
}
