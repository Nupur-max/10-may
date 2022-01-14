import { DOCLIST } from "../actions/DocListAction";

const initialState = {
    anotherText: 'Nupur',
    data: [],
  }

export const DocListReducer = (state = initialState, action) => {
    switch(action.type){
        case DOCLIST:{
            return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 