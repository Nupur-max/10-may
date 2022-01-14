import {DISPLAY} from "../actions/displayAction";
import {AIRLINE} from "../actions/displayAction";

const initialState = {
    ActualI : '',
    TimeofAi : '',
    Xc : '',
    SelectedAirline:''
  }

export const DisplayReducer = (state = initialState, action) => {
    switch(action.type){
        case DISPLAY:{
            return {...state,ActualI: action.data }
        }
        case AIRLINE:{
          return {...state,AirlineDispatched: action.data }
      }
        default: 
            return state;
    }
  } 