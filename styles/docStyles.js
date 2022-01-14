import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const DocScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff',
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
      mainTagLine:{
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F3F3F3'
      },
      DarkmainTagLine:{
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000'
      },
      tagLine: {
        fontSize: 20,
        color: '#000',
        // fontWeight: '700',
        fontFamily:'WorkSans-Regular',
        //paddingTop: 5
      },
      DarktagLine:{
        fontSize: 20,
        color: '#fff',
        // fontWeight: '700',
        fontFamily:'WorkSans-Regular',
        //paddingTop: 5
      },
      tabs:{
        width:'100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        padding: 8,  
      },
      lastTab:{
        width:'100%',
        padding: 8,
      },
      tabText:{
          fontSize: 13,
          fontFamily: 'WorkSans-Regular',
          color:'#636363',
      },
      DarktabText:{
        fontSize: 13,
          fontFamily: 'WorkSans-Regular',
          color:'#fff',
      },
      button: {
        backgroundColor: '#256173',
        padding: 15,
        width: Dimensions.get('window').width*0.5,
        borderRadius:30,
        alignItems:'center'
      },
      buttonText:{
        fontWeight: 'bold',
        color: '#fff',
      },
      footer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
      },
});
export default DocScreenStyle;