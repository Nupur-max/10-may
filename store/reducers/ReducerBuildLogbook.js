//import { id } from "prelude-ls";
import { UPDATE_BUILDLOGBOOK } from "../actions/ActionBuildLogbbok";

// const fetch_buildLogBook = async() => {

//     const [id, setId] = React.useState('');

//     let user = await AsyncStorage.getItem('userdetails');
//     user = JSON.parse(user);
  
//     await fetch(BaseUrl+'display_logbook',{
//       method : 'POST',
//       headers:{
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         "user_id": user.id,               
//    })
//   }).then(res => res.json())
//   .then(resData => {
//     //setBuildLogBook(resData.message);
//     console.log('data---->', resData.message);
//     setId(resData.message);
//     console.log('data--------->', data);
//   });
// };

const initialState = {
    userDetails : [],
    userToken: 'this is just a value',
}

const reducerBuildlogBook = (state = initialState, action) => {
  switch(action.type){
    case UPDATE_BUILDLOGBOOK:
      return state;
    default:
      return state;
  }
};

export default reducerBuildlogBook;