//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, SafeAreaView,KeyboardAvoidingView } from 'react-native';
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

    const dataDispatcher = useDispatch();
    const getReduxData = useSelector(state => state.display.ActualI);
    //console.log ('hjhygtdfd', getReduxData)

    const[aircraftId, setAircraftId] = React.useState('')

    const [params] = React.useContext(ParamsContext);

    React.useEffect(() => {
      if (params.childParam1) {
        //console.log('The value of child param is: ', params.childParam1);
        setAircraftId(params.displayAirId)
      }
    }, [params]);

    const [country, setCountry] = React.useState(false);
    const [instrument, setInstrument] = React.useState(false);
    const [approach, setApproach] = React.useState(false);
    const [blockTimeValue, setBlockTimeValue] = React.useState('00:15');
    const blockTime = ['00:15','00:30','00:45','00:60']

    const handleActualInstrument = () => {
        dataDispatcher(DisplayData({ActualI: instrument, TimeofAi: blockTime[blockTimeValue], Xc: country}))
        alert('Changes Saved')
        //console.log('Pressed');
    }

    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const { datee, Dateform, DateFormat, role, roleChecked } = React.useContext(DisplayContext);
    
    

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
           <Text style={dark?{paddingLeft:200, lineHeight:30, color:'#fff'}:{paddingLeft:200, lineHeight:30}}>{params.displayAirType}</Text>
           <MaterialCommunityIcons name="chevron-right" color={dark?'#fff':'#000'} size={20} style={{padding:6}}/>
        </View>
        </View>
        </TouchableOpacity>

        <View style={{...DisplayStyles.fieldWithoutBottom,}}>
           <Text style={dark?DisplayStyles.DarkfieldText:DisplayStyles.fieldText}>Aircraft ID</Text>
           <View style={DisplayStyles.textInputView}>
           <TextInput 
            placeholder='Aircraft ID'
            value={aircraftId}
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
        
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
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
            <Text style={{color: dark?'#fff':'#000'}}>Block Time - </Text>
            <ModalDropdown options={blockTime}
                defaultValue= {blockTime[blockTimeValue]}
                isFullWidth = {true}
                textStyle= {{color: 'grey', fontSize:15,}}
                dropdownStyle={{boderWidth:1, borderColor:'#256173', width:100}}
                onSelect = {(blockTimeValue)=>{setBlockTimeValue(blockTimeValue);}}
            />
            <MaterialCommunityIcons name="chevron-down" color={dark?'#fff':'#000'} size={20} style={{lineHeight:20}}/>
            <View style={{paddingLeft: 50}}>
            <TouchableOpacity onPress = {handleActualInstrument} style={dark?DisplayStyles.darkSaveChanges:DisplayStyles.saveChanges}>
                <Text style={{color:'#fff', padding:5}}>Save Changes</Text>
            </TouchableOpacity>
            </View>
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
