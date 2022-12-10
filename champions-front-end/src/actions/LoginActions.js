import * as types from '../API/apiConstants';
import { type } from 'os';


export const setUser = (resp) => {
    return {
        type: types.USERDATA,
        resp
    };
}

export const setToken = (resp) => {
    return {
        type: types.AUTHENTICATION,
        resp
    };
}

export const userLogout = (resp) => {
    return {
        type: types.USERDATA,
        resp
    };
}


