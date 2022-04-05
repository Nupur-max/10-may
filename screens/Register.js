//import liraries
import React, { Component } from 'react';
import { View, 
Text,
StyleSheet, 
TextInput, 
KeyboardAvoidingView, 
Platform,
TouchableWithoutFeedback,
Keyboard ,
TouchableOpacity,
ScrollView,
Dimensions,
StatusBar,
Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';
import Colors from '../components/colors';

// create a component
const Register = ({navigation}) => {
  const [name, setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [cp, setCp]  = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [cc, setCc] = React.useState('+91');

  //const [selectedCity, setSelectedCity] = React.useState('');
  const [hidden, setHidden] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('india');
  const [items, setItems] = React.useState([
    {label: 'India', value: 'india'},
    {label: 'Afghanistan', value: 'afghanistan'}
  ]);

  //const { dark, theme, toggle } = React.useContext(ThemeContext);

  const myfun = async() => {
    //Alert.alert(petname);
    await fetch(Platform.OS==='ios'?BaseUrl+'register':BaseUrlAndroid+'register',{
        method : 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name":name,
          "email":email,
          "password":pwd,
          "confirm_password" : cp,
          "mobile_number" : mobile,
          "country" : value, 
          "country_code" : cc,
                      
     })
    }).then(res => res.json())
    .then(resData => {
       //console.log(resData);
       Alert.alert(resData.message);
       if(resData.message === 'User Created Successfully'){
        navigation.navigate('Login')
       }
    });
 }
  
    return (
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
        <View
        style={styles.container}>
          <StatusBar hidden={hidden} />
          <View>
          <Text style={Platform.OS === 'android' ? styles.welcome: styles.welcomeIos}>Register</Text>
           <Text style={styles.mainLine}>Login with your account to Continue</Text>
           {/* TextInput */}
           <View style = {styles.inputBox}>
             <Icon name="user" size={20} color='#266173' style={styles.icon} />
             <TextInput style={styles.textInputBox}
             placeholder='Name' 
             placeholderTextColor = "#266173"
             value={name}
             onChangeText={name => setName(name)}/>
           </View>

           <View style = {styles.inputBox}>
             <Icon name="envelope" size={20} color='#266173' style={styles.icon} />
             <TextInput style={styles.textInputBox} 
             placeholder='Email' 
             placeholderTextColor = "#266173"
             value={email}
             onChangeText={email => setEmail(email)}/>
           </View>

           <View style = {styles.inputBox}>
            <MaterialCommunityIcons 
             name="lock-outline" color='#266173' size={20} style={styles.icon}/>
             <TextInput style={styles.textInputBox} 
             placeholder='Password' 
             placeholderTextColor = "#266173"
             value={pwd}
             onChangeText={pwd => setPwd(pwd)}/>
           </View>

           <View style = {styles.inputBox}>
            <MaterialCommunityIcons 
             name="lock-outline" color='#266173' size={20} style={styles.icon}/>
             <TextInput 
             style={styles.textInputBox} 
             placeholder='Confirm Password' 
             placeholderTextColor = "#266173"
             value={cp}
             onChangeText={cp => setCp(cp)}      />
           </View>

          {/* country, CountryCode */}
           <View style={{flexDirection:'row', justifyContent:'space-between', zIndex:9999, position:'relative', elevation:99}}>
              <View style={styles.CountryBox}>  
              <MaterialCommunityIcons 
                name="map-marker-radius-outline" color='#266173' size={20} style={styles.icon}/>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                placeholder='Country'
                placeholderStyle={{
                  color: Colors.primary,
                }}
                arrowIconStyle={{
                  width: 20,
                  height: 20,
                  marginRight: 15, 
                  tintColor: '#266173',
                }}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                 dropDownContainerStyle={{
                    borderColor: '#256173',
                  }}
                listItemLabelStyle={{
                  color: '#256173',
                  width: '100%',
                }}
                textStyle={{
                  fontSize: 14,
                  color: "#266173",
                  lineHeight: 40,
                }}
                style= {{
                  borderColor: 'transparent',
                  marginLeft: 30,
                
                }} 
                />
               </View> 

              <View style={styles.CountryCodeBox}>
              <MaterialCommunityIcons 
                name="xml" color='#266173' size={20} style={styles.icon}/>
              <Text style={{marginLeft:30, lineHeight:50, color: Colors.primary}}>{value==='india' ? '+91' : '+93' }</Text>
              </View>
              </View>

            <View style = {styles.inputBox}>
            <MaterialCommunityIcons 
             name="cellphone" color='#266173' size={20} style={styles.icon}/>
             <TextInput style={styles.textInputBox} 
             placeholder='Mobile No.' 
             placeholderTextColor = "#266173"
             value={mobile}
             onChangeText={mobile => setMobile(mobile)}
             />
           </View>

          </View>
          
           <TouchableOpacity onPress={myfun}>
               <View style={styles.button}>
                   <Text style={styles.buttonText}>Register</Text>
               </View>
           </TouchableOpacity>

           <View style={{paddingTop:20,flexDirection:'row'}} >
              <Text style={{textAlign:'center'}}>Have an account?</Text>
              <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                <Text style={styles.login}>Login</Text>
              </TouchableOpacity>
           </View>
           
        </View>
        </ScrollView>
        </TouchableWithoutFeedback>
        
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        height: Dimensions.get('window').height,
    },
    welcome:{
        fontSize: 28,
        marginTop:10,
        marginHorizontal:5,
        color: Colors.primary,
        fontFamily: 'WorkSans-ExtraBold',
        
    },
    welcomeIos:{
      paddingHorizontal: 5,
      paddingTop: 40,
      fontSize: 28,
      color: Colors.primary,
      fontFamily: 'WorkSans-ExtraBold',
    },
    mainLine:{
        color: Colors.accent,
        marginHorizontal:5,
        marginTop:10,
        fontSize: 15,
        fontFamily: 'WorkSans-Regular',
    },
    inputBox: {
        flexDirection: 'row',
        borderBottomWidth: 0.4,
        width:'100%',
        maxWidth:'100%',
        borderBottomColor: Colors.accent,
        position: 'relative',
        paddingLeft: 40,
        height: 50,
        marginBottom: 10,
        marginTop: 10,
        tintColor: '#000'
      },
    CountryBox:{
        borderBottomWidth: 0.4,
        width:'50%',
        position:'relative',
        marginBottom: 10,
        borderBottomColor: Colors.accent,
    },
    CountryCodeBox:{
        flexDirection: 'row',
        borderBottomWidth: 0.4,
        paddingLeft:10,
        width:'40%',
        position: 'relative',
        marginBottom: 10,
        borderBottomColor: Colors.accent,
    },
    icon: {
      marginHorizontal:5,
      paddingTop: 15,
      position: 'absolute',
      left: 0,
      top: 0,
    },
    button:{
        backgroundColor: Colors.primary,
        marginTop: 50,
        padding: 15,
        alignItems:'center',
        borderRadius:10,
        width: '100%',
        minWidth: 330,
        maxWidth: '100%',
        zIndex: 10,
    },
    buttonText:{
        color: '#fff'
    },
    login:{
        fontSize: 15,
        color: '#256173',
        textAlign:'center',
        marginLeft: 10,
    },
    textInputBox:{
        width: '100%',
        color: '#000'
    },
});

//make this component available to the app
export default Register;
