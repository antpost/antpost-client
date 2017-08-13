import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromJoinedGroups from './joined-group';
import * as fromAccount from './account';
import * as fromGroupSearch from './group-search';


/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
    account: fromAccount.State;
    joinedGroups: fromJoinedGroups.State;
    groupSearch: fromGroupSearch.State;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
    joinedGroups: fromJoinedGroups.reducer,
    account: fromAccount.reducer,
    groupSearch: fromGroupSearch.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    if (environment.production) {
        return productionReducer(state, action);
    } else {
        return developmentReducer(state, action);
    }
}

/**
 * Accounts
 */
export const getAccountState = (state: State) => state.account;
export const getAccounts = createSelector(getAccountState, fromAccount.getAccounts);
export const getDefaultAccount = createSelector(getAccountState, fromAccount.getDefault);

/**
 * Joined Groups
 */
export const getJoinedGroupState = (state: State) => state.joinedGroups;
export const getJoinedGroups = (uid: string) => {
    return createSelector(getJoinedGroupState, fromJoinedGroups.getJoinedGroups(uid));
};


export const getGroupSearchState = (state: State) => state.groupSearch;
export const getGroupSearchQuery = createSelector(getGroupSearchState, fromGroupSearch.getQuery);
export const getGroupSearchResult = createSelector(getGroupSearchState, fromGroupSearch.getGroups);
