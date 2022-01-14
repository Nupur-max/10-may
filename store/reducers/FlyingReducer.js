import { FLYING } from "../actions/flyingAction";

const initialState = {
    FlyingData : [],
    totalFlyingHours : ''
}

export const FlyingReducer = (state = initialState, action) => {
    switch(action.type){
        case FLYING:{
            return {...state, FlyingData: action.data, totalFlyingHours: action.data}
        }
        default: 
            return state;
    }
  } 
