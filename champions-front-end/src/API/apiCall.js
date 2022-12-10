import axios from 'axios';
import { getKeyLength } from '../utils/CommonFunctions';
import { store } from '../index';
import * as types from '../API/apiConstants';

var isLogginOut = false;

export const buildHeader = (headerParams) => {
    var header =  {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Cache-Control': 'no-cache'
    }
    Object.assign(header, headerParams);
    return header;
}

export const request = (onResponse, data, type, featureURL, isFormData) => {
    let state = store.getState();
    let secureRequest;
    if(!state.token){
        secureRequest = buildHeader({})
    }
    else{
        secureRequest=buildHeader({ 'x-access-token' : state.token})
    }
    if(isFormData) 
        secureRequest={ ...secureRequest, 'Content-Type' :'multipart/form-data' };
    if(onResponse.complete) onResponse.complete();
    api_call(onResponse, data, type, featureURL, secureRequest);
}

export const api_call = (onResponse, data, type, featureURL, secureRequest, currentApiData={}) => {
    var call_api;
    if(type==='GET'){
        call_api=axios.request({
            url:featureURL,
            method:type,
            params: data,
            headers: secureRequest,
          });
    }
    else if(type==='PATCH'){
        call_api=axios.patch(featureURL, data, {headers: secureRequest});
    }
    else if(type === 'POST'){
        call_api=axios.post(featureURL,data, {headers: secureRequest});
    }
    else{
        call_api=axios({
            url:featureURL,
            method:type,
            data: data,
            headers: secureRequest
          });
    }
    call_api.then(response => {
        if (response.status !== 200  && response.status !== 201) {
           onResponse.error(response);
        }
        else{
            onResponse.success(response.data);
        }
    }).catch(error => {
        console.log('Error Response', error);
        if(error.response && error.response.data){
            let errorResponse = error.response.data;
            if(errorResponse.status === 400){
                if(errorResponse.details && errorResponse.details[0]){
                    alert(errorResponse.details[0]);
                }else{
                    alert(errorResponse.message);
                }
            }
        }
        if(error.response && error.response.status === 401){
            console.log("Token Expired!!");
            store.dispatch({
                type: types.USER_LOGOUT,
                resp: true
            });
            if(!isLogginOut){
                isLogginOut = true;
                alert("Token Expired!!");
                setTimeout(()=> isLogginOut = false,1000)
            }
        }
        onResponse.error(error);
    });
}

export const api_call_fetch = (onResponse, data, type, featureURL, secureRequest, currentApiData={}) => {
    var call_api;
    if(type==='GET'){
        call_api = fetch(featureURL, {
            method: type,
            headers: secureRequest
        });
    }
    else{
        call_api = fetch(featureURL, {
            method: type,
            headers: secureRequest,
            body: data
        });
    }
    call_api.then(response => {
        return response.json().then((resp) => {
            return {response: resp, status: response.status}
        })
    })
    .then(response => {
        console.log('Response =======> ',response);
        if (response.status !== 200 && response.status !== 201) {
            getKeyLength(currentApiData)!==0 ? onResponse.error(response, currentApiData) : onResponse.error(response);
        }
        getKeyLength(currentApiData)!==0 ?  onResponse.success(response, currentApiData) : onResponse.success(response);
    }).catch(error => {
        console.log('Error Response', error);
        error = "Error: In api catch";
        getKeyLength(currentApiData)!==0 ? onResponse.error(error, currentApiData) : onResponse.error(error);
    });
}