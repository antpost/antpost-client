import { Action } from '@ngrx/store';

export const LOAD = '[ACCOUNT] Load';
export const LOAD_COMPLETE = '[ACCOUNT] Load Complete';

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
