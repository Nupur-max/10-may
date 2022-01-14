import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const DisplayStyles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'flex-start',
        backgroundColor: '#fff',
        //height: Dimensions.get('window').height*1.5,
        width:'100%',
    },
    headline: {
        padding: 15,
        backgroundColor: '#fff',
        width: '100%',
        justifyContent:'center',
    },
    headline2:{
        marginTop:10,
    },
    HeadlineText:{
        color:'#000',
        fontSize: 14,
        fontFamily: 'WorkSans-ExtraBold',
    },
    fields:{
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.accent,
        paddingHorizontal:15,
        //paddingVertical:10,
        width: '100%',
        justifyContent:'space-between',
        flexDirection:'row',
    },
    fieldText: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '500',
        fontFamily: 'WorkSans-Regular',
        //lineHeight: 25,
        color: '#000',
        },
    fieldText1: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '400',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.accent
    },
    fieldWithoutBottom: {
        paddingHorizontal:10, 
        //paddingVertical:5, 
        width:'100%',
        flexDirection:'row'
    },
    otherEnd: {
        justifyContent: 'space-between'
    },
    underline:{
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.accent,
        //paddingVertical:15,
        width: '100%',
        flexDirection: 'row'
    },
    header:{
        padding:15, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary,
    },
    headerIos: {
    //padding:15, 
    fontFamily:'WorkSans-Regular', 
    fontSize: 20, 
    color: Colors.primary, 
    paddingTop: 42,
    },
    mainHeader:{
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
      myAircraft:{
          padding:10
      },
      AircraftTypeText: {
          padding: 10,
          color: '#000',
          fontFamily: 'WorkSans-Regular',
          //fontSize:15,
      },
      aircraftIdTextInput:{
          backgroundColor:'#fff',
          borderRadius: 10,
          width: Dimensions.get('window').width*0.5,
          padding:5,
      },
      textInputView:{
          padding:10,
          paddingLeft:110,

      },
      blockDropDown:{
        borderRadius:10,
        borderColor: '#F2F2F2',
        borderWidth:1,
        //padding:10,
        padding:10, 
        flexDirection:'row', 
        //justifyContent:'space-between'
      },
      saveChanges : {
          backgroundColor : '#256173',
          padding:2,
          borderWidth: 1,
          borderColor: '#fff',
          borderRadius:5,
      },
      //dark
      DarkHeadline : {
        padding: 15,
        backgroundColor: '#000',
        width: '100%',
        justifyContent:'center',
      },
      DarkHeadlineText:{
        color:'#fff',
        fontSize: 14,
        fontFamily: 'WorkSans-ExtraBold',
      },
      DarkfieldText: { 
        fontSize: 14,
        marginTop: 5,
        fontWeight: '500',
        fontFamily: 'WorkSans-Regular',
        //lineHeight: 25,
        color: '#fff',
    },
    DarkAircraftTypeText :{
        padding: 10,
        color: '#fff',
        fontFamily: 'WorkSans-Regular',
    },
    darkSaveChanges:{
        backgroundColor : '#256173',
        padding:2,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius:10,
    },
   
});
export default DisplayStyles;