import {Group} from '../models/group.model';
import * as groupSearch from '../actions/group-search';

export interface State {
    query: string;
    groups: Array<Group>
}

export const initialState: State = {
    query: '',
    groups: []
};

export function reducer(state = initialState, action: groupSearch.Actions) {
    switch (action.type) {
        case groupSearch.SEARCH:
            return {
                query: action.payload,
                groups: state.groups
            };
        case groupSearch.SEARCH_COMPLETE:
            return {
                query: state.query,
                groups: action.payload.map(g => Object.assign({}, g))
            };

        default:
            return state;
    }
}

export const getQuery = (state: State) => state.query;
export const getGroups = (state: State) => state.groups;
