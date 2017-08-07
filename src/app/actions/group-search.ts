import { Action } from '@ngrx/store';
import { Group } from '../models/group.model';

export const SEARCH = '[GROUP-SEARCH] Search';
export const SEARCH_COMPLETE = '[GROUP-SEARCH] Search Complete';

export class SearchAction implements Action {
    readonly type = SEARCH;

    constructor(public payload: string) {
    }
}

export class SearchCompleteAction implements Action {
    readonly type = SEARCH_COMPLETE;

    constructor(public payload: Group[]) {
    }
}

export type Actions
    = SearchAction
    | SearchCompleteAction;
