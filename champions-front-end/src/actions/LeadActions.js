import * as types from '../API/apiConstants';

export const updateLead = (resp) => {
    return {
        type: types.LEAD_DATA,
        resp
    };
}