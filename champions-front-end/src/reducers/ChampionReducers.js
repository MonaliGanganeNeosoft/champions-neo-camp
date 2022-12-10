import * as types from '../API/apiConstants';

export const championData = (state = [], action) => {
    switch (action.type) {
        case types.CHAMPION_DATA:
            return action.resp;
        default:
            return state
    }  
};

