import { GET_LEADS, DELETE_LEAD, ADD_LEAD } from "../actions/types.js";

const initialState = {
    leads: []
}

export default function(state=initialState, action){
    switch(action.type){
        //GET_LEADS action is called as it is when the document is loaded so the initialState is populated here and then it can be used by ADD_LEAD
        case GET_LEADS:
            return{
                ...state,
                leads: action.payload
            };
        case DELETE_LEAD:
            return{
                ...state,
                leads: state.leads.filter(bookmark => bookmark.id !== action.payload)
            };

        case ADD_LEAD: 
            console.log(action.payload)
            return{
                ...state,
                //The following line calls the existing state.leads which was populated by GET_LEADS action.
                /*
                    Made a huge mistake by returning res.data['results'] in actions/leads.js thinking that it worked the same in GET_LEADS.
                    But when an item is sent by post to add something to the API the response is different from the response you get when you 
                    do a get call to your API. The error detection took two days since I had to debug properly what was happening.
                    The item was getting added to the database but the page didnt load and gave an error in console saying that the
                    components/leads/Leads.js file was using an undefined property id.
                /*/
                leads: [...state.leads, action.payload]
            }

        default:
            return state;
    }
}