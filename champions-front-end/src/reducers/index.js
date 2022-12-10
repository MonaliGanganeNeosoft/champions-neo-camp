import { combineReducers } from 'redux'
import * as LoginReducers from './LoginReducers';
import * as HomeReducers from './HomeReducers';
import * as LeadReducers from './LeadReducers';
import * as ChampionReducers from './ChampionReducers'
import * as types from '../API/apiConstants';



const rootReducer = (state, action) => {
    if (types.USER_LOGOUT === 'USER_LOGOUT') {
      state = {}
    }
    return state;
}

const appReducer = combineReducers({
     rootReducer,
     ...LoginReducers,
     ...HomeReducers,
     ...LeadReducers,
     ...ChampionReducers
});

export default appReducer;
