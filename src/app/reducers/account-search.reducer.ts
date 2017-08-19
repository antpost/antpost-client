import * as accountSearchAction from '../actions/account-search.action';
import { FbAccount } from '../models/fbaccount.model';
import { LoadingState } from '../models/enums';

export interface State {
    searchGroupMembersState: number,
    accounts: FbAccount[]
}

export const initialState: State = {
    searchGroupMembersState: LoadingState.None,
    accounts: []
};

export function reducer(state: State = initialState, action: accountSearchAction.Actions): State {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case accountSearchAction.SEARCH_INIT:
            return initialState;

        case accountSearchAction.SEARCH_RESET:
            newState.accounts = [];
            return newState;

        case accountSearchAction.SEARCH_GROUP_MEMBERS:
            newState.searchGroupMembersState = LoadingState.Loading;
            return newState;

        case accountSearchAction.SEARCH_GROUP_MEMBERS_CANCELLED:
            newState.searchGroupMembersState = LoadingState.Cancelled;
            return newState;

        case accountSearchAction.SEARCH_PAGE_COMPLETE:
            newState.accounts = [...action.payload];
            return newState;

        case accountSearchAction.SEARCH_COMPLETE:
            return {
                searchGroupMembersState: LoadingState.Completed,
                accounts: []
            };

        default:
            return state;
    }
};

export const getSearchGroupMembersState = (state: State) => state.searchGroupMembersState;
export const getFoundAccounts = (state: State) => state.accounts;
