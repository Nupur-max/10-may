import { EGCADETAILS } from "../actions/egcaDetailsAction";

const initialState = {
    anotherText: 'Nupur',
    data: [],
  }

export const EGCADetailsReducer = (state = initialState, action) => {
    switch(action.type){
        case EGCADETAILS:{
            return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 