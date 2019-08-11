import { USER_LOADING, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    LOGOUT_SUCCESS,
    MAKE_PREMIUM,
    REGISTER_SUCCESS,
    REGISTER_FAILED, 
    CHANGING_PASSWORD, CHANGED_PASSWORD,
    SOCIAL_LOGIN
} from '../actions/types'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    isPremium: null,
    user: null,
    changePassword: false,
    social: false
};

export default function(state=initialState, action){
    switch(action.type){
        
        case USER_LOADING: 
            return {
                ...state,
                isLoading: true
            };
        case MAKE_PREMIUM:
            
            return {
                ...state,
                isPremium: action.premium,
                // user: action.payload
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                isPremium: action.premium
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload,
                ...action.premium,
                isAuthenticated: true,
                isLoading: false,
                isPremium: action.premium
            }
        case SOCIAL_LOGIN:
                localStorage.setItem("token", action.payload.token);
                return {
                    ...state,
                    ...action.payload,
                    ...action.premium,
                    isAuthenticated: true,
                    isLoading: false,
                    isPremium: action.premium,
                    social: true
                }
        case CHANGED_PASSWORD:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAILED:
            // localStorage.setItem("token", null);
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                changePassword: false
            }

        case CHANGING_PASSWORD:
            // console.log("now the state from reducer is "+(state.isAuthenticated))
            const newState = {
                ...state,
                isAuthenticated: true,
                changePassword: true
            }
            // console.log("new state from reducer is "+newState.token)
            return newState;

        default: 
            return state;
    }
}