import { PROGRESS } from "../actions/progressAction";

const initialState = {
    totalvalue : '',
    ProgressValue : '', 
    rosterTotalValue : '',
    rosterProgressValue : '',
}

export const ProgressReducer = (state = initialState, action) => {
    switch(action.type){
        case PROGRESS:{
            return {...state, ProgressValue: action.data,totalvalue: action.data, rosterTotalValue:action.data, rosterProgressValue: action.data}
        }
        default: 
            return state;
    }
  } 