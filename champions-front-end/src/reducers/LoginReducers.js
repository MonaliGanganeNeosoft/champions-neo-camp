import * as types from '../API/apiConstants';

export const userData = (state = JSON.parse(localStorage.getItem(types.USERDATA)), action) => {
    switch (action.type) {
        case types.USERDATA:
            return action.resp;
        default:
            return state
    }  
};

export const token = (state = JSON.parse(localStorage.getItem(types.AUTH_TOKEN)), action) => {
    switch(action.type) {
        case types.AUTHENTICATION:
            return action.resp.token;
        default:
            return state
    }
};

