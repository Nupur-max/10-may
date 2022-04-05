//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import  Colors  from '../components/colors';
import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton,} from 'react-native-paper';
import { ThemeContext } from '../theme-context';
import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';
import { useSelector, useDispatch } from "react-redux";
import { saveAircrafts, loadNotes } from "../store/reducers/aircraftReducer";
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
const SetAircraft = ({navigation, route}) => {
    const [image, setImage] = React.useState(null);
    const [imageData, setImageData] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [engine, setEngine] = React.useState('');
    const [Class, setClass] = React.useState('');

    const [aircraft_type, setAircraft_type] = React.useState('');
    const [aircraft_id, setAircraft_id] = React.useState('');
    const [engineName, setEngineName] = React.useState('');

    const getReduxData = useSelector(state => state.cl.AircraftType);
    //console.log ('hehhh', getReduxData.AircraftType)

    React.useEffect(() => {selectQuery()}, []);

    const selectQuery = () => {
      let tempdata = [];
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Aircrafts WHERE AircraftType="'+getReduxData.AircraftType+'"', [], (tx, result) => {
            if (result.rows.length > 0) {
            
            for (let i = 0; i <= result.rows.length; i++) {
             //console.log('name: ', result.rows.item(i).id)
              tempdata.push({
                id: result.rows.item(i).id,
                AircraftType: result.rows.item(i).AircraftType,
                aircraft_id : result.rows.item(i).aircraft_id,
                Category : result.rows.item(i).Category,
                Engine : result.rows.item(i).Engine,
                EngineName: result.rows.item(i).EngineName,
                Class : result.rows.item(i).Class,
                Crew: result.rows.item(i).Crew,
                });
                //console.log('hdsfddfdh',tempdata);
                setAircraft_type(result.rows.item(i).AircraftType)
                setAircraft_id(result.rows.item(i).aircraft_id)
                setCategory(result.rows.item(i).Category)
                setEngine(result.rows.item(i).Engine)
                setEngineName(result.rows.item(i).EngineName)
                setClass(result.rows.item(i).Class)
              }
            }
          });
        });
    }

    const selectingImage = () => {
        ImagePicker.showImagePicker({quality: 0.3}, responseGet => {
          //console.log('Response = ', responseGet);
   
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
        formData.append('aircraft_name', aircraft_type);
        formData.append('category', category);
        const splittedBase64 = imageData.split(';base64');
        formData.append('aircraftPhoto', splittedBase64[1]);
        // console.log('form data' , data._parts[0][1].uri)
        //console.log('form data' , formData)
        var Url = Platform.OS==='ios'?BaseUrl+'add_logbook':BaseUrlAndroid+'add+logbook'
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
      if (!aircraft_type) {
        alert('Please fill Aircrfat Type');
        return;
      }
      if (!category) {
        alert('Please Select Category');
        return;
      }
      
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Aircrafts (AircraftType, aircraft_id, Category, Engine, EngineName, class) VALUES ("'+aircraft_type+'", "'+aircraft_id+'", "'+category+'", "'+engine+'", "'+engineName+'", "'+Class+'")',
        );
      });
      alert('Saved successfully');
    };

  return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Text style={Platform.OS=== 'android' ? styles.save: styles.saveIos}>Back</Text>
            </TouchableOpacity>

            {/* image */}
            <View style={[{padding: 20, backgroundColor: '#fff', width:'100%', alignItems:'center'}, 
            {backgroundColor: theme.backgroundColor}]}>
                    <TouchableOpacity onPress={()=>selectingImage()}>
                    { dark ? <Image source={
                          image === null
                          ? require('../images/whiteJet.png')
                          : image
                          } 
                          style={{height:90, width:90}}/>
                          :<Image source={
                          image === null
                          ? require('../images/2.png')
                          : image
                          } 
                         style={{height:70, width:70}}/>}
                    </TouchableOpacity>     
            </View>

            <View style={dark?styles.Darkheadline:styles.headline}>
                <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Aircraft</Text>
            </View>

