import { BACKUP } from "../actions/backupAction";

const initialState = {
    BackupTime : ''
}

export const BackupReducer = (state = initialState, action) => {
    switch(action.type){
        case BACKUP:{
            return {...state, BackupTime: action.data}
        }
        default: 
            return state;
    }
  } 
