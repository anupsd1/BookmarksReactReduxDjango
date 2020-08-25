import axios from 'axios';
import { returnErrors, createMessage } from './messages';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    CHANGED_PASSWORD,
    CHANGING_PASSWORD,
    SOCIAL_LOGIN,
    MAKE_PREMIUM
} from './types'


const fetchurl = "http://127.0.0.1:8000/"

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    //User Loading
    dispatch({
        type: USER_LOADING
    })

    axios.get(fetchurl+'api/auth/user/', tokenConfig(getState))
        .then(res=>{
            // console.log(res)
            console.log("FROM LOAD USER = "+res.data)
            console.log("FROM LOAD USER = "+res.data.user)
            // console.log(res.data.premium)
            dispatch({
                type: USER_LOADED,
                payload: res.data,
                premium: res.data.premium
            })
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR
            })
        })
}


// MAKE PREMIUM
export const makePremium = (email, premium) => (dispatch, getState) => {
    // Request body
    const body = JSON.stringify({
        premium
    })
    axios
        .put(fetchurl+"api/auth/updatepremium/", body, tokenConfig(getState))
        .then(res=>{
            console.log("MAKE PREMIUM RES = "+JSON.stringify(res.data))
            dispatch({
                type: MAKE_PREMIUM,
                premium: res.data.user.premium,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR
            })
        })
    
}


// LOGIN USER
export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({
        username, password
    })
    
    console.log("in  login")
    console.log(fetchurl+"api/auth/login/", body, config)
    axios
        .post(fetchurl+"api/auth/login/", body, config)
        .then(res => {
            console.log("FRON KIGUB="+JSON.stringify(res))
            console.log("FROM KIGUB="+res.data.user.premium)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
                premium: res.data.user.premium
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            })
        })
}


// LOGIN USER VIA GMAIL
export const gmaillogin = ( first_name, last_name, email, user_id, provider, access_token ) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request body
    
    const body = JSON.stringify({
        first_name, last_name, email, user_id, provider, access_token
    })

   // console.log("body="+body);
   //User Loading
   dispatch({
        type: USER_LOADING
    })

    axios
        .post(fetchurl+'newauth/login/', body, config)
        .then(res => {
            console.log("FROM GMAIL LOGIN = " + JSON.stringify(res.data));
            console.log("FROM GMAILLOGIN = "+res.data.user.premium)
            dispatch({
                type: SOCIAL_LOGIN,
                payload: res.data,
                premium: res.data.user.premium
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            })
        })
}




// REGISTER USER - Here username, email and password are passed in curly braces because an object is passed from Register.js
export const register = ({ username, email, password, first_name, last_name }) => dispatch => {
    
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request Body
    const body = JSON.stringify({ username, email, password, first_name, last_name });

    axios
        .post(fetchurl+"api/auth/register/", body, config)
        .then(res =>{
            console.log("AFTER REGISTER"+JSON.stringify(res.data))
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data,
                err.response.status)
            );
            dispatch({
                type: REGISTER_FAILED
            })
        })
}



// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    // null is the body and it won't work without passing the body. it is the syntax when passing headers using POST request
    axios
        .post(fetchurl+"api/auth/logout/", null, tokenConfig(getState))
        .then(res=> {
            dispatch({
                type: LOGOUT_SUCCESS
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        })
}


// CHANGING PASSOWRD
export const changingPassword = () => (dispatch, getState) => {
    dispatch({
        type: CHANGING_PASSWORD,
        payload: tokenConfig(getState)
    })
}


// CHANGE PASSWORD
export const changePassword = (old_password, new_password) => (dispatch, getState) => {
    
    // Request body
    const body = JSON.stringify({
        old_password, new_password
    });

    axios
        .put("api/auth/changepassword/", body, tokenConfig(getState))
        .then(res=>{
            console.log(res.data)
            dispatch(createMessage({
                passwordChanged: res.data
            }))
            
            dispatch({
                type: CHANGED_PASSWORD,
                
            })
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status))
        })
}


// SET TOKEN HEADERS
export const tokenConfig = (getState) => {
    // Get token from state
    const token = getState().auth.token;

    // Headers 
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
}