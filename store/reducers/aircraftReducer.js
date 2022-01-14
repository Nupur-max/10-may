import { AIRCRAFT } from "../actions/aircraftAction";

const initialState = {
   data: [],
}

export const AircraftReducer = (state = initialState, action) => {
    switch(action.type){
        case AIRCRAFT:{
          return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 
