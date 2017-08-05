import { Group } from '../models/group.model';
import * as joinedGroup from '../actions/joined-group';

export interface State {
    groups: Array<Group>;
    loaded: boolean;
}

export const initialState: State = {
    groups: [],
    loaded: false
};

export function reducer(state = initialState, action: joinedGroup.Actions): State {
    switch (action.type) {
        case joinedGroup.LOAD:
            return state;
        case joinedGroup.LOAD_COMPLETE:
            return {
                groups: action.payload,
                loaded: true
            };

        default:
            return state;
    }
};

export const getIds = (state: State) => state.groups.map(g => g.id);

export const getJoinedGroups = (state: State) => state.groups;

export const getIsLoaded = (state: State) => state.loaded;
