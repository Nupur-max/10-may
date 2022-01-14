import { APPROACH } from "../actions/ApproachAction";

const initialState = {
    ApproachNo : '',
    ApproachType : '',
    Runway : '',
    Airport : ''
  }

export const ApproachReducer = (state = initialState, action) => {
    switch(action.type){
        case APPROACH:{
            return {...state, ApproachNo: action.data, ApproachType: action.data, Runway: action.data, Airport: action.data}
        }
        default: 
            return state;
    }
  } 