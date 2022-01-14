import React from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
//import { View, Text, StyleSheet,ImageBackground } from "react-native";
import Colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Subscribe = ({navigation}) => {
    return (
        <ImageBackground source={require('../images/loginbg.png')}
        imageStyle={{
          resizeMode: "cover",
          opacity: 0.2,
          //alignSelf: "flex-end"
        }}
        style={styles.backgroundImage}>
        <View style={{ width: '100%', paddingHorizontal: 30 }}>
          <View style={styles.card}>
            <Text style={styles.login}>COJO</Text>
            <Text style={styles.mainLine}>App Access {'\n'} (1 year)</Text>
            <Text style={styles.mainLine}>App Access (1 year) {'\n'} Subscription</Text>
            <Text style={styles.mainLine}>1,599.00/- Rupees</Text>
            <TouchableOpacity >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Subscribe Now</Text>
              </View>
            </TouchableOpacity>
            
              <View style={{flexDirection:'row'}}>
                {/* <Text style={styles.mainLine}>Don't have account? </Text> */}
                {/* <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={[styles.mainLine, styles.link]}>Signup</Text></TouchableOpacity> */}
              </View>
              <TouchableOpacity onPress={()=>navigation.navigate('subscribe')}><Text style={[styles.mainLine, styles.link1]}>Restore Purchase</Text></TouchableOpacity>
                <Text style={styles.mainLine}>(in case, Sign in from New/ {'\n'} Second device)</Text>
            </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={[styles.mainLine, styles.link1]}>Go Back</Text></TouchableOpacity>

      </ImageBackground>
    );
  };
  
  // define your styles
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
      //height: Dimensions.get('window').height * 1.3,
    },
    fullWidth:{
      width:'100%',
    },
    card: {
      backgroundColor: '#E6FAFF',
      alignItems: 'center',
      borderRadius: 50,
      opacity: 0.9,
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 30,
      shadowOpacity: 0.5,
      shadowColor: 'black',
      elevation: 8,
    },
    login: {
      fontFamily: 'AbrilFatface-Regular',
      fontSize: 34,
      color: Colors.primary,
    },
    mainLine: {
      textAlign: 'center',
      marginTop: 15,
      fontSize: 20,
      color: Colors.accent,
    },
    alignRight: {
      alignContent: 'flex-end',
      textAlign: 'right',
      width: '100%'
    },
    button: {
      backgroundColor: Colors.primary,
      marginTop: 20,
      padding: 15,
      //alignItems: 'center',
      borderRadius: 10,
      width: '100%',
      minWidth: 300,
      maxWidth: '100%',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center'
    },
    link: {
      color: '#0d70f2',
      fontSize: 15,
      textAlign:'center',
      marginLeft: 7,
    },
    link1: {
      color: '#0d70f2',
      fontSize: 20,
      textAlign:'center',
      marginLeft: 7,
    },
    icon: {
      marginHorizontal:5,
      marginTop: 15,
      position: 'absolute',
      left: 0,
      top: 0,
    },
    inputBox: {
      flexDirection: 'row',
      marginTop:20,
      borderBottomWidth: 0.8,
      width:'100%',
      maxWidth:'100%',
      position: 'relative',
      paddingLeft: 40,
      height: 50,
    },
    textInputBox:{
      width: '100%',
      color: '#266173'
    },
  
  });


export default Subscribe;
