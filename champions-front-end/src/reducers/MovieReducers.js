import * as types from '../API/apiConstants';

export const movieList = (state =[], action) => {
    switch (action.type) {
        case types.MOVIE_LIST:
            return action.resp;
        default:
            return state;
    }
}