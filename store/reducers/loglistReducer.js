import { LOGLIST } from "../actions/loglistAction";

const initialState = {
    inProgress: true,
    data: [],
    downloadCount : '',
    page : 1,
  }

export const LogListReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGLIST:{
          return {...state, data: action.data, inProgress:false, downloadCount:'', page: +1,}
        }
        default: 
            return state;
    }
  } 