<ScrollView>
            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...styles.underline}}>
            <Text style={styles.fieldText}>Aircraft Type</Text>
            <TextInput 
                placeholder='Aircraft Type'
                placeholderTextColor='#393F45'
                value={aircraft_type}
                onChangeText={(inputText)=> setAircraft_type(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, }}>
            <Text style={styles.fieldText}>Aircraft ID</Text>
            <TextInput 
                placeholder='Aircraft ID'
                placeholderTextColor='#393F45'
                value={aircraft_id}
                onChangeText = {(inputText) => setAircraft_id(inputText)}
                style={{marginTop: -5,color:dark?'#fff':'#000'}} />
            </View>

            {/* Category */}
            <View style={dark?styles.Darkheadline:styles.headline}>
                <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Category <Text style={{color:'red'}}>*</Text></Text>
            </View>

            <View style={styles.fieldWithoutBottom}>
            <View style={{flexDirection:'row'}}> 
            <RadioButton.Android
                value="Air Plane"
                status={ category === 'Air Plane' ? 'checked' : 'unchecked' }
                onPress={() => setCategory('Air Plane')}
                color = '#256173'
                uncheckedColor = '#256173'
                labelStyle={{marginRight: 20}}
            />
            <Text style={styles.fieldTextRadio}>Air Plane</Text>
            </View>
            <View style={{flexDirection:'row', paddingLeft:78,}}>
            <RadioButton.Android
                value="microlight"
                status={ category === 'microlight' ? 'checked' : 'unchecked' }
                onPress={() => setCategory('microlight')}
                color = '#256173'
                uncheckedColor = '#256173'
                labelStyle={{marginRight: 20}}
            />
            <Text style={styles.fieldTextRadio}>Microlight</Text>
            </View>
        </View>
        <View style={styles.fieldWithoutBottom}>
            <View style={{flexDirection:'row',}}> 
            <RadioButton.Android
                value="Helicopter"
                status={ category === 'Helicopter' ? 'checked' : 'unchecked' }
                onPress={() => setCategory('Helicopter')}
                color = '#256173'
                uncheckedColor = '#256173'
                labelStyle={{marginRight: 20}}
            />
            <Text style={styles.fieldTextRadio}>Helicopter</Text>
            </View>
            <View style={{flexDirection:'row', paddingLeft:70}}>
            <RadioButton.Android
                value="glider"
                status={ category === 'glider' ? 'checked' : 'unchecked' }
                onPress={() => setCategory('glider')}
                color = '#256173'
                uncheckedColor = '#256173'
                labelStyle={{marginRight: 20}}
            />
            <Text style={styles.fieldTextRadio}>Glider</Text>
            </View>
        </View>
        
        {/* Engine */}
        <View style={dark?styles.Darkheadline:styles.headline}>
          <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Engine</Text>
        </View>

        <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
         <RadioButton.Android
            value="Jet"
            status={ engine === 'Jet' ? 'checked' : 'unchecked' }
            onPress={() => setEngine('Jet')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Jet</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:40,}}>
        <RadioButton.Android
            value="Turbo Prop"
            status={ engine === 'Turbo Prop' ? 'checked' : 'unchecked' }
            onPress={() => setEngine('Turbo Prop')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Turbo Prop</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:25,}}>
        <RadioButton.Android
            value="Turbo Shaft"
            status={ engine === 'Turbo Shaft' ? 'checked' : 'unchecked' }
            onPress={() => setEngine('Turbo Shaft')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Turbo-Shaft</Text>
        </View>
      </View>
    <View style={styles.fieldWithoutBottom}>
          <View style={styles.underline}>
        <View style={{flexDirection:'row',}}> 
         <RadioButton.Android
            value="Piston"
            status={ engine === 'Piston' ? 'checked' : 'unchecked' }
            onPress={() => setEngine('Piston')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Piston</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:23}}>
        <RadioButton.Android
            value="notPowered"
            status={ engine === 'notPowered' ? 'checked' : 'unchecked' }
            onPress={() => setEngine('notPowered')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Not Powered</Text>
        </View>
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Engine Name</Text>
           <TextInput 
            placeholder='Engine Name'
            placeholderTextColor='#393F45'
            value={engineName.toString()}
            onChangeText={(engineName) => setEngineName(engineName)}
            style={{marginTop: -5,color:dark?'#fff':'#000'}} />
        </View>
        </View>

        <View style={styles.halfViews}>
              <View style={{justifyContent:'center', width:'30%'}}>
                  <Text style={styles.fieldText}>Class</Text>
              </View>
              <View style={{width:'70%'}}>
              <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
         <RadioButton.Android
            value="ME Land"
            status={ Class === 'ME Land' ? 'checked' : 'unchecked' }
            onPress={() => setClass('ME Land')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>ME Land</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft: 20,}}>
        <RadioButton.Android
            value="ME Sea"
            status={ Class === 'ME Sea' ? 'checked' : 'unchecked' }
            onPress={() => setClass('ME Sea')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>ME Sea</Text>
        </View>
      </View>
      <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row',}}> 
         <RadioButton.Android
            value="SE Land"
            status={ Class === 'SE Land' ? 'checked' : 'unchecked' }
            onPress={() => setClass('SE Land')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>SE Land</Text>
        </View>
      <View style={{flexDirection:'row', paddingLeft:25}}>
        <RadioButton.Android
            value="SE Sea"
            status={ Class === 'SE Sea' ? 'checked' : 'unchecked' }
            onPress={() => setClass('SE Sea')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>SE Sea</Text>
        </View>
      </View>
      </View>
      </View>

      <TouchableOpacity onPress={()=>{insertQuery(), uploadDataToServer()}}>
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
        backgroundColor: '#fff',
    },
    headline: {
        padding: 20,
        backgroundColor: '#EFEFEF',
        width: '100%',
        justifyContent:'center',
    },
    Darkheadline: {
      padding: 20,
      backgroundColor: '#000',
      width: '100%',
      justifyContent:'center',
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
        width: '100%',
        flexDirection: 'row'
        },
    fieldTextRadio: {
            fontSize: 14,
            fontWeight: '500',
            fontFamily: 'WorkSans-Regular',
            lineHeight: 30,
            color: Colors.primary,
        },
    fields:{
            borderBottomWidth: 0.2,
            borderBottomColor: Colors.accent,
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
export default SetAircraft;
