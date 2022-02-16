import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const Logbook = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    header:{
        padding:15, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary,
    },
    headerIos: {
    padding:15, 
    fontFamily:'WorkSans-Regular', 
    fontSize: 20, 
    color: Colors.primary, 
    paddingTop: 42,
    },
    headline: {
        padding: 10,
        backgroundColor: "#F3F3F3",
        width: '100%',
        //justifyContent:'center',
        flexDirection: 'row'
    },
    Darkheadline: {
        padding: 10,
        backgroundColor: "#000",
        width: '100%',
        //justifyContent:'center',
        flexDirection: 'row'
    },
    HeadlineText:{
        color:'#000',
        fontSize: 14,
        fontFamily: 'WorkSans-Regular',
    },
    DarkHeadlineText:{
        color:'#fff',
        fontSize: 14,
        fontFamily: 'WorkSans-Regular',
    },
    fieldWithoutBottom: {
        paddingHorizontal:15, 
        //paddingVertical:10, 
        width:'100%' ,
        flexDirection:'row'
    },
    fieldWithoutBottom1: {
        paddingHorizontal:15,
        //paddingVertical:10, 
        width:'65%',
        flexDirection:'row',
        borderRightWidth: 2,
        borderRightColor: Colors.accent
    },
    fieldWithoutBottom2: {
        paddingHorizontal:10, 
        //paddingVertical:10, 
        width:'34%',
        flexDirection:'row',
        //alignItems: 'center'
    },
    fields:{
        borderBottomWidth: 0.4,
        borderBottomColor: Colors.accent,
        //paddingHorizontal:15,
        //paddingVertical:15,
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
    },
    fieldsRadio:{
        borderBottomWidth: 0.4,
        borderBottomColor: Colors.accent,
        //paddingHorizontal:15,
        //paddingVertical:15,
        width: '100%',
        justifyContent:'space-around',
        flexDirection:'row',
    },
    fieldText: {
        fontSize: 14,
        paddingLeft: 12,
        fontWeight: '500',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.primary,
        },

    clock: {
        paddingVertical: 10,
        paddingHorizontal:'40%'
    },
    fieldTextRadio: {
        fontSize: 14,
        //marginTop: 5,
        fontWeight: '600',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 30,
        color: Colors.primary,
    },
    remarksBox: {
        borderWidth:0.3, 
        borderRadius:10,
        borderColor: Colors.accent, 
        width: Dimensions.get('window').width * 0.9,
        padding:10,
        
      },
      buttonView:{
          flex:2,
          padding:10,
          backgroundColor: '#c0c0c0',
          width: '100%',
          alignItems: 'center',
          position:'absolute',
          bottom:0,
      },
      DarkbuttonView:{
        padding:10,
        backgroundColor: '#000',
        width: '100%',
        alignItems: 'center',
        position:'absolute',
        bottom:0,
    },
      button: {
        backgroundColor: Colors.primary,
        padding: 5,
        //marginTop: 20,
        width: Dimensions.get('window').width*0.3,
        borderRadius:20,
        alignItems:'center'
    },
    buttonText:{
      fontWeight: 'bold',
      color: '#fff',
    },
    CommentsBox:{
        borderWidth:1, 
        borderRadius:5,
        borderColor: '#000', 
        width: Dimensions.get('window').width * 0.9,
        padding: Platform.OS=== 'android' ? 10: 20,
        marginTop: 10,
        marginBottom:10,
    },
    
});

