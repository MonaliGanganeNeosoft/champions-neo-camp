import * as types from '../API/apiConstants';

export const setUserList = (resp) => {
    return {
        type: types.USER_LIST,
        resp
    };
}
