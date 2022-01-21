import { StyleSheet, Dimensions, Platform } from "react-native";
import Colors from  '../components/colors';

const DgcaLogbookStyles = StyleSheet.create({
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
      mainTagLine: {
          padding:10,
      },
      DarkmainTagLine:{
        padding:10,
      },
      tagLine: {
          fontFamily: 'WorkSans-Bold',
          color : '#000',
          fontSize: 16,
          fontWeight: Platform.OS == 'ios' ? '600' : '700'
      },
      DarktagLine:{
        fontFamily: 'WorkSans-Bold',
          color : '#fff',
          fontSize: 14,
      },
      radioText:{
          fontFamily:'WorkSans-Regular',
          fontSize: 14,
          color: '#636363',
          paddingTop:8,
          fontWeight: Platform.OS == 'ios' ? '600' : '700'
      },
      DarkradioText:{
        fontFamily:'WorkSans-Regular',
          fontSize: 13,
          color: '#fff',
          paddingTop:5
      },
      radioSection: {
          padding:5,
          borderBottomColor: '#DDDDDD',
          borderBottomWidth: 1,
      },
      pageDetailText:{
        fontFamily:'WorkSans-Regular',
        fontSize: 14,
        color: '#636363',
        fontWeight: Platform.OS == 'ios' ? '600' : '700'
      },
      TextInputView:{
          borderColor: '#000',
          borderWidth:0.3,
          borderRadius : 5,
          width:'100%',
          padding:5
      },
      DarkTextInputView:{
        borderColor: '#fff',
        borderWidth:0.3,
        borderRadius : 5,
        width:'100%',
        padding:5,
        color: '#fff',
    },
      footer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
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
    }
});

export default DgcaLogbookStyles;