//import liraries
import React from 'react';
import { View, Text,SafeAreaView, TouchableOpacity, ImageBackground, TextInput, Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SetPeopleScreenStyle from '../../styles/setPeopleStyles';
import { useSelector, useDispatch } from 'react-redux';
import { ParamsContext } from '../../params-context';

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
const SetPeople = ({navigation,route}) => {
  
  const dataDispatcher = useDispatch();
    const [image, setImage] = React.useState(null);
    const [imageData, setImageData] = React.useState('');
    const [imageFilename, setImageFilename] = React.useState('');
    const [name, setName] = React.useState('')
    const [airlineCode, setAirlineCode] = React.useState('')
    const [egcaId, setEgcaId ] = React.useState('')
    const [comments, setComments] = React.useState('')

    const [, setParamsPic ] = React.useContext(ParamsContext);
    const [, setParamsSic ] = React.useContext(ParamsContext);

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
        formData.append('name', name);
        formData.append('emp_code', egcaId); 
        formData.append('airline', airlineCode);
        formData.append('comments', comments);
        const splittedBase64 = imageData.split(';base64');
        formData.append('img', splittedBase64[1]);
        var Url = Platform.OS==='ios'?BaseUrl+'add_people':BaseUrlAndroid+'add_people'
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

    const [userAirlineType,setUserAirlineType] = React.useState('')

    React.useEffect(() => {
      GetUserDetails()
      }, []);
    
      const GetUserDetails = async () => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let temData = [];
        db.transaction(tx => {
          tx.executeSql('SELECT airline_type FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
            if (result.rows.length > 0) {
            }
            else {
              console.log('error')
            }
            for (let i = 0; i <= result.rows.length; i++) {
              temData.push({
                airline_type: result.rows.item(i).airline_type,
              });
              setUserAirlineType(result.rows.item(i).airline_type)
             }
            });
        });
      }

    //sqlite 
  
    const insertQuery = async() => {
      if (!name) {
        alert('Please fill name');
        return;
      }
      // if (!imageData) {
      //   alert('Please insert image');
      //   return;
      // }
      // if (!airlineCode) {
      //   alert('Please fill Airline Code');
      //   return;
      // }
      // if (!egcaId) {
      //   alert('Please fill Egca ID');
      //   return;
      // }
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO pilots (Airline,Egca_reg_no,Name,pilotId,selectedAirline,comments) VALUES ("'+userAirlineType+'","'+egcaId+'","'+name+'", "'+airlineCode+'", "'+userAirlineType+'", "'+comments+'")',
        );
      });
      //alert('Saved successfully');
    };

    //sqlite ends

    const selectParams = () =>{ 
      if(route.params.from === 'pic'){
      setParamsPic(previousParams => ({
        ...(previousParams || {}),
      RoasterP1:egcaId === 'self' || egcaId=== '' ? name : name+'('+egcaId+')',
      }));
    }
    else if(route.params.from === 'sic'){
      setParamsSic(previousParams => ({
        ...(previousParams || {}),
        RoasterP2:egcaId === 'self' || egcaId=== '' ? name : name+'('+egcaId+')',
      }));
    }
      navigation.navigate('CreateLogbook');
    }

    return (
      <ScrollView style={[SetPeopleScreenStyle.container, {backgroundColor: theme.backgroundColor}]}>
        <SafeAreaView >
            
            <View style={SetPeopleScreenStyle.header}>
            <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
            <Text style={SetPeopleScreenStyle.aircrafts}>Add People</Text>
            </View>

            {/* image */}
            <View style={[{padding: 20, backgroundColor: '#fff', width:'100%', alignItems:'center'}, 
            {backgroundColor: theme.backgroundColor}]}>
                    <TouchableOpacity onPress={()=>selectingImage()}>
                      <ImageBackground source={
                          image === null
                          ? require('../../images/circle.png')
                          : image
                          } 
                          style={{height:150, width:150}}>
                            <View style={{alignItems:'center', paddingTop: 25}}>
                            <MaterialCommunityIcons  
                            name="account-supervisor-outline" color={dark?'#fff':'#000'} size={80} style={{}}/>
                            </View>
                            <View style={{marginLeft:110,backgroundColor:'#fff'}}>
                            <MaterialCommunityIcons  
                            name="account-edit" color={'#000'} size={40} style={{}}/>
                            </View>
                          </ImageBackground>
                    </TouchableOpacity>     
            </View>
            
            <View style={SetPeopleScreenStyle.textView}>
              <Text style={SetPeopleScreenStyle.textStyle}>Name</Text>
            </View>
            <View style={{paddingHorizontal:10}}>
            <View style={SetPeopleScreenStyle.textViewInput}>
              <TextInput
                placeholder='Enter Name'
                value={name}
                onChangeText = {inputText=>setName(inputText)}
                style={[SetPeopleScreenStyle.textStyleInput,{color:dark?'#fff':'#000'}]}
              />
            </View>
            </View>

            <View style={SetPeopleScreenStyle.textView}>
              <Text style={SetPeopleScreenStyle.textStyle}>Airline Code</Text>
            </View>
            <View style={{paddingHorizontal:10}}>
            <View style={SetPeopleScreenStyle.textViewInput}>
              <TextInput
                placeholder='Enter code'
                value={airlineCode}
                onChangeText = {inputText=>setAirlineCode(inputText)}
                style={[SetPeopleScreenStyle.textStyleInput,{color:dark?'#fff':'#000'}]}

              />
            </View>
            </View>

            <View style={SetPeopleScreenStyle.textView}>
              <Text style={SetPeopleScreenStyle.textStyle}>EGCA ID</Text>
            </View>
            <View style={{paddingHorizontal:10}}>
            <View style={SetPeopleScreenStyle.textViewInput}>
              <TextInput
                placeholder='Enter EGCA ID'
                value={egcaId}
                onChangeText={inputText=> setEgcaId(inputText)}
                style={[SetPeopleScreenStyle.textStyleInput,{color:dark?'#fff':'#000'}]}

              />
            </View>
            </View>

            <View style={SetPeopleScreenStyle.textView}>
              <Text style={SetPeopleScreenStyle.textStyle}>Comments</Text>
            </View>
            <View style={{paddingHorizontal:10}}>
            <View style={SetPeopleScreenStyle.textViewInput}>
              <TextInput
                placeholder='Enter Comments'
                value={comments}
                onChangeText={(inputText)=>setComments(inputText)}
                style={[SetPeopleScreenStyle.textStyleInput,{color:dark?'#fff':'#000'}]}

              />
            </View>
            </View>
          
            <TouchableOpacity onPress={()=>{insertQuery();uploadDataToServer();selectParams()}}>
                <View style= {{alignItems:'center'}}>
                <View style={SetPeopleScreenStyle.button}>
                <Text style={SetPeopleScreenStyle.buttonText}>Save</Text>
                </View>
                </View>
            </TouchableOpacity>

        </SafeAreaView>
        </ScrollView>
    );
};

// define your SetPeopleScreenStyle


//make this component available to the app
export default SetPeople;
