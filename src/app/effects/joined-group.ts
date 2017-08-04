import { Injectable } from '@angular/core';
import { Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import * as joinedGroup from '../actions/joined-group';
import { FacebookService } from '../services/facebook.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class JoinedGroupEffects {
    load$: Observable<Action> = this.actions$
        .ofType(joinedGroup.LOAD)
        .switchMap(() =>
            this.facebookService.getJoinedGroups()
                .map(groups => new joinedGroup.LoadCompleteAction(groups))
                .catch(error => of(new joinedGroup.LoadCompleteAction([])))
        );

    constructor(private actions$: Actions, private facebookService: FacebookService) {
    }
}
