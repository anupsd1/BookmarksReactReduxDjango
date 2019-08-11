import axios from 'axios';
import { GET_LEADS, DELETE_LEAD, ADD_LEAD, GET_ERRORS, MAKE_PREMIUM } from './types';
import cookieClient from 'react-cookies';
import {tokenConfig} from './auth';
import {createMessage, returnErrors} from './messages';
import cookie from 'react-cookies';

//Get leads
//axios.defaults.withCredentials = true;
//axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
//axios.defaults.xsrfCookieName = "csrftoken";


// export const makePremium = () => (dispatch, getState) => {
//     axios
//         .post("api/auth/premium/", tokenConfig(getState))
//         .then(res => {
//             dispatch({
//                 type: MAKE_PREMIUM,
//                 payload: res.data['results']

//             })
                        
//         })
// }


export const getLeads = () => (dispatch, getState) => {
    // console.log(tokenConfig(getState))
    axios
        .get("api/bookmarks/", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_LEADS,
                payload: res.data['results']
            })
        })
        .catch(err=>
                dispatch(returnErrors(err.response.data, err.response.status))
            )
}


// export const getLeads = () => dispatch => {
//     cookie.save('sessionid',"9vqzk7hcob1bkvuuwnumv91hg7bv6xak")
//     axios({
//         method: 'get',
        
//         url: 'api/bookmarks',
//         data: {},
//         //IMPORTANT without auth it was not working even when  we were passing csrftoken and sessionid in headers
//         auth: {
//             xsrfCookieName: cookie            
//         },
//         headers: {
//             withCredentials: true,
//         }
//     })
//     .then(res => {
//             dispatch({
//                 type: GET_LEADS,
//                 payload: res.data['results']
//                 //payload: res.data
//             });
//         })    

//         .catch(err => console.log(err));
// }


//DELETE LEAD
export const deleteLead = id => (dispatch, getState) => {
    axios
        .delete(`api/bookmarks/${id}`, tokenConfig(getState))
        .then(res=>{
            dispatch(createMessage({
                deleteLead: "Bookmark Deleted"
            }));
            dispatch({
                type: DELETE_LEAD,
                payload: id
            })
        })
        .catch(err => console.log(err));
}



// export const deleteLead = id => (dispatch) => {
//     axios({
//         method: 'delete',
//         url: `/api/bookmarks/${id}/`,
//         auth: {
//             username: 'lenovo',
//             password: 'anup@123'
//         },
//         headers: {
//             withCredentials: true
//         }
//     })
//     .then(res=>{
//         console.log(res);
//         dispatch(createMessage({
//             deleteBookmark: 'Bookmark Deleted'
//         }))
//         dispatch({
//             type: DELETE_LEAD,
//             //Since in response data is set to null and the data is deleted, the id is passed to the reducer to 
//             //immediately filter the component by removing the item from frontend
//             payload: id
//         })
//     })
//     .catch(err=>console.log(err))
        
// }


//ADD LEAD- 
export const addLead = lead => (dispatch, getState) => {
    console.log("FROM ACTIONS = "+lead)
    axios
        .post("api/bookmarks/", lead, tokenConfig(getState))
        .then(res=>{
            console.log(res)
            dispatch(createMessage({
                addLead: "Bookmark Added"
            }))
            dispatch({
                type: ADD_LEAD,
                payload: res.data
            })
        })
        .catch(err => 
                dispatch(returnErrors(err.response.data, 
                    err.response.status))
            )
}




// Here the lead is taken as parameter to the addLead const but dispatch is the parameter taken for the whole function 
//i.e. by addLead(lead) function to make it an action creator
// export const addLead = (lead) => dispatch => {
//     axios
//         .post("/api/bookmarks/", lead, {auth: {username: "lenovo",
//                 password: "anup@123"
//             }}, {headers:{withCredentials: true}})
//             .then(res => {
//                 dispatch(
//                     createMessage({
//                         addBookmark: "Bookmark Added"
//                     })
//                 )
//                 dispatch({
//                     type: ADD_LEAD,
//                     /**
//                      * Was written as payload: res.data['results'] thinking that it returns all the data in response after sending post 
//                      */
//                     payload: res.data
//                 })
//             })
//             .catch(err=>{
//                 const errors = {
//                     msg: err.response.data,
//                     status: err.response.status,            
//                 }
//                 //console.log(errors)
//                 dispatch({
//                     type: GET_ERRORS,
//                     payload: errors
//                 })
//                 //console.log(err.response.data)
//                 //console.log(err.response.status)
//             });
//         }

//     axios({
//         method: "post",
//         url: ("api/bookmarks/", lead),
//        // data: lead, //the data to be added is passed to the server
//         auth: {
//             username: "lenovo",
//             password: "anup@123"
//         },
//         headers: {
//             withCredentials: true
//         }
//     })
//     .then(res => {
//         dispatch({
//             type: ADD_LEAD,
//             //All the data is returned from the server after adding the new data
//             payload: res.data['results']
//         })
//     })
//     .catch(err=>{
//         const errors = {
//             msg: err.response.data,
//             status: err.response.status,            
//         }
//         console.log(errors)
//         dispatch({
//             type: GET_ERRORS,
//             payload: errors
//         })
//         //console.log(err.response.data)
//         //console.log(err.response.status)
//     });
// }