import * as types from '../API/apiConstants';

export const updateChampion = (resp) => {
    return {
        type: types.CHAMPION_DATA,
        resp
    };
}