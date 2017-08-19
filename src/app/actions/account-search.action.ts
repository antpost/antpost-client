import { Action } from '@ngrx/store';
import { FbAccount } from '../models/fbaccount.model';

export const SEARCH_INIT = '[ACCOUNT-SEARCH] Init';
export const SEARCH_GROUP_MEMBERS = '[ACCOUNT-SEARCH] Search Group Members';
export const SEARCH_GROUP_MEMBERS_CANCELLED = '[ACCOUNT-SEARCH] Search Group Members Cancelled';
export const SEARCH_PAGE_COMPLETE = '[ACCOUNT-SEARCH] Search Accounts / Page Complete';
export const SEARCH_RESET = '[ACCOUNT-SEARCH] Search Reset';
export const SEARCH_COMPLETE = '[ACCOUNT-SEARCH] Search Complete';

export class SearchInitAction implements Action {
    readonly type = SEARCH_INIT;

    constructor(public payload?: any) {
    }
}

export class SearchGroupMembersAction implements Action {
    readonly type = SEARCH_GROUP_MEMBERS;

    constructor(public payload: string) {
    }
}

export class SearchGroupMembersCancelledAction implements Action {
    readonly type = SEARCH_GROUP_MEMBERS_CANCELLED;

    constructor(public payload?: any) {
    }
}

export class SearchPageCompleteAction implements Action {
    readonly type = SEARCH_PAGE_COMPLETE;

    constructor(public payload: FbAccount[]) {
    }
}

export class SearchResetAction implements Action {
    readonly type = SEARCH_RESET;

    constructor(public payload?: any) {
    }
}

export class SearchCompleteAction implements Action {
    readonly type = SEARCH_COMPLETE;

    constructor(public payload?: any) {
    }
}

export type Actions
    = SearchInitAction
    | SearchResetAction
    | SearchCompleteAction
    | SearchGroupMembersCancelledAction
    | SearchGroupMembersAction
    | SearchPageCompleteAction;
