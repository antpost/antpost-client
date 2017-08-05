import {FbAccount} from '../models/fbaccount.model';
import * as account from '../actions/account';

export interface State {
    accounts: Array<FbAccount>;
    defaultAccount: FbAccount;
}

export const initialState: State = {
    accounts: [],
    defaultAccount: null
};

export function reducer(state = initialState, action: account.Actions): State {
    switch (action.type) {
        case account.LOAD:
            return state;
        case account.LOAD_COMPLETE:
            return {
                accounts: action.payload,
                defaultAccount: action.payload.length > 0 ? action.payload[0] : null
            };

        default:
            return state;
    }
};

export const getAccounts = (state: State) => state.accounts;
export const getDefault = (state: State) => state.defaultAccount;
