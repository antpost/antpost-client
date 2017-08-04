import { Action } from '@ngrx/store';
import { Group } from '../models/group.model';

export const LOAD = '[JOINED-GROUP] Load';
export const LOAD_COMPLETE = '[JOINED-GROUP] Load Complete';

export class LoadAction implements Action {
    readonly type = LOAD;
}

export class LoadCompleteAction implements Action {
    readonly type = LOAD_COMPLETE;

    constructor(public playload: any) {
    }
}

export type Actions
    = LoadAction
    | LoadCompleteAction;
