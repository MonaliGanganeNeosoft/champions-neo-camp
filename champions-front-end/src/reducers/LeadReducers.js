import * as types from '../API/apiConstants';

export const leadData = (state = [], action) => {
    switch (action.type) {
        case types.LEAD_DATA:
            return action.resp;
        default:
            return state
    }  
};

