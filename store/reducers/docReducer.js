import { DOCS } from "../actions/docAction";

const initialState = {
    selectedData : [],
    
  }

export const docReducer = (state = initialState, action) => {
    switch(action.type){
        case DOCS:{
            return {...state, selectedData: action.data}
        }
        default: 
            return state;
    }
  } 
