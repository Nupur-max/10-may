import { PILOTLIST } from "../actions/pilotsAction";

const initialState = {
    anotherText: 'Nupur',
    data: [],
  }

export const PilotsReducer = (state = initialState, action) => {
    switch(action.type){
        case PILOTLIST:{
            return {...state, data: action.data}
        }
        default: 
            return state;
    }
  } 