const LogbookListing = StyleSheet.create({
    arrow: {
        paddingTop: Platform.OS === 'ios' ? 40: 20,
        paddingLeft: Platform.OS === 'ios' ? 340: 350,
    },
    searchbar: {
        //paddingLeft: 10,
        backgroundColor: '#fff',
        //padding: 10,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        //paddingVertical: 10,
      },
      searchbar2: {
          //paddingLeft: 10,
          backgroundColor: '#fff',
          //padding: 10,
          width: '80%',
          borderRadius: 10,
          flexDirection: 'row',
          //paddingVertical: 10,
        },
        cancelButton: {
            fontSize: 15,
            marginLeft: 10,
            marginTop: 5,
            //paddingHorizontal:150,
        },
        DarkcancelButton: {
            fontSize: 15,
            marginLeft: 10,
            marginTop: 5,
            color: '#fff',
        },
        listing:{
            //borderBottomColor: Colors.accent,
            //borderBottomWidth: 0.3,
            borderRadius: 10,
            borderWidth:0.3,
            width: '100%',
            paddingHorizontal:10,
            paddingVertical: 10,
            shadowColor: '#000',
            elevation:2,
    
        },
        Darklisting:{
            //borderBottomColor: Colors.accent,
            //borderBottomWidth: 0.3,
            borderRadius: 10,
            borderWidth:0.3,
            width: '100%',
            paddingHorizontal:10,
            paddingVertical: 10,
            shadowColor: '#000',
            elevation:2,
            borderColor:'#fff'
        },
        bottomView: {
            padding: 10,
            backgroundColor: '#c0c0c0',
            width: '100%',
            borderTopColor: Colors.accent,
            borderTopWidth: 0.5,
            position:'absolute',
            bottom:0,
            //flexDirection:'row',
        },
        DarkbottomView: {
            padding: 10,
            backgroundColor: '#000',
            width: '100%',
            borderTopColor: '#000',
            borderTopWidth: 0.5,
            position:'absolute',
            bottom:0,
            //flexDirection:'row',
        },
        headline: {
            padding: 10,
            backgroundColor: '#000',
            width: '100%',
            borderTopColor: Colors.accent,
            borderTopWidth: 0.5,
            position:'absolute',
            bottom:0,
            //flexDirection:'row',
        },
        item:{
            padding: 10,
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
});

const ModalView= StyleSheet.create({
    Modal: {
        borderBottomWidth: 0.2, 
        borderBottomColor:Colors.accent,
        padding:10,
        width:'100%',
        flexDirection:'row'
    },
    ModalHeading: {
        fontSize: 14,
        color:'#7B7B7B',
        fontFamily:'WorkSans-Regular'
    },
    FlightcenteredView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    flightModalView:{
      marginLeft: '5%',
      backgroundColor: "white",
      borderRadius:10,
      //padding: 10,
      alignItems: "center",
      shadowColor: "#000",
    //   shadowOffset: {
    //     width: 0,
    //     height: 2
    //   },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width:'50%',
      //position: 'absolute',
      //bottom: '1%'
    },
    modalText:{
        fontSize:11,
        padding:5
    },
    ModalListingText : {
        color: '#000',
        fontFamily:'WorkSans-Regular',
        fontSize : 14, 
    },
    DarkModalListingText : {
        color: '#fff',
        fontFamily:'WorkSans-Regular',
        fontSize : 14, 
    },
    modalViewTextInput: {
        padding:10,
        width:'100%',
        backgroundColor: '#fff',
        borderRadius: 10
    },
});

const configuration = StyleSheet.create({
    headerView: {
        backgroundColor:'rgba(0,0,0,0.3)',
        padding: 10, 
        width:'100%'
    },
    saveTextView: {
        paddingTop:Platform.OS=== 'ios'?30:10, 
        paddingBottom:10
    },
    saveText : {
        color:'#fff', 
        fontSize:18
    },

});
const Filter = StyleSheet.create({
    filterBox: {
       flexDirection:'row',
       borderWidth:0.5,
       borderColor: Colors.primary,
       paddingHorizontal: 35,
       paddingVertical:3,
       marginBottom:5
    },
    VerticalLine: {
        borderRightWidth:0.5,
        borderRightColor: Colors.primary,
        paddingHorizontal:10,
    },

});

const Approach = StyleSheet.create({
     header: {
        paddingTop: Platform.OS === 'ios' ? 35 : 10,
        paddingBottom:10,
        paddingLeft:10, 
        fontSize:20,
        color: Colors.primary
     },
});
export {Logbook, LogbookListing, ModalView, configuration, Filter, Approach};