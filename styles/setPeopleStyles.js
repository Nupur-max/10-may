import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const SetPeopleScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff',
    },
    save: {
        padding:10, 
        fontFamily:'WorkSans-Regular', 
        fontSize:20, 
        color: Colors.primary
      },
      saveIos: {
        paddingTop:40, 
        paddingLeft: 10, 
        fontFamily:'WorkSans-Regular', 
        fontSize:20, 
        color: Colors.primary
      },
      button: {
        backgroundColor: Colors.primary,
        padding: 15,
        marginTop: 20,
        width: Dimensions.get('window').width*0.5,
        borderRadius:10,
        alignItems:'center'
    },
    buttonText:{
      fontWeight: 'bold',
      color: '#fff',
    },
    header:{
        padding: 5,
        flexDirection: 'row',
        backgroundColor: '#256173'
      },
      aircrafts: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '700',
        fontFamily:'WorkSans-Regular',
        paddingTop: 5
      },
      textView: {
          padding: 10,
      },
      textStyle:{
        fontSize: 14,
        fontFamily:'WorkSans-Regular',
      },
      textViewInput:{
          paddingHorizontal: 2,
          borderColor: '#F2F2F2',
          borderWidth: 1,
          borderRadius : 10,
          width: '100%',
      },
      textStyleInput :{
          fontSize : 12,
          //color: '#D0D0D0',
      }
});

export default SetPeopleScreenStyle;