import { LOGIN } from "../actions/loginAction";

const initialState = {
    name: '',
    rosterID : '',
    rosterPwd : '',
    airlineType : '',
    mobile : ''
  }

export const LoginReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:{
          return {...state, name: action.data, rosterID:action.data, rosterPwd:action.data, airlineType:action.data, mobile:action.data}
        }
        default: 
            return state;
    }
  } 