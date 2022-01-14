import { TOTALTYPE } from "../actions/totalTypeAction";

const initialState = {
   totalType : ''
}

export const TotalTypeReducer = (state = initialState, action) => {
    switch(action.type){
        case TOTALTYPE:{
            return {...state, totalType: action.data}
        }
        default: 
            return state;
    }
  } 