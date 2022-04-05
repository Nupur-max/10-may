//import liraries
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, Dimensions, Alert } from 'react-native';
import  Colors  from '../../components/colors';
import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from "react-redux";

import {BaseUrl} from '../../components/url.json';
import {BaseUrlAndroid} from '../../components/urlAndroid.json';

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'autoflightlogdb.db',
    createFromLocation: 1,
    //location: 'www/autoflightlogdb.db',
  },
  () => {
    //alert('successfully executed');
  },
  error => {
    alert('db error');
  },
);

// create a component
const SetDestination = ({navigation, route}) => {
    const [image, setImage] = React.useState(null);
    const [imageData, setImageData] = React.useState('');
    const [imageFilename, setImageFilename] = React.useState('');

    // const [category, setCategory] = React.useState('');
    // const [engine, setEngine] = React.useState('');
    // const [Class, setClass] = React.useState('');
     
    const [ident, setIdent] = React.useState('');
    const [airportName, setAirportName] = React.useState('');
    const [type, setType] = React.useState('');
    const [city1, setCity1] = React.useState('');
    const [city2, setCity2] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [lat, setLat] = React.useState('');
    const [long, setLong] = React.useState('');
    const [al, setAl] = React.useState('');
    const [tz, setTz] = React.useState('');
    const [day_light, setDay_light] = React.useState('');
    const [icao, setICAO] = React.useState('');
    const [iata, setIATA] = React.useState('');

    const getReduxData = useSelector(state => state.cl.AircraftType);

    React.useEffect(() => {selectQuery()}, []);

    const selectQuery = () => {
      let tempdata = [];
        db.transaction(tx => {
          if (route.params.from === 'From') {
          tx.executeSql('SELECT * FROM Airport_table WHERE ICAO_code="'+getReduxData.FromICAO+'"', [], (tx, result) => {
            if (result.rows.length > 0) {
            
            for (let i = 0; i <= result.rows.length; i++) {
              tempdata.push({
                airportID : result.rows.item(i).airportID,
                ident: result.rows.item(i).ident,
                name: result.rows.item(i).name,
                type : result.rows.item(i).type,
                city1 : result.rows.item(i).city1,
                city2 : result.rows.item(i).city2,
                country: result.rows.item(i).country,
                latitude : result.rows.item(i).latitude,
                longitude: result.rows.item(i).longitude,
                elevation: result.rows.item(i).elevation,
                timezone: result.rows.item(i).timezone,
                DST: result.rows.item(i).DST,
                DST_Status: result.rows.item(i).DST_Status,
                DST_StartDate: result.rows.item(i).DST_StartDate,
                DST_EndDate: result.rows.item(i).DST_EndDate,
                ICAO_code : result.rows.item(i).ICAO_code,
                IATA_code : result.rows.item(i).IATA_code,
                source : result.rows.item(i).source,
              
              });
                setIdent(result.rows.item(i).ident)
                setAirportName(result.rows.item(i).name)
                setType(result.rows.item(i).type)
                setCity1(result.rows.item(i).city1)
                setCity2(result.rows.item(i).city2)
                setCountry(result.rows.item(i).country)
                setLat(result.rows.item(i).latitude)
                setLong(result.rows.item(i).longitude)
                setAl(result.rows.item(i).elevation)
                setTz(result.rows.item(i).timezone)
                setDay_light(result.rows.item(i).DST)
                setICAO(result.rows.item(i).ICAO_code)
                setIATA(result.rows.item(i).IATA_code)
              }
            }
          });
        }
        else if (route.params.from === 'to'){
          tx.executeSql('SELECT * FROM Airport_table WHERE ICAO_code="'+getReduxData.toICAO+'"', [], (tx, result) => {
            if (result.rows.length > 0) {
            
            for (let i = 0; i <= result.rows.length; i++) {
              tempdata.push({
                airportID : result.rows.item(i).airportID,
                ident: result.rows.item(i).ident,
                name: result.rows.item(i).name,
                type : result.rows.item(i).type,
                city1 : result.rows.item(i).city1,
                city2 : result.rows.item(i).city2,
                country: result.rows.item(i).country,
                latitude : result.rows.item(i).latitude,
                longitude: result.rows.item(i).longitude,
                elevation: result.rows.item(i).elevation,
                timezone: result.rows.item(i).timezone,
                DST: result.rows.item(i).DST,
                DST_Status: result.rows.item(i).DST_Status,
                DST_StartDate: result.rows.item(i).DST_StartDate,
                DST_EndDate: result.rows.item(i).DST_EndDate,
                ICAO_code : result.rows.item(i).ICAO_code,
                IATA_code : result.rows.item(i).IATA_code,
                source : result.rows.item(i).source,
              
              });
                setIdent(result.rows.item(i).ident)
                setAirportName(result.rows.item(i).name)
                setType(result.rows.item(i).type)
                setCity1(result.rows.item(i).city1)
                setCity2(result.rows.item(i).city2)
                setCountry(result.rows.item(i).country)
                setLat(result.rows.item(i).latitude)
                setLong(result.rows.item(i).longitude)
                setAl(result.rows.item(i).elevation)
                setTz(result.rows.item(i).timezone)
                setDay_light(result.rows.item(i).DST)
                setICAO(result.rows.item(i).ICAO_code)
                setIATA(result.rows.item(i).IATA_code)
              }
            }
          });
        }
        });
    }

    const selectingImage = () => {
        ImagePicker.showImagePicker({quality: 0.3}, responseGet => {
          console.log('Response = ', responseGet);
   
          if (responseGet.didCancel) {
            console.log('User cancelled image picker');
          } else if (responseGet.error) {
            console.log('ImagePicker Error: ', responseGet.error);
          } else {
            const source = {uri: responseGet.uri};
            console.log(source)
               setImage(source)
               setImageData("image/jpg;base64"+responseGet.data)

          }
        });
      };

      const uploadDataToServer = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let formData = new FormData();
        formData.append('user_id', user.id); 
        const splittedBase64 = imageData.split(';base64');
        formData.append('airport_image', splittedBase64[1]);
        var Url = Platform.OS==='ios'?BaseUrl+'addAirportImage':BaseUrlAndroid+'addAirportImage'
          fetch(Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }).then(response => response.json())
        .then(response => {
          console.log('On task Creation: ', response);
        })
        .catch(error => {
          console.log('You can not proceed', error);
        });
    };

   const { dark, theme, toggle } = React.useContext(ThemeContext);  

    //sql queries
    
    const insertQuery = () => {
        if (!airportName) {
          alert('Please fill airportName');
          return;
        }
        if (!city1) {
          alert('Please fill City1');
          return;
        }
        if (!country) {
          alert('Please fill Country');
          return;
        }
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO Airport_table (ident, name, type, city1, city2, country, latitude, longitude, elevation, timeZone, DST, ICAO_code, IATA_code) VALUES ("'+ident+'", "'+airportName+'", "'+type+'", "'+city1+'" , "'+city2+'", "'+country+'", "'+lat+'", "'+long+'", "'+al+'", "'+tz+'", "'+day_light+'", "'+icao+'", "'+iata+'")',
          );
        });
        alert('Saved successfully');
      };

      const getDataQuery = () => {
        let data = [];
        db.transaction(tx => {
          tx.executeSql('SELECT * from Places', [], (tx, result) => {
            if (result.rows.length > 0) {
            }
            for (let i = 1; i <= result.rows.length; i++) {
              data.push({
                ident: result.rows.item(i).ident,
                Airport_name: result.rows.item(i).airport_name,
                type: result.rows.item(i).type,
                city: result.rows.item(i).city,
                country: result.rows.item(i).country,
                lat: result.rows.item(i).lat,
                long: result.rows.item(i).long,
                altitude: result.rows.item(i).Altitutde,
                timeZone: result.rows.item(i).timeZone,
                Day_light_saving: result.rows.item(i).Day_light_saving,
                icao_code: result.rows.item(i).icao_code,
                iata_code: result.rows.item(i).iata_code,
              });
            }
          });
        });
      };

    return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Text style={Platform.OS=== 'android' ? styles.save: styles.saveIos}>Back</Text>
            </TouchableOpacity>

            {/* image */}
            <View style={[{padding: 20, backgroundColor: '#fff', width:'100%', alignItems:'center'}, 
            {backgroundColor: theme.backgroundColor}]}>
                    <TouchableOpacity onPress={()=>selectingImage()}>
                    { dark ? <Image source={
                          image === null
                          ? require('../../images/whiteJet.png')
                          : image
                          } 
                          style={{height:90, width:90}}/>
                          :<Image source={
                          image === null
                          ? require('../../images/2.png')
                          : image
                          } 
                         style={{height:70, width:70}}/>}
                    </TouchableOpacity>     
            </View>

