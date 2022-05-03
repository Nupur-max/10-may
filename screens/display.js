//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, SafeAreaView,KeyboardAvoidingView,Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton, List, Switch } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';
import { ThemeContext } from '../theme-context';
import { DisplayContext } from '../display-context';
import ModalDropdown from 'react-native-modal-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../params-context';
import DisplayStyles from '../styles/displayStyles'
import { DisplayData } from '../store/actions/displayAction';
import { TotalTypeData } from '../store/actions/totalTypeAction';
import { useSelector, useDispatch } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import { useIsFocused } from "@react-navigation/native";
import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';

import SsStyle from '../styles/settingScreenStyle';

const prePopulateddb = SQLite.openDatabase(
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
const Display = ({navigation}) => {

  const isFocused = useIsFocused();

    const dataDispatcher = useDispatch();
    const getReduxData = useSelector(state => state.display.ActualI);
    //console.log ('hjhygtdfd', getReduxData)

    const[aircraftType, setAircraftType] = React.useState('')
    const[aircraftId, setAircraftId] = React.useState('')

    console.log('idddddd',aircraftId)

    const [params] = React.useContext(ParamsContext);

    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
      if (isFocused) {
        //console.log('The value of child param is: ', params.childParam1);
        setAircraftId(params.displayAirId)
        setAircraftType(params.RoasterAType)
      }
    }, [isFocused]);

    const [country, setCountry] = React.useState(false);
    const [instrument, setInstrument] = React.useState(false);
    const [approach, setApproach] = React.useState(false);
    const [blockTimeValue, setBlockTimeValue] = React.useState('00:15');
    const blockTime = ['00:15','00:30','00:45','00:60']

    const handleActualInstrument = () => {
        dataDispatcher(DisplayData({ActualI: instrument, TimeofAi: blockTime[blockTimeValue], Xc: country}))
        // if(blockTime[blockTimeValue]===undefined){
        //   alert('Please Select Block Time to proceed!')
        // }
        // else{
        // //alert('Changes Saved')
        // }
        //console.log('Pressed',blockTime[blockTimeValue]);
    }

    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const { datee, Dateform, DateFormat, role, roleChecked } = React.useContext(DisplayContext);

    console.log('roleeee',role)

    React.useEffect(() => {
      //if(isFocused){
      SelectQuery()
      //}
    },[]);
    
    //Sql starts
    const SelectQuery = async() => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      let selectedData = []; 
      prePopulateddb.transaction(tx => {
          tx.executeSql(
              'SELECT * from displayDetails WHERE user_id = "'+user.id+'"', [], (tx, result) => {
                  for (let i = 0; i <= result.rows.length; i++) {
                  selectedData.push({
                    aircraftType :  result.rows.item(i).aircraftType, 
                    aircraftId :  result.rows.item(i).aircraftId, 
                    role :  result.rows.item(i).role,
                    blockTime : result.rows.item(i).blockTime,

                   });
                   console.log('selected Data', selectedData)
                   setAircraftType(result.rows.item(i).aircraftType)
                   setAircraftId(result.rows.item(i).aircraftId)
                  }
              }
          );
      });
  }

    const insertDisplayDetails = async() => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      // if (!role) {
      //   alert('Please select role');
      //   return;
      // }
      // if (!blockTimeValue) {
      //   alert('Please select Block time to proceed');
      //   return;
      // }
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT * FROM displayDetails Where user_id = "'+user.id+'"', [], (tx, result) => {
          //setOffset(offset + 10);
          if (result.rows.length > 0) {
            tx.executeSql('UPDATE displayDetails set aircraftType="'+aircraftType+'",aircraftId="'+aircraftId+'", role="'+role+'",blockTime="'+blockTime[blockTimeValue]+'"  where user_id="'+user.id+'"')

            alert('updated successfully')
          }
          else{
            tx.executeSql( 'INSERT INTO displayDetails (user_id, aircraftType, aircraftId, role, blockTime) VALUES ("'+user.id+'","'+aircraftType+'","'+aircraftId+'", "'+role+'", "'+blockTime[blockTimeValue]+'")')

            alert('Saved successfully')
          }
        });
      });
    }
    
    

    const getTotalTime = async () => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let temData = [];
        prePopulateddb.transaction(tx => {
          tx.executeSql('SELECT totalTime from logbook WHERE user_id = "' + user.id + '" AND aircraftType = "'+params.displayAirType+'"', [], (tx, result) => {
            for (let i = 0; i <= result.rows.length; i++) {
              temData.push({
                totalTime: result.rows.item(i).totalTime,
              });
              //console.log('single', temData);
              var TotalTime = 0;
              var Total_time1 = '';
              // console.log(localLogbookData)
              temData.map(d => {
                // // total  flying hours
                //console.log(d)
                
                  var total = d.totalTime.split(":")
          
                  var total_time = Number(total[0] * 60) + Number(total[1])
                  TotalTime += total_time
                  var TotalHours = Math.floor(TotalTime / 60);
                  var TotalMin = TotalTime % 60;
                  if (TotalHours < 10) {
                    TotalHours = '0' + TotalHours;
                  }
                  if (TotalMin < 10) {
                    TotalMin = '0' + TotalMin;
                  }
                  Total_time1 = TotalHours + ":" + TotalMin;
                  // console.log(Total_time1)
                  if (isNaN(Total_time1[1])) {
                    Total_time1[1] = '0'
                  }
                  //dataDispatcher(FlyingData({totalFlyingHours: Total_time1}))
                
              })
              //console.log('Total_time1',Total_time1)
              dataDispatcher(TotalTypeData({totalType: Total_time1}))
            }
          });
        });
      };

      React.useEffect(() => {
        if(params.displayAirType){
        getTotalTime()
       }
    }, [params.displayAirType]);

    const DisplayDataToServer = async() => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);

      await fetch(Platform.OS==='ios'?BaseUrl + 'save_display_details':BaseUrlAndroid + 'save_display_details', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "user_id": user.id,
              "aircraftType": aircraftType,
              "aircraftId": aircraftId,
              "role": role,
              "block_time": blockTime[blockTimeValue],
            })
      }).then(res => res.json())
          .then(resData => {
             console.log(resData)
          });
    }

    const GetDisplayDetails = async() => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);

      await fetch(Platform.OS==='ios'?BaseUrl + 'get_display_details':BaseUrlAndroid + 'get_display_details', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "user_id": user.id,
            })
      }).then(res => res.json())
          .then(resData => {
            for (let i = 0; i < resData.data.length; i++) {
              setAircraftType(resData.data[i].aircraftType)
              setAircraftId(resData.data[i].aircraftId)
            }
          });
    }

   React. useEffect(()=>{
    GetDisplayDetails()
   },[])
    
    return (
      <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? "padding" : null}>  
      <ScrollView>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={[DisplayStyles.container,{ backgroundColor: theme.backgroundColor }]}>
        <View>
        
        <View style={DisplayStyles.mainHeader}>
        <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
        <Text style={DisplayStyles.aircrafts}>Display</Text>
        </View>
        <View style={dark?DisplayStyles.DarkHeadline:DisplayStyles.headline}>
          <Text style={dark?DisplayStyles.DarkHeadlineText:DisplayStyles.HeadlineText}>Date Format</Text>
        </View>

        <RadioButton.Group value={datee}
        onValueChange={DateFormat}>
        <View style={DisplayStyles.fieldWithoutBottom}>
        <RadioButton.Android
            value="DDMM"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>DD MM YYYY</Text>
        <View style={{paddingHorizontal:40, flexDirection:'row'}}>
        <RadioButton.Android
            value="MMDD"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
        
        <Text style={dark ? DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>MM DD YYYY</Text>
        </View>
        </View>
        </RadioButton.Group>
    
        <View style={dark ? {backgroundColor:'#000'} :{backgroundColor:'#F3F3F3'}}>
        <View style = {DisplayStyles.myAircraft}>
          <Text style={dark?DisplayStyles.DarkHeadlineText:DisplayStyles.HeadlineText}>My Aircraft</Text>
        </View>
        
        <TouchableOpacity onPress={()=>navigation.navigate('Aircraft',{fromScreenDisplay:'Display'})}>
        <View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
           <Text style={dark?DisplayStyles.DarkAircraftTypeText:DisplayStyles.AircraftTypeText}>Aircraft Type</Text>
           <Text style={dark?{paddingLeft:200, lineHeight:30, color:'#fff'}:{paddingLeft:200, lineHeight:30}}>{aircraftType}</Text>
           <MaterialCommunityIcons name="chevron-right" color={dark?'#fff':'#000'} size={20} style={{padding:6}}/>
        </View>
        </View>
        </TouchableOpacity>

        <View style={{...DisplayStyles.fieldWithoutBottom,}}>
           <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Aircraft ID</Text>
           <View style={DisplayStyles.textInputView}>
           <TextInput 
            placeholder='Aircraft ID'
            value={aircraftId==='null'?'':aircraftId}
            onChangeText = {(inputText)=>setAircraftId(inputText)}
            placeholderTextColor='#D0D0D0'
            style={DisplayStyles.aircraftIdTextInput} />
            </View>
        </View>
        </View>

        <View style={dark?DisplayStyles.DarkHeadline:DisplayStyles.headline}>
          <Text style={dark?DisplayStyles.DarkHeadlineText:DisplayStyles.HeadlineText}>Role</Text>
        </View>

        <RadioButton.Group value={role}
        onValueChange={roleChecked}>
        <View style={DisplayStyles.fieldWithoutBottom}>
        <RadioButton.Android
            value="AirlineCaptain"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Airline Captain</Text>
        <View style={{paddingHorizontal:25, flexDirection:'row'}}> 
        <RadioButton.Android
            value="AirlineFirstOfficer"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Airline First Officer</Text>
        </View>
        </View>

        <View style={DisplayStyles.fieldWithoutBottom}>
        <RadioButton.Android
            value="AirlineInstructor"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />

        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Airline Instructor</Text>
        <View style={{paddingHorizontal:10, flexDirection:'row'}}>
        
        <RadioButton.Android
            value="FlightCadet"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
    
        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Flight Cadet</Text>
        </View>
        </View>
        <View style={{paddingHorizontal:10, flexDirection:'row'}}>
        <View style={DisplayStyles.underline}>
        <RadioButton.Android
            value="Cfi"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
        />
        
        <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>CFI</Text>
        </View>
        </View>
        </RadioButton.Group>

        <TouchableOpacity style={dark?DisplayStyles.DarkHeadline:DisplayStyles.headline} onPress={() => setModalVisible(true)}>
          <Text style={dark?DisplayStyles.DarkHeadlineText:DisplayStyles.HeadlineText}>Default Flight Hours</Text>
          <MaterialCommunityIcons  
                name="help-circle-outline" color='#256173' size={25} onPress={() => setModalVisible(true)}/>
        </TouchableOpacity>

        <View style={SsStyle.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={SsStyle.centeredView}>
                <View style={SsStyle.modalView1}>
                    <View style={{width:'100%', backgroundColor:'#EFEFEF', padding:5, flexDirection:'row', justifyContent:'space-between',borderRadius:10}}>
                    <Text style={SsStyle.modalText}>Default Flight Hours</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#256173' size={25} style={{padding: 5,}} onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                    <View>
                        <Text style={SsStyle.mainText}>
                        1.select cross country and approach to fill in the fields automatically in the relevant field. {'\n'}
                        2.Actual instruments hours can be selected and will be added everytime to the flight by reducing from block hours.
                        </Text>
                    </View>
                </View>
                </View>
            </Modal>
            </View>
        
        <View>
        <View style={{flexDirection:'row', padding:5}}>
           <Checkbox.Android
            color = {dark?'#fff':'#256173'}
            uncheckedColor = {dark?'#fff':'#000'}
            status={country ? 'checked' : 'unchecked'}
            onPress={() => {
                setCountry(!country);
            }}
            />
            <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Cross Country</Text>
        </View>

        <View style={{flexDirection:'row', padding:5}}>
        <Checkbox.Android
            color = {dark?'#fff':'#256173'}
            uncheckedColor = {dark?'#fff':'#000'}
            status={approach ? 'checked' : 'unchecked'}
            onPress={() => {
                setApproach(!approach);
            }}
            style={{paddingLeft:100}}
            />
            <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Approach 1</Text>
        </View>
        </View>
        
        <View style={{flexDirection:'row', padding:5}}>
            <Checkbox.Android
            status={instrument ? 'checked' : 'unchecked'}
            color = {dark?'#fff':'#256173'}
            uncheckedColor = {dark?'#fff':'#000'}
            onPress={() => { setInstrument(!instrument)}}
            />
            <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Actual Instrument</Text>
        </View>

        <View style={DisplayStyles.blockDropDown}>
            <Text style={{color: dark?'#fff':'#000', fontSize:15,lineHeight:30}}>Block Time - </Text>
            <ModalDropdown options={blockTime}
                defaultValue= {blockTime[blockTimeValue]}
                isFullWidth = {true}
                style={{backgroundColor:'grey',borderRadius:10,width:'30%',alignItems:'center',justifyContent:'center'}}
                textStyle= {{color: '#fff', fontSize:15,padding:5}}
                dropdownStyle={{boderWidth:1, borderColor:'#000', width:'30%',backgroundColor:'grey'}}
                dropdownTextStyle={{fontSize:15,textAlign:'center',backgroundColor:'grey',color:'#fff'}}
                onSelect = {(blockTimeValue)=>{setBlockTimeValue(blockTimeValue);}}
            />
            {/* <MaterialCommunityIcons name="chevron-down" color={dark?'#fff':'#000'} size={20} style={{lineHeight:20}}/> */}
        </View>

        <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress = {()=>{handleActualInstrument(),insertDisplayDetails(),DisplayDataToServer()}} style={dark?DisplayStyles.darkSaveChanges:DisplayStyles.saveChanges}>
                <Text style={{color:'#fff', padding:5,textAlign:'center'}}>Save Changes</Text>
            </TouchableOpacity>
        </View>
        

        <View style={{paddingTop: 10}}>
        <View style={dark?{backgroundColor:'#000', padding:15}:{backgroundColor:'#F3F3F3', padding:15}}>
            <Text style={dark?DisplayStyles.DarkHeadlineText:DisplayStyles.HeadlineText}>Night Mode</Text>
            
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            {dark ? <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Change to Day Mode</Text> : <Text style={DisplayStyles.fieldText}>Change to Dark Mode</Text>}
            <Switch trackColor={{ false: "#fff", true: "#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={toggle} value = {dark} 
                    />
            </View>

        </View>
        </View>

        </View>
        </SafeAreaView>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

// define your DisplayStyles


//make this component available to the app
export default Display;
