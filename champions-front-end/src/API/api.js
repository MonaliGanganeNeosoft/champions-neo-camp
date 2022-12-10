import {request} from './apiCall';
import { USER_LIST_URL, LOGIN_AUTHENTICATION, GET_CHAMPION_LIST,RESET_PASSWORD, UPLOAD_SESSION_DATA, FORGOT_PASSWORD, SET_CHAMPION_OF_WEEK, UPDATE_CHAMPION_OF_WEEK,GET_CHAMPION_OF_WEEK, ADD_CHAMPION, VOTE_COUNT, VOTE_CHAMPION, DELETE_CHAMPION, GET_TEAM_LIST, UPDATE_CHAMPION, ADD_LEADS, GET_LEADS_LIST, UPDATE_LEADS, DELETE_LEAD, SIGN_UP} from './apiConstants';

export const API = {
    getUserList: (onResponse) => {
        let url = USER_LIST_URL;
        request(onResponse, {}, 'GET', url);
    },
    userLogin: (onResponse, data) => {
        let url = LOGIN_AUTHENTICATION;
        request(onResponse, data, 'POST', url)
    },
    userSignUp: (onResponse, data) => {
        let url = SIGN_UP;
        request(onResponse, data, 'POST', url)
    },
    forgotPassword: (onResponse, data) => {
        let url = FORGOT_PASSWORD;
        request(onResponse, data, 'POST', url)
    },
    resetPassword: (onResponse, data, token) => {
        let url = RESET_PASSWORD + token;
        request(onResponse, data, 'POST', url)
    },
    getChampionList: (onResponse, data) => {
        let url = GET_CHAMPION_LIST;
        request(onResponse, data, 'GET', url);
    },
    getTeamList: (onResponse, data) => {
        let url = GET_TEAM_LIST;
        request(onResponse, data, 'GET', url);
    },
    takeVote: (onResponse, data) => {
        let url = VOTE_CHAMPION;
        request(onResponse, data, 'POST', url);
    },
    getVoteCount: (onResponse, data) => {
        let url = VOTE_COUNT;
        request(onResponse, data, 'GET', url);
    },
    setChampionOfWeek: (onResponse, data) => {
        let url = SET_CHAMPION_OF_WEEK;
        request(onResponse, data, 'POST', url);
    },
    getChampionOfWeek: (onResponse, data) => {
        let url = GET_CHAMPION_OF_WEEK;
        request(onResponse, data, 'GET', url);
    },
    updateChampionOfWeek: (onResponse, data, id) => {
        let url = UPDATE_CHAMPION_OF_WEEK + id;
        request(onResponse, data, 'POST', url);
    },
    addChampion: (onResponse, data) => {
        let url = ADD_CHAMPION;
        request(onResponse, data, 'POST', url);
    },
    updateChampion: (onResponse, data, id) => {
        let url = UPDATE_CHAMPION + id;
        request(onResponse, data, 'POST', url);
    },
    deleteChampion: (onResponse, data) => {
        let url = DELETE_CHAMPION + data;
        request(onResponse, {}, 'DELETE', url);
    },
    getLeadList: (onResponse, data) => {
        let url = GET_LEADS_LIST;
        request(onResponse, data, 'GET', url);
    },
    addLead: (onResponse, data) => {
        let url = ADD_LEADS;
        request(onResponse, data, 'POST', url);
    },
    updateLead: (onResponse, data, id) => {
        let url = UPDATE_LEADS + id;
        request(onResponse, data, 'POST', url);
    },
    deleteLead: (onResponse, id) => {
        let url = DELETE_LEAD + id;
        request(onResponse, {}, 'DELETE', url);
    },
    uploadSessionData: (onResponse, data) => {
        let url = UPLOAD_SESSION_DATA;
        request(onResponse, data, 'POST', url);
    },
};