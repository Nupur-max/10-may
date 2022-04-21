import { CREATELOGBOOK } from "../actions/CLAction";

const initialState = {
    AircraftType : '',
    FromICAO : '',
    toICAO : '',
    p1Name : '',
    p2Name : '', 
  }

export const CreateLogbookReducer = (state = initialState, action) => {
    switch(action.type){
        case CREATELOGBOOK:{
            return {...state, AircraftType: action.data, FromICAO: action.data, toICAO: action.data, p1Name: action.data, p2Name: action.data}
        }
        default: 
            return state;
    }
  } 
