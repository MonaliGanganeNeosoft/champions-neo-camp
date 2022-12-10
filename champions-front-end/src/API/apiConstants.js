//URLS
export const BASE_URL = "http://localhost:3026/api";
// export const BASE_URL = 'https://neosoftchampions.herokuapp.com/api';
// export const BASE_URL = "http://180.149.241.208:3026/api";

export const USER_LIST_URL = BASE_URL + "/users";
export const SIGN_UP = BASE_URL + "/users/signUp";
export const FORGOT_PASSWORD = BASE_URL + "/users/forgotPassword";
export const RESET_PASSWORD = BASE_URL + "/users/resetPassword/";

//constants
export const USERDATA = "USERDATA";
export const USER_LIST = "USER_LIST";
export const AUTH_TOKEN = "AUTH_TOKEN";
export const AUTHENTICATION = "AUTHENTICATION";
export const MOVIE_LIST = "MOVIE_LIST";
export const LEAD_DATA = "LEAD_DATA";
export const CHAMPION_DATA = "CHAMPION_DATA";
export const USER_LOGOUT = "USER_LOGOUT";
export const LOGIN_AUTHENTICATION = BASE_URL + "/users/autenticate";
export const GET_CHAMPION_LIST = BASE_URL + "/champion";
export const GET_TEAM_LIST = BASE_URL + "/champion/team";
export const ADD_CHAMPION = BASE_URL + "/champion/create";
export const UPDATE_CHAMPION = BASE_URL + "/champion/update/";
export const DELETE_CHAMPION = BASE_URL + "/champion/delete/";
export const GET_LEADS_LIST = BASE_URL + "/leads";
export const ADD_LEADS = BASE_URL + "/leads/create";
export const UPDATE_LEADS = BASE_URL + "/leads/update/";
export const DELETE_LEAD = BASE_URL + "/leads/delete/";
export const VOTE_CHAMPION = BASE_URL + "/vote";
export const VOTE_COUNT = BASE_URL + "/vote/count";
export const SET_CHAMPION_OF_WEEK = BASE_URL + "/championOfWeek";
export const GET_CHAMPION_OF_WEEK = BASE_URL + "/championOfWeek/champions";
export const UPDATE_CHAMPION_OF_WEEK = BASE_URL + "/championOfWeek/update/";
export const UPLOAD_SESSION_DATA = BASE_URL + "/session/upload/";
