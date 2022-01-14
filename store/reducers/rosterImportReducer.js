import { ROSTERIMPORT } from "../actions/rosterImportsAction"

const initialState = {
    anotherText: 'Nupur',
    data: [],
  }

export const rosterImportReducer = (state = initialState, action) => {
    switch(action.type){
        case ROSTERIMPORT:{
            return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 
