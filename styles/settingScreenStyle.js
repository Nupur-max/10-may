import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const SsStyle = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 25,
        height: Dimensions.get('window').height,
    },
    settings:{
        fontSize: 28,
        marginTop:10,
        //fontWeight: 'bold',
        marginHorizontal:5,
        color: Colors.primary,
        fontFamily: 'WorkSans-ExtraBold',
    },
    settingsIos: {
        fontSize: 28,
        marginTop:25,
        //fontWeight: 'bold',
        marginHorizontal:5,
        color: Colors.primary,
        fontFamily: 'WorkSans-ExtraBold',
    },
    mainLine:{
        color: Colors.accent,
        marginHorizontal:15,
        marginTop:5,
        fontSize: 15,
        fontFamily: 'WorkSans-VariableFont_wght',
    },
    fields: {
        marginTop: Platform.OS=== 'ios' ? 50 : 30,
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.accent,
        width:'100%',
        flexDirection:'row',
        position:'relative',
    },
    text:{
        marginBottom: 15,
        fontSize: 15,
        color: Colors.primary,
        //fontWeight: 'bold',
        fontFamily:'WorkSans-Regular',
        fontWeight: Platform.OS == 'ios' ? '600' : '700',
        paddingLeft: 8
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 50,
      },
      centeredView1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 10,
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
          width:0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        borderRadius: 10,
        height:300
      },
      modalView1: {
        margin: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
          width:0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        borderRadius: 10,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width:'100%',
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        padding: 5,
        fontSize:20,
        fontFamily: 'WorkSans-Bold',
        color: Colors.primary,
      },
      modalText1: {
        padding: 5,
        fontSize:20,
        fontFamily: 'WorkSans-Bold',
        color: '#fff',
      },
      mainText:{
          fontSize: 14,
          fontFamily: 'WorkSans-Regular',
          padding: 15,
      },
      NetworkImage:{
        height: 102,
        width:102,
      },
      imageView:{
        alignItems:'center',
        paddingVertical: 30,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 2,
      },
      bottomView:{
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: '#fff'
      },
      BottomText:{
        textAlign: 'center',
        fontSize : 15,
        fontFamily : 'WorkSans-Bold',
        color:'#000'
      },
      buttonView: {
        paddingVertical: 5,
        paddingHorizontal: 20,
      },
      button: {
        backgroundColor: Colors.primary,
        padding: 10,
        //marginTop: 20,
        width: Dimensions.get('window').width*0.5,
        borderRadius:10,
        alignItems:'center'
      },
      buttonText:{
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15,
        fontFamily: 'WorkSans-Regular',
      },
      //dark
      DarkModalView:{
        margin: 20,
        backgroundColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
          width:0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        borderRadius: 10,
        height:300
      },
      DarkModalView1:{
        margin: 20,
        backgroundColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
          width:0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        borderRadius: 10,
      },
      DarkBottomView:{
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: '#000'
      },
      DarkBottomText: {
        textAlign: 'center',
        fontSize : 15,
        fontFamily : 'WorkSans-Bold',
        color:'#fff'
      },
});

export default SsStyle;