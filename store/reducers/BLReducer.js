import { BUILDLOGBOOK } from "../actions/BLAction";

const initialState = {
    data : []
}

export const BuildLogbookReducer = (state = initialState, action) => {
    switch(action.type){
        case BUILDLOGBOOK:{
            return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 
