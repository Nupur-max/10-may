import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const BackupStyle = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    IconSection: {
      //padding:5,
      backgroundColor: '#d3d3d3', 
      alignItems: 'center'
    },
    fieldText: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '600',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.primary,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 5,
        //marginTop: 20,
        width: '100%',
        borderRadius:5,
        alignItems:'center'
    },
    buttonText:{
      fontWeight: 'bold',
      color: '#fff',
    },
    header:{
        padding:10, 
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
    Topheader:{
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
      backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerImage: {
          alignItems: 'center'
      },
      Vector: {
        width: 87.5,
        height: 81.25,
      },
      buttonText:{
        fontWeight: 'bold',
        color: '#fff',
      },
      button: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        //marginTop: 20,
        width: Dimensions.get('window').width*0.5,
        borderRadius:10,
        alignItems:'center'
    },
    headlineView:{
      alignItems: 'center'
    },
    headlineText:{
      fontFamily:'WorkSans-Bold',
      fontSize: 36,
      color: '#000',
      paddingBottom: 15,
    },
    //dark
    DarkHeadlineText:{
      fontFamily:'WorkSans-Bold',
      fontSize: 36,
      color: '#fff',
      paddingBottom: 15,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      //marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: 'rgba(52, 52, 52, 0.6)',
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      }
      },
});

export default BackupStyle;