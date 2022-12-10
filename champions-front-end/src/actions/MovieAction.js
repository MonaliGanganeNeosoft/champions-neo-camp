import * as types from '../API/apiConstants';

export const setMovieList = (resp) => {
    return {
        type: types.MOVIE_LIST,
        resp
    }
}