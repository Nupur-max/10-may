import { CREATELOGBOOK } from "../actions/CLAction";

const initialState = {
    AircraftType : '',
    FromICAO : '',
    toICAO : '',
  }

export const CreateLogbookReducer = (state = initialState, action) => {
    switch(action.type){
        case CREATELOGBOOK:{
            return {...state, AircraftType: action.data, FromICAO: action.data, toICAO: action.data}
        }
        default: 
            return state;
    }
  } 
