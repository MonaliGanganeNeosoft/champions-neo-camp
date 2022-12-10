import * as types from '../API/apiConstants';

export const userList = (state = [], action) => {
    switch (action.type) {
        case types.USER_LIST:
            return action.resp;
        default:
            return state
    }
};