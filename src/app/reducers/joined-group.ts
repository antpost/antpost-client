import { Group } from '../models/group.model';
import * as joinedGroup from '../actions/joined-group';

export interface State {
    accounts: Array<any>;
}

export const initialState: State = {
    accounts: []
};

export function reducer(state = initialState, action: joinedGroup.Actions): State {
    switch (action.type) {
        case joinedGroup.LOAD:
            return state;
        case joinedGroup.LOAD_COMPLETE:
            if(action.payload) {
                let newState = {
                    accounts: state.accounts.map(acc => Object.assign({}, acc))
                };
                let account = newState.accounts.find(a => action.payload.id);
                if(account) {
                    account.groups = action.payload.groups;
                } else {
                    newState.accounts.push(action.payload);
                }

                return newState;
            }

        default:
            return state;
    }
};

export const getJoinedGroups = (uid: string) => {
    return (state: State) => {
        let account = state.accounts.find(a => a.id == uid);
        return account ? account.groups : null;
    };
}