<ScrollView>
            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline}}>
            <Text style={styles.fieldText}>Ident</Text>
            <TextInput 
                placeholder=' Enter Ident'
                placeholderTextColor='#393F45'
                value = {ident}
                onChangeText = {(inputText)=>setIdent(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Airport Name*</Text>
            <TextInput 
                placeholder='Enter Airport Name'
                placeholderTextColor='#393F45'
                value = {airportName}
                onChangeText = {(inputText)=>setAirportName(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Type</Text>
            <TextInput 
                placeholder='Small/Medium/Large'
                placeholderTextColor='#393F45'
                value = {type}
                onChangeText = {(inputText) => setType(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>City1*</Text>
            <TextInput 
                placeholder='Enter City1'
                placeholderTextColor='#393F45'
                value = {city1}
                onChangeText = {(inputText) => setCity1(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>City2</Text>
            <TextInput 
                placeholder='Enter City2'
                placeholderTextColor='#393F45'
                value = {city2}
                onChangeText = {(inputText) => setCity2(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Country*</Text>
            <TextInput 
                placeholder='Enter Country'
                placeholderTextColor='#393F45'
                value = {country}
                onChangeText = {(inputText) => setCountry(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Lat</Text>
            <TextInput 
                placeholder='12.345 For N/- FOR S'
                placeholderTextColor='#393F45'
                value = {lat}
                onChangeText = {(inputText) => setLat(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Long</Text>
            <TextInput 
                placeholder='12.345 For E/- FOR W'
                placeholderTextColor='#393F45'
                value = {long}
                onChangeText = {(inputText) => setLong(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Altitude</Text>
            <TextInput 
                placeholder='Enter Altitude'
                placeholderTextColor='#393F45'
                value = {al}
                onChangeText = {(inputText) => setAl(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Time Zone</Text>
            <TextInput 
                placeholder='+(-)HH:MM'
                placeholderTextColor='#393F45'
                value = {tz}
                onChangeText = {(inputText) => setTz(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>Day Light Saving</Text>
            <TextInput 
                placeholder='X'
                placeholderTextColor='#393F45'
                value = {day_light}
                onChangeText = {(inputText) => setDay_light(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>ICAO Code</Text>
            <TextInput 
                placeholder='Enter ICAO'
                placeholderTextColor='#393F45'
                value = {icao}
                onChangeText = {(inputText) => setICAO(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline }}>
            <Text style={styles.fieldText}>IATA Code</Text>
            <TextInput 
                placeholder='Enter IATA'
                placeholderTextColor='#393F45'
                value = {iata}
                onChangeText = {(inputText) => setIATA(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <TouchableOpacity onPress={()=>{insertQuery();uploadDataToServer()}}>
                <View style= {{alignItems:'center'}}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
                </View>
                </View>
            </TouchableOpacity>

</ScrollView>
</View>
);
  };

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff',
    },
    headline: {
        padding: 20,
        backgroundColor: Colors.primary,
        width: '100%',
        justifyContent:'center',
    },
    HeadlineText:{
        color:'#fff',
        fontSize: 14,
        fontFamily: 'WorkSans-Regular',
    },
    fieldWithoutBottom: {
        paddingHorizontal:15, 
        //paddingVertical:10, 
        width:'100%',
        flexDirection:'row'
    },
    otherEnd: {
        justifyContent: 'space-between'
    },
    fieldText: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '500',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.primary,
        },
    underline:{
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.accent,
        //paddingVertical:15,
        width: '100%',
        flexDirection: 'row'
        },
    fieldTextRadio: {
            fontSize: 14,
            //marginTop: 5,
            fontWeight: '500',
            fontFamily: 'WorkSans-Regular',
            lineHeight: 30,
            color: Colors.primary,
        },
    fields:{
            borderBottomWidth: 0.2,
            borderBottomColor: Colors.accent,
            //paddingHorizontal:15,
            //paddingVertical:15,
            width: '100%',
            justifyContent:'space-between',
            flexDirection:'row',
        },
    halfViews: {
            paddingHorizontal: 15,
            flexDirection: 'row',
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
});

//make this component available to the app
export default SetDestination;
