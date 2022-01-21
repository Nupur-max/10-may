//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,KeyboardAvoidingView, TextInput, ScrollView, Dimensions, Platform, Alert, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper';
import { ThemeContext } from '../theme-context';
import { MaskedTextInput} from "react-native-mask-text";
import AsyncStorage from '@react-native-community/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';
import { useScrollToTop } from '@react-navigation/native';
import { ParamsContext } from '../params-context';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TimePicker} from 'react-native-simple-time-picker';
import SQLite from 'react-native-sqlite-storage';
import {BuildLogbookData} from '../store/actions/BLAction'


import {BaseUrl} from '../components/url.json';

import Colors from '../components/colors';

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
const BuildBook = ({navigation, route}) => {

    const ref = React.useRef(null);
    useScrollToTop(ref);

    const [params] = React.useContext(ParamsContext);

    // React.useEffect(() => {
    //   if (params.childParam) {
    //     console.log('The value of child param is: ', params.childParam)
        
    //     //editable
    //     editSetEngineName(params.itemEngineName)
    //     EditSetCategory(params.itemCategory)
    //     editSetEngine(params.itemEngine)
    //     editSetClass(params.itemEngineClass)
    //     editSetday_pic(params.itemDay_pic)
    //     editSetday_sic(params.itemDay_sic)
    //     editSetDay_dual(params.itemDay_dual)
    //     editSetDayp1_us(params.itemDay_p1_us)
    //     editSetDayp1_ut(params.itemDay_p1_ut)
    //     editSetNight_pic(params.itemNight_pic)
    //     editSetNight_sic(params.itemNight_sic)
    //     editSetNight_dual(params.itemNight_dual)
    //     editSetNightp1_us(params.itemNight_p1_us)
    //     editSetNightp1_ut(params.itemNight_p1_ut)
    //     editSetActual(params.itemInstrumental_time_actual)
    //     editSetSimulated(params.itemInstrumental_time_simulated)
    //     editSetSimulator(params.itemSimulator)
    //     editSetInstructional_day(params.itemInstructional_flying_day)
    //     editSetInstructional_night(params.itemInstructional_flying_night)
    //     editSetDay_to(params.itemDay_to)
    //     editSetNight_to(params.itemNight_to)
    //     editSetDayLanding(params.itemDayLanding)
    //     editSetNightLanding(params.itemNightLanding)
    //     editSetRemark(params.itemRemark)
    //     editSetDay_total(params.itemDay_total)
    //     editSetNight_total(params.itemNight_total)
    //     editSetTotal_flyingTime(params.itemTotal_flying_time)
    //     editSetInstructional_total(params.itemInstructional_flying_total)
    //   }
    // }, [params]);

    React.useEffect(() => {
      if (params.childParam3) {
        console.log('The value of child param is: ', params.childParam3);
        // without edit
        if(!edit) setCategory(params.BuildLogbookCategory)
        if(!edit) setEngine(params.BuildLogbookEngine)
        if(!edit) setEngineName(params.BuildLogbookEngineName)
        if(!edit) setClass(params.BuildLogbookClass)
      }
    }, [params]);

    //const[id,setId] = React.useState('')
    const[edit, setEdit] = React.useState(false);

    const[data, setData] = React.useState([]);
    const[aircraftType, setAircraftType] = React.useState('');
    const[engineName, setEngineName] = React.useState('');

    //Time
    const[day_pic, setday_pic] = React.useState('');
    const[day_sic, setday_sic] = React.useState('');
    const[dayp1_us, setDayp1_us] = React.useState('');
    const[dayp1_ut, setDayp1_ut] = React.useState('');
    const[day_total, setDay_total] = React.useState('');
    const[night_pic, setnight_pic] = React.useState('');
    const[night_sic, setnight_sic] = React.useState('');
    const[nightp1_us, setNightp1_us] = React.useState('');
    const[nightp1_ut, setNightp1_ut] = React.useState('');
    const[night_total, setNight_total] = React.useState('');
    const[day_dual,setDay_dual] = React.useState('');
    const[night_dual,setNight_dual] = React.useState('');
    const[total_flying_time, setTotal_flyingTime] = React.useState('');
    const[actual, setActual] = React.useState('');
    const[simulated, setSimulated] = React.useState('');
    const[simulator, setSimulator] = React.useState('');
    const[instructional_day, setInstructional_day] = React.useState('');
    const[instructional_night, setInstructional_night] = React.useState('');
    const[instructional_total, setInstructional_total] = React.useState('');
    const [stl_day, setStl_Day] = React.useState('')
    const [stl_night, setStl_Night] = React.useState('')
    const [stl_total, setStl_Total] = React.useState('')
    //const cat =  params.itemCategory

    console.log('Saved Aircraft name==>', params.itemCategory);
    const [category, setCategory] = React.useState('');
    const [engine, setEngine] = React.useState('');
    const [Class, setClass] = React.useState('');

    console.log('class', Class)

    const[day_to, setDay_to] = React.useState('');
    const[dayLanding, setDayLanding] = React.useState('');
    const[night_to, setNight_to] = React.useState('');
    const[nightLanding, setNightLanding] = React.useState('');
    const[remark, setRemark] = React.useState('');

    //Editable fields
    const [editCategory, EditSetCategory] = React.useState('')
    const [editEngine, editSetEngine] = React.useState('')
    const [editClass, editSetClass] = React.useState('')
    const [editEngineName, editSetEngineName] = React.useState(params.itemEngineName)

    //editableTime
    const[editDay_pic, editSetday_pic] = React.useState('');
    const[editDay_sic, editSetday_sic] = React.useState('');
    const[editDayp1_us, editSetDayp1_us] = React.useState('');
    const[editDayp1_ut, editSetDayp1_ut] = React.useState('');
    const[editDay_total, editSetDay_total] = React.useState('');
    const[editNight_pic, editSetNight_pic] = React.useState('');
    const[editNight_sic, editSetNight_sic] = React.useState('');
    const[editNightp1_us, editSetNightp1_us] = React.useState('');
    const[editNightp1_ut, editSetNightp1_ut] = React.useState('');
    const[editNight_total, editSetNight_total] = React.useState('');
    const[editDay_dual, editSetDay_dual] = React.useState('');
    const[editNight_dual,editSetNight_dual] = React.useState('');
    const[editTotal_flying_time, editSetTotal_flyingTime] = React.useState('');
    const[editActual, editSetActual] = React.useState('');
    const[editSimulated, editSetSimulated] = React.useState('');
    const[editSimulator, editSetSimulator] = React.useState('');
    const[editInstructional_day, editSetInstructional_day] = React.useState('');
    const[editInstructional_night, editSetInstructional_night] = React.useState('');
    const[editInstructional_total, editSetInstructional_total] = React.useState('');

    const[editDay_to, editSetDay_to] = React.useState('');
    const[editNight_to, editSetNight_to] = React.useState('');
    const[editDayLanding, editSetDayLanding] = React.useState('');
    const[editNightLanding, editSetNightLanding] = React.useState('');
    const[editStl_day, editSetStl_day] = React.useState('');
    const[editStl_night, editSetStl_night] = React.useState('');
    const[editStl_total, editSetStl_total] = React.useState('');
    const[editRemark, editSetRemark] = React.useState('');

    //calculations
    //Day calculations
    //ME Land

    var DayTime1 = day_pic === '' ? '00:00' : day_pic //H = in hours
    var DayTime2 = day_sic === '' ? '00:00' : day_sic //H = in hours
    var DayTime3 = dayp1_us === '' ? '00:00' : dayp1_us //H = in hours
    var DayTime4 = dayp1_ut === '' ? '00:00' : dayp1_ut //H = in hours

    var DayTimeTemp1  = DayTime1.split(":");
    var DayTimeTemp2 = DayTime2.split(":");
    var DayTimeTemp3 = DayTime3.split(":");
    var DayTimeTemp4 = DayTime4.split(":");

    if(isNaN(DayTimeTemp1[1])){
      DayTimeTemp1[1] = '0'
    }
    if(isNaN(DayTimeTemp2[1])){
      DayTimeTemp2[1] = '0'
    }
    if(isNaN(DayTimeTemp3[1])){
      DayTimeTemp3[1] = '0'
    }
    if(isNaN(DayTimeTemp4[1])){
      DayTimeTemp4[1] = '0'
    }

    var DayTimeM1 = (Number(DayTimeTemp1[0]) * 60) + Number(DayTimeTemp1[1]); //M = in Minuts
    var DayTimeM2 = (Number(DayTimeTemp2[0]) * 60) + Number(DayTimeTemp2[1]); //M = in Minuts
    var DayTimeM3 = (Number(DayTimeTemp3[0]) * 60) + Number(DayTimeTemp3[1]); //M = in Minuts
    var DayTimeM4 = (Number(DayTimeTemp4[0]) * 60) + Number(DayTimeTemp4[1]); //M = in Minuts

    var DayMETotalM = (Number(DayTimeM1) + Number(DayTimeM2) + Number(DayTimeM3) + Number(DayTimeM4))

    console.log('Day ME====>', DayMETotalM/60);

    var DayMehours = Math.floor(DayMETotalM / 60);  
    var DayMeminutes = DayMETotalM % 60;
    if (DayMeminutes + ''.length < 2) {
      DayMeminutes = '0' + DayMeminutes; 
    }
    console.log('calcul ME--->', DayMehours + ":" + DayMeminutes)

    const DayMETotalH = DayMehours + ":" + DayMeminutes
    
    //ME Land

    //SELAND

    var DaySETime1 = day_pic === '' ? '00:00' : day_pic //H = in hours
    var DaySETime2 = day_dual === '' ? '00:00' : day_dual //H = in hours

    var DaySETimeTemp1  = DaySETime1.split(":");
    var DaySETimeTemp2 = DaySETime2.split(":");

    if(isNaN(DaySETimeTemp1[1])){
      DaySETimeTemp1[1] = '0'
    }
    if(isNaN(DaySETimeTemp2[1])){
      DaySETimeTemp2[1] = '0'
    }

    var DaySETimeM1 = (Number(DaySETimeTemp1[0]) * 60) + Number(DaySETimeTemp1[1]); //M = in Minuts
    var DaySETimeM2 = (Number(DaySETimeTemp2[0]) * 60) + Number(DaySETimeTemp2[1]); //M = in Minuts

    var DaySETotalM = (Number(DaySETimeM1) + Number(DaySETimeM2))

    var DaySehours = Math.floor(DaySETotalM / 60);  
    var DaySeminutes = DaySETotalM % 60;
    if (DaySeminutes + ''.length < 2) {
      DaySeminutes = '0' + DaySeminutes; 
    }

    const DaySETotalH = DaySehours + ":" + DaySeminutes
    
    //SELAND
    
    //Day calculations

    //Night Calculations
    //Me land

    var NightTime1 = night_pic === '' ? '00:00' : night_pic //H = in hours
    var NightTime2 = night_sic === '' ? '00:00' : night_sic; //H = in hours
    var NightTime3 = nightp1_us === '' ? '00:00' : nightp1_us; //H = in hours
    var NightTime4 = nightp1_ut === '' ? '00:00' : nightp1_ut; //H = in hours

    var NightTimeTemp1 = NightTime1.split(":");
    var NightTimeTemp2 = NightTime2.split(":");
    var NightTimeTemp3 = NightTime3.split(":");
    var NightTimeTemp4 = NightTime4.split(":");

    if(isNaN(NightTimeTemp1[1])){
      NightTimeTemp1[1] = '0'
    }
    if(isNaN(NightTimeTemp2[1])){
      NightTimeTemp2[1] = '0'
    }
    if(isNaN(NightTimeTemp3[1])){
      NightTimeTemp3[1] = '0'
    }
    if(isNaN(NightTimeTemp4[1])){
      NightTimeTemp4[1] = '0'
    }

    var NightTimeM1 = (Number(NightTimeTemp1[0]) * 60) + Number(NightTimeTemp1[1]); //M = in Minuts
    var NightTimeM2 = (Number(NightTimeTemp2[0]) * 60) + Number(NightTimeTemp2[1]); //M = in Minuts
    var NightTimeM3 = (Number(NightTimeTemp3[0]) * 60) + Number(NightTimeTemp3[1]); //M = in Minuts
    var NightTimeM4 = (Number(NightTimeTemp4[0]) * 60) + Number(NightTimeTemp4[1]); //M = in Minuts

    var NightMETotalM = (Number(NightTimeM1) + Number(NightTimeM2) + Number(NightTimeM3) + Number(NightTimeM4))

    var NightMehours = Math.floor(NightMETotalM / 60);  
    var NightMeminutes = NightMETotalM % 60;
    if (NightMeminutes + ''.length < 2) {
      NightMeminutes = '0' + NightMeminutes; 
    }

    const NightMETotalH = NightMehours + ":" + NightMeminutes
    
    //Me land

    //Se Land
    
    var NightSETime1 = night_pic === '' ? '00:00' : night_pic //H = in hours
    var NightSETime2 = night_dual === '' ? '00:00' : night_dual//H = in hours

    var NightSETimeTemp1 = NightSETime1.split(":");
    var NightSETimeTemp2 = NightSETime2.split(":");

    if(isNaN(NightSETimeTemp1[1])){
      NightSETimeTemp1[1] = '0'
    }
    if(isNaN(NightSETimeTemp2[1])){
      NightSETimeTemp2[1] = '0'
    }

    var NightSETimeM1 = (Number(NightSETimeTemp1[0]) * 60) + Number(NightSETimeTemp1[1]); //M = in Minuts
    var NightSETimeM2 = (Number(NightSETimeTemp2[0]) * 60) + Number(NightSETimeTemp2[1]); //M = in Minuts

    var NightSETotalM = (Number(NightSETimeM1) + Number(NightSETimeM2))

    var NightSehours = Math.floor(NightSETotalM / 60);  
    var NightSeminutes = NightSETotalM % 60;
    if (NightSeminutes + ''.length < 2) {
      NightSeminutes = '0' + NightSeminutes; 
    }

    const NightSETotalH = NightSehours + ":" + NightSeminutes

    //Se Land

    //Night Calculations

    //Total Flying hours start

    //ME LAND START
    var TotalMEFlyingTime1 = DayMETotalH //H = in hours
    var TotalMEFlyingTime2 = NightMETotalH //H = in hours

    var TotalMEFlyingTimeTemp1 = TotalMEFlyingTime1.split(":");
    var TotalMEFlyingTimeTemp2 = TotalMEFlyingTime2.split(":");

    var TotalMEFlyingTimeM1 = (Number(TotalMEFlyingTimeTemp1[0]) * 60) + Number(TotalMEFlyingTimeTemp1[1]); //M = in Minuts
    var TotalMEFlyingTimeM2 = (Number(TotalMEFlyingTimeTemp2[0]) * 60) + Number(TotalMEFlyingTimeTemp2[1]); //M = in Minuts
    
    var TotalMEFlyingTimeM = (Number(TotalMEFlyingTimeM1) + Number(TotalMEFlyingTimeM2))

    var TotalMEFlyinghours = Math.floor(TotalMEFlyingTimeM / 60);  
    var TotalMEFlyingminutes = TotalMEFlyingTimeM % 60;
    if (TotalMEFlyingminutes + ''.length < 2) {
      TotalMEFlyingminutes = '0' + TotalMEFlyingminutes; 
    }

    const TotalMEFlyingTime = TotalMEFlyinghours + ":" + TotalMEFlyingminutes
    //ME LAND END

    // SE LAND START
    var TotalSEFlyingTime1 = DaySETotalH //H = in hours
    var TotalSEFlyingTime2 = NightSETotalH //H = in hours

    var TotalSEFlyingTimeTemp1 = TotalSEFlyingTime1.split(":");
    var TotalSEFlyingTimeTemp2 = TotalSEFlyingTime2.split(":");

    var TotalSEFlyingTimeM1 = (Number(TotalSEFlyingTimeTemp1[0]) * 60) + Number(TotalSEFlyingTimeTemp1[1]); //M = in Minuts
    var TotalSEFlyingTimeM2 = (Number(TotalSEFlyingTimeTemp2[0]) * 60) + Number(TotalSEFlyingTimeTemp2[1]); //M = in Minuts

    var TotalSEFlyingTimeM = (Number(TotalSEFlyingTimeM1) + Number(TotalSEFlyingTimeM2))

    var TotalSEFlyinghours = Math.floor(TotalSEFlyingTimeM / 60);  
    var TotalSEFlyingminutes = TotalSEFlyingTimeM % 60;
    if (TotalSEFlyingminutes + ''.length < 2) {
      TotalSEFlyingminutes = '0' + TotalSEFlyingminutes; 
    }

    const TotalSEFlyingTime = TotalSEFlyinghours + ":" + TotalSEFlyingminutes
    //SE LAND END

    //Total Flying hours End

    // STL HOURS START

    var StlTime1 = stl_day === '' ? '00:00' : stl_day //H = in hours
    var StlTime2 = stl_night === '' ? '00:00' : stl_night //H = in hours

    var StlTimeTemp1 = StlTime1.split(":");
    var StlTimeTemp2 = StlTime2.split(":");

    if(isNaN(StlTimeTemp1[1])){
      StlTimeTemp1[1] = '0'
    }
    if(isNaN(StlTimeTemp2[1])){
      StlTimeTemp2[1] = '0'
    }

    var StlTimeM1 = (Number(StlTimeTemp1[0]) * 60) + Number(StlTimeTemp1[1]); //M = in Minuts
    var StlTimeM2 = (Number(StlTimeTemp2[0]) * 60) + Number(StlTimeTemp2[1]); //M = in Minuts

    var StlTotalTimeM = (Number(StlTimeM1) + Number(StlTimeM2))

    var Stlhours = Math.floor(StlTotalTimeM / 60);  
    var Stlminutes = StlTotalTimeM % 60;
    if (Stlminutes + ''.length < 2) {
      Stlminutes = '0' + Stlminutes; 
    }

    const TotalStlTime = Stlhours + ":" + Stlminutes

    // STL HOURS END

    //Instructional Flying start

    var InstructionalDayTime = instructional_day === '' ? '00:00' : instructional_day //H = in hours
    var InstructionalNightTime = instructional_night === '' ? '00:00' : instructional_night //H = in hours

    var InsDayTimeTemp = InstructionalDayTime.split(":");
    var InsNightTimeTemp = InstructionalNightTime.split(":");

    if(isNaN(InsDayTimeTemp[1])){
      InsDayTimeTemp[1] = '0'
    }
    if(isNaN(InsNightTimeTemp[1])){
      InsNightTimeTemp[1] = '0'
    }

    var InsDayTimeM1 = (Number(InsDayTimeTemp[0]) * 60) + Number(InsDayTimeTemp[1]); //M = in Minuts
    var InsNightTimeM2 = (Number(InsNightTimeTemp[0]) * 60) + Number(InsNightTimeTemp[1]); //M = in Minuts

    var InsTotalTimeM = (Number(InsDayTimeM1) + Number(InsNightTimeM2))

    var Inshours = Math.floor(InsTotalTimeM / 60);  
    var Insminutes = InsTotalTimeM % 60;
    if (Insminutes + ''.length < 2) {
      Insminutes = '0' + Insminutes; 
    }

    const TotalInsTime = Inshours + ":" + Insminutes

    //Instructional Flying end

  //calculations 
    

      const editable = () => {
        setEdit(edit => !edit); 
      };

      //Api to delete the buildlogbook
      const Delete = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
      
        await fetch(BaseUrl+'delete_logbook',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "user_id": user.id,
            "id": params.itemId,
          })
      }).then(res => res.json())
      .then(resData => {
         //console.log(resData);
         Alert.alert(resData.message);
      }).catch((error) => {
        console.log(error)
      });
      }

      //Api to get the logbook

      //React.useEffect(() => {getLogBook()}, [category]);

      const getLogBook = async() => {
        await fetch(BaseUrl+'getBuildLogbook',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": params.itemId,
          })
      }).then(res => res.json())
      .then(resData => {
         console.log('getLogbookData',resData);
         for (var j = 0; j < resData.data.length; j++){
          // console.log('id', resData.data[j].id)
         }
        });
      }

    //Api to edit the logbook
    const Edit = async() => {
      console.log(params.itemId)
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
    
      await fetch(BaseUrl+'update_logbook',{
        method : 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user_id": user.id,
          "id": params.itemId,
          "aircraft_name": params.itemName,
          "category": editCategory,
          "engine": editEngine,
          "engine_name": editEngineName,
          "engine_class": editClass,
          "day_pic":editDay_pic,
          "day_sic":editDay_sic,
          "day_p1_us":editDayp1_us,
          "day_p1_ut":editDayp1_ut,
          "day_dual":editDay_dual,
          "total":editDay_total,
          "night_pic":editNight_pic,
          "night_sic":editNight_sic,
          "night_p1_us":editNightp1_us,
          "night_p1_ut":editNightp1_ut,
          "night_dual":editNight_dual,
          "night_total":editNight_total,
          "total_flying_time":editTotal_flying_time,
          "instrumental_time_actual":editActual,
          "instrumental_time_simulated":editSimulated,
          "simulator":editSimulator,
          "instructional_flying_day":editInstructional_day,
          "instructional_flying_night":editInstructional_night,
          "instructional_flying_total":editInstructional_total,
          "day_to":editDay_to,
          "night_to":editNight_to,
          "day_landing":editDayLanding,
          "night_landing":editNightLanding,
          "remark":editRemark,

        })
    }).then(res => res.json())
    .then(resData => {
       //console.log(resData);
       Alert.alert(resData.message);
    }).catch((error) => {
      console.log(error)
    });
    }

  const Update_locally = async() => {
  let user = await AsyncStorage.getItem('userdetails');
  user = JSON.parse(user);
  db.transaction(tx => {
    tx.executeSql('UPDATE buildLogbook set category="'+editCategory+'",engine="'+editEngine+'",engine_name="'+editEngineName+'",engine_class="'+editClass+'",day_pic="'+editDay_pic+'",day_sic="'+editDay_sic+'",day_p1_us="'+editDayp1_us+'",day_p1_ut="'+editDayp1_ut+'",day_dual="'+editDay_dual+'",total="'+editDay_total+'",night_pic="'+editNight_pic+'",night_sic="'+editNight_sic+'",night_p1_us="'+editNightp1_us+'",night_p1_ut="'+editNightp1_ut+'",night_dual="'+editNight_dual+'",night_total="'+editNight_total+'",total_flying_time="'+editTotal_flying_time+'",instrumental_time_actual="'+editActual+'",instrumental_time_simulated="'+editSimulated+'",simulator="'+editSimulator+'",instructional_flying_day="'+editInstructional_day+'",instructional_flying_night="'+editInstructional_night+'",instructional_flying_total="'+editInstructional_total+'",day_to="'+editDay_to+'",night_to="'+editNight_to+'",day_landing="'+editDayLanding+'",night_landing="'+editNightLanding+'",night_landing="'+editNightLanding+'",remark="'+editRemark+'",stl_day="'+editStl_day+'",stl_night="'+editStl_night+'",stl_total="'+editStl_total+'" WHERE id = "'+params.itemId+'"');
  });
  let data = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * from buildLogbook WHERE user_id="'+user.id+'" limit 20', [], (tx, result) => {
      console.log(result);
      for (let i = 0 ; i <= result.rows.length ; i++) {
        data.push({
          id: result.rows.item(i).id,
          user_id: result.rows.item(i).user_id,
          aircraft_id : result.rows.item(i).aircraft_id,
          aircraft_type : result.rows.item(i).aircraft_type,
          category : result.rows.item(i).category,
          engine : result.rows.item(i).engine,
          engine_name : result.rows.item(i).engine_name,
          engine_class : result.rows.item(i).engine_class,
          engine_crew : result.rows.item(i).engine_crew,
          day_pic : result.rows.item(i).day_pic,
          day_sic : result.rows.item(i).day_sic,
          day_p1_us : result.rows.item(i).day_p1_us,
          day_p1_ut : result.rows.item(i).day_p1_ut,
          total : result.rows.item(i).total,
          night_pic : result.rows.item(i).night_pic,
          night_sic : result.rows.item(i).night_sic,
          night_p1_us : result.rows.item(i).night_p1_us,
          night_p1_ut : result.rows.item(i).night_p1_ut,
          night_total : result.rows.item(i).night_total,
          total_flying_time : result.rows.item(i).total_flying_time,
          instrumental_time_actual : result.rows.item(i).instrumental_time_actual,
          instrumental_time_simulated : result.rows.item(i).instrumental_time_simulated,
          simulator : result.rows.item(i).simulator,
          instructional_flying_day : result.rows.item(i).instructional_flying_day,
          instructional_flying_night : result.rows.item(i).instructional_flying_night,
          instructional_flying_total : result.rows.item(i).instructional_flying_total,
          day_to : result.rows.item(i).day_to,
          night_to : result.rows.item(i).night_to,
          day_landing : result.rows.item(i).day_landing,
          night_landing : result.rows.item(i).night_landing,
          day_dual : result.rows.item(i).day_dual,
          night_dual : result.rows.item(i).night_dual,
          remark : result.rows.item(i).remark,
          key : result.rows.item(i).key,
          lastUpdatedDate : result.rows.item(i).lastUpdatedDate,
          stl_day : result.rows.item(i).stl_day,
          stl_night : result.rows.item(i).stl_night,
          stl_total : result.rows.item(i).stl_total,
        });
      //console.log('updated Data',data);
      
      // setData(data);
      //setFilteredData(data);
      dataDispatcher(BuildLogbookData({data: data}))
      }
      });
  });
  } 

  const Delete_locally = async() => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    db.transaction(tx => {
      tx.executeSql('DELETE From buildLogbook  WHERE id = "'+params.itemId+'"');
    });
    let data = [];
    db.transaction(tx => {
      tx.executeSql('SELECT * from buildLogbook WHERE user_id="'+user.id+'" limit 20', [], (tx, result) => {
        console.log(result);
        for (let i = 0 ; i <= result.rows.length ; i++) {
          data.push({
            id: result.rows.item(i).id,
            user_id: result.rows.item(i).user_id,
            aircraft_id : result.rows.item(i).aircraft_id,
            aircraft_type : result.rows.item(i).aircraft_type,
            category : result.rows.item(i).category,
            engine : result.rows.item(i).engine,
            engine_name : result.rows.item(i).engine_name,
            engine_class : result.rows.item(i).engine_class,
            engine_crew : result.rows.item(i).engine_crew,
            day_pic : result.rows.item(i).day_pic,
            day_sic : result.rows.item(i).day_sic,
            day_p1_us : result.rows.item(i).day_p1_us,
            day_p1_ut : result.rows.item(i).day_p1_ut,
            total : result.rows.item(i).total,
            night_pic : result.rows.item(i).night_pic,
            night_sic : result.rows.item(i).night_sic,
            night_p1_us : result.rows.item(i).night_p1_us,
            night_p1_ut : result.rows.item(i).night_p1_ut,
            night_total : result.rows.item(i).night_total,
            total_flying_time : result.rows.item(i).total_flying_time,
            instrumental_time_actual : result.rows.item(i).instrumental_time_actual,
            instrumental_time_simulated : result.rows.item(i).instrumental_time_simulated,
            simulator : result.rows.item(i).simulator,
            instructional_flying_day : result.rows.item(i).instructional_flying_day,
            instructional_flying_night : result.rows.item(i).instructional_flying_night,
            instructional_flying_total : result.rows.item(i).instructional_flying_total,
            day_to : result.rows.item(i).day_to,
            night_to : result.rows.item(i).night_to,
            day_landing : result.rows.item(i).day_landing,
            night_landing : result.rows.item(i).night_landing,
            day_dual : result.rows.item(i).day_dual,
            night_dual : result.rows.item(i).night_dual,
            remark : result.rows.item(i).remark,
            key : result.rows.item(i).key,
            lastUpdatedDate : result.rows.item(i).lastUpdatedDate,
            stl_day : result.rows.item(i).stl_day,
            stl_night : result.rows.item(i).stl_night,
            stl_total : result.rows.item(i).stl_total,
          });
        console.log('DELETED Data',data);
        
        // setData(data);
        //setFilteredData(data);
        dataDispatcher(BuildLogbookData({data: data}))
        }
        });
    });
    } 

// Dark Theme
const { dark, theme, toggle } = React.useContext(ThemeContext);
    
//api to upload the logbook
    const upload_logbook = async() => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      console.log('user id=>', user.id);
      //setName(user.name);
      await fetch(BaseUrl+'add_logbook',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "user_id": user.id,
            //"aircraftPhoto": 'hello',
            "aircraft_name": params.BuildlogBookAirType,
            "category": category,
            "engine": engine,
            "engine_name": engineName,
            "engine_class" : Class,
            "day_pic" : day_pic,
            "day_sic" : day_sic,
            "day_dual" : day_dual,
            "day_p1_us" : dayp1_us,
            "day_p1_ut" : dayp1_ut,
            "total": Class === 'seLand' || Class=== 'seSea' ? DaySETotalH : DayMETotalH,
            //"total" : day_total,
            "night_pic": night_pic,
            "night_sic" : night_sic,
            "night_dual" : night_dual,
            "night_p1_us" : nightp1_us,
            "night_p1_ut" : nightp1_ut,
            "night_total" : Class === 'seLand' || Class=== 'seSea' ? NightSETotalH : NightMETotalH,
            //"night_total": night_total,
            "total_flying_time" : Class === 'seLand' || Class=== 'seSea' ? TotalSEFlyingTime : TotalMEFlyingTime,
            //"total_flying_time": total_flying_time,
            "stl_day" : stl_day,
            "stl_night" : stl_night,
            "stl_total" : TotalStlTime,
            "instrumental_time_actual" : actual,
            "instrumental_time_simulated" : simulated,
            "simulator" : simulator,
            "instructional_flying_day" : instructional_day,
            "instructional_flying_night": instructional_night,
            "instructional_flying_total": TotalInsTime,
            //"instructional_flying_total" : instructional_total,
            "day_to" : day_to,
            "night_to" : night_to,
            "day_landing" : dayLanding,
            "night_landing" : nightLanding,
            "remark" : remark,
          })
          }).then(res => res.json())
          .then(resData => {
          //console.log(resData);
          aircraftType === null ? Alert.alert('Aircraft Type is required'): '';
          if(resData.message === 'Record inserted successfully .'){
          console.log(resData.message);
          }
          else{
            console.log(resData.error)
          }
        }).catch((error) => {
          console.log(error)
        });;
   }

   var localTotalDayTime = Class === 'SE Land' || Class=== 'SE Sea' ? NightSETotalH : NightMETotalH
   var localTotalNightTime = Class === 'SE Land' || Class=== 'SE Sea' ? NightSETotalH : NightMETotalH
   var localTotalFlyingTime = Class === 'SE Land' || Class=== 'SE Sea' ? TotalSEFlyingTime : TotalMEFlyingTime

   //sqlite starts

   const insertQuery = async() => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    if (!params.BuildlogBookAirType) {
      alert('Please select Aircraft');
      return;
    }
    if (!category) {
      alert('Please select category');
      return;
    }
    if (!engine) {
      alert('Please select engine');
      return;
    }
    if (!engineName) {
      alert('Please fill engine Name');
      return;
    }
    if (!Class) {
      alert('Please select class');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO buildLogbook (id,user_id,aircraft_id,aircraft_type,image,category,engine,engine_name,engine_class,engine_crew,day_pic,day_sic,day_p1_us,day_p1_ut,total,night_pic,night_sic,night_p1_us,night_p1_ut,night_total,total_flying_time,instrumental_time_actual,instrumental_time_simulated,simulator,instructional_flying_day,instructional_flying_night,instructional_flying_total,day_to,night_to,day_landing,night_landing,day_dual, night_dual, remark, key, lastUpdatedDate, stl_day, stl_night, stl_total) VALUES("'+params.itemId+'","'+user.id+'","'+params.BuildlogBookAirId+'","'+params.BuildlogBookAirType+'","hello","'+category+'","'+engine+'","'+engineName+'","'+Class+'","hello","'+day_pic+'","'+day_sic+'","'+dayp1_us+'","'+dayp1_ut+'","'+localTotalDayTime+'","'+night_pic+'","'+night_sic+'","'+nightp1_us+'","'+nightp1_ut+'","'+localTotalNightTime+'","'+
        localTotalFlyingTime+'","'+actual+'","'+simulated+'","'+simulator+'","'+instructional_day+'","'+instructional_night+'","'+TotalInsTime+'","'+day_to+'","'+night_to+'","'+dayLanding+'","'+nightLanding+'","'+day_dual+'","'+night_dual+'","'+remark+'","hello","hello","'+stl_day+'","'+stl_night+'","'+TotalStlTime+'")',
      );
      // console.log('INSERT INTO buildLogbook (user_id,aircraft_id,aircraft_type,image,category,engine,engine_name,engine_class,engine_crew,day_pic,day_sic,day_p1_us,day_p1_ut,total,night_pic,night_sic,night_p1_us,night_p1_ut,night_total,total_flying_time,instrumental_time_actual,instrumental_time_simulated,simulator,instructional_flying_day,instructional_flying_night,instructional_flying_total,day_to,night_to,day_landing,night_landing,day_dual, night_dual, remark, key, lastUpdatedDate, stl_day, stl_night, stl_total) VALUES("'+user.id+'","'+params.BuildlogBookAirId+'","'+params.BuildlogBookAirType+'","hello","'+category+'","'+engine+'","'+engineName+'","'+Class+'","hello","'+day_pic+'","'+day_sic+'","'+dayp1_us+'","'+dayp1_ut+'","'+localTotalDayTime+'","'+night_pic+'","'+night_sic+'","'+nightp1_us+'","'+nightp1_ut+'","'+localTotalNightTime+'","'+
      // localTotalFlyingTime+'","'+actual+'","'+simulated+'","'+simulator+'","'+instructional_day+'","'+instructional_night+'","'+TotalInsTime+'","'+day_to+'","'+night_to+'","'+dayLanding+'","'+nightLanding+'","'+day_dual+'","'+night_dual+'","'+remark+'","hello","hello","'+stl_day+'","'+stl_night+'","'+TotalStlTime+'")')
    });
    alert('Inserted successfully');
  };

  React.useEffect(() => {WholeBuildLogbookData()},[]);

  const WholeBuildLogbookData =() => {
    let WholeData = [];
    db.transaction(tx => {
      //console.log('SELECT * from buildLogbook where aircraft_type = "'+params.BuildlogBookAirType+'"')
      tx.executeSql('SELECT * from buildLogbook', [], (tx, result) => {
        console.log('buildResult',result);
        for (let i = 0 ; i <= result.rows.length ; i++) {
          WholeData.push({
            user_id :  result.rows.item(i).user_id,
            aircraft_id : result.rows.item(i).aircraft_id,
            aircraft_type : result.rows.item(i).aircraft_type,
            category : result.rows.item(i).category,
            engine : result.rows.item(i).engine,
            engine_name : result.rows.item(i).engine_name,
            engine_class : result.rows.item(i).engine_class,
            engine_crew : result.rows.item(i).engine_crew,
            day_pic : result.rows.item(i).day_pic,
            day_sic : result.rows.item(i).day_sic,
            day_p1_us : result.rows.item(i).day_p1_us,
            day_p1_ut : result.rows.item(i).day_p1_ut,
            total : result.rows.item(i).total,
            night_pic : result.rows.item(i).night_pic,
            night_sic : result.rows.item(i).night_sic,
            night_p1_us : result.rows.item(i).night_p1_us,
            night_p1_ut : result.rows.item(i).night_p1_ut,
            night_total : result.rows.item(i).night_total,
            total_flying_time : result.rows.item(i).total_flying_time,
            instrumental_time_actual : result.rows.item(i).instrumental_time_actual,
            instrumental_time_simulated : result.rows.item(i).instrumental_time_simulated,
            simulator : result.rows.item(i).simulator,
            instructional_flying_day : result.rows.item(i).instructional_flying_day,
            instructional_flying_night : result.rows.item(i).instructional_flying_night,
            instructional_flying_total : result.rows.item(i).instructional_flying_total,
            day_to : result.rows.item(i).day_to,
            night_to : result.rows.item(i).night_to,
            day_landing : result.rows.item(i).day_landing,
            night_landing : result.rows.item(i).night_landing,
            day_dual : result.rows.item(i).day_dual,
            night_dual : result.rows.item(i).night_dual,
            remark : result.rows.item(i).remark,
            stl_day : result.rows.item(i).stl_day,
            stl_night : result.rows.item(i).stl_day,
            stl_total : result.rows.item(i).stl_total,
          });
          //console.log('Whole buildlogbook data',WholeData);
          dataDispatcher(BuildLogbookData({data: WholeData}))
        }
        });
    });
  }

  React.useEffect(() => {getPrepopulatedDataQuery();},[]);

  const getPrepopulatedDataQuery = () => {
    let data = [];
    db.transaction(tx => {
      //console.log('SELECT * from buildLogbook where aircraft_type = "'+params.BuildlogBookAirType+'"')
      {edit &&
      tx.executeSql('SELECT * from buildLogbook where aircraft_type = "'+params.BuildlogBookAirType+'"', [], (tx, result) => {
        console.log('buildResult',result);
        for (let i = 0 ; i <= result.rows.length ; i++) {
          data.push({
            user_id :  result.rows.item(i).user_id,
            aircraft_id : result.rows.item(i).aircraft_id,
            aircraft_type : result.rows.item(i).aircraft_type,
            category : result.rows.item(i).category,
            engine : result.rows.item(i).engine,
            engine_name : result.rows.item(i).engine_name,
            engine_class : result.rows.item(i).engine_class,
            engine_crew : result.rows.item(i).engine_crew,
            day_pic : result.rows.item(i).day_pic,
            day_sic : result.rows.item(i).day_sic,
            day_p1_us : result.rows.item(i).day_p1_us,
            day_p1_ut : result.rows.item(i).day_p1_ut,
            total : result.rows.item(i).total,
            night_pic : result.rows.item(i).night_pic,
            night_sic : result.rows.item(i).night_sic,
            night_p1_us : result.rows.item(i).night_p1_us,
            night_p1_ut : result.rows.item(i).night_p1_ut,
            night_total : result.rows.item(i).night_total,
            total_flying_time : result.rows.item(i).total_flying_time,
            instrumental_time_actual : result.rows.item(i).instrumental_time_actual,
            instrumental_time_simulated : result.rows.item(i).instrumental_time_simulated,
            simulator : result.rows.item(i).simulator,
            instructional_flying_day : result.rows.item(i).instructional_flying_day,
            instructional_flying_night : result.rows.item(i).instructional_flying_night,
            instructional_flying_total : result.rows.item(i).instructional_flying_total,
            day_to : result.rows.item(i).day_to,
            night_to : result.rows.item(i).night_to,
            day_landing : result.rows.item(i).day_landing,
            night_landing : result.rows.item(i).night_landing,
            day_dual : result.rows.item(i).day_dual,
            night_dual : result.rows.item(i).night_dual,
            remark : result.rows.item(i).remark,
            stl_day : result.rows.item(i).stl_day,
            stl_night : result.rows.item(i).stl_day,
            stl_total : result.rows.item(i).stl_total,
          });
          console.log('buildlogbook data',data);
            setCategory(result.rows.item(i).category)
            setEngine(result.rows.item(i).engine)
            setEngineName(result.rows.item(i).engine_name)
            setClass(result.rows.item(i).engine_class)
            setday_pic(result.rows.item(i).day_pic)
            setDay_dual(result.rows.item(i).day_dual)
            setday_sic(result.rows.item(i).day_sic)
            setDayp1_us(result.rows.item(i).day_p1_us)
            setDayp1_ut(result.rows.item(i).day_p1_ut)
        }
        });
      }
    });
  };

  React.useEffect(() => {
    if(edit && params.itemName){
      getEditBuildLogbookData()
    }
  },[edit,params.itemName]);

  const getEditBuildLogbookData = async() => {
    if (edit) {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
  //dataDispatcher(BuildLogbookData({data: []}))
  let data = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * from buildLogbook WHERE aircraft_type="'+params.itemName+'" limit 20', [], (tx, result) => {
      console.log(result);
      for (let i = 0 ; i <= result.rows.length ; i++) {
        data.push({
          id: result.rows.item(i).id,
          user_id: result.rows.item(i).user_id,
          aircraft_id : result.rows.item(i).aircraft_id,
          aircraft_type : result.rows.item(i).aircraft_type,
          category : result.rows.item(i).category,
          engine : result.rows.item(i).engine,
          engine_name : result.rows.item(i).engine_name,
          engine_class : result.rows.item(i).engine_class,
          engine_crew : result.rows.item(i).engine_crew,
          day_pic : result.rows.item(i).day_pic,
          day_sic : result.rows.item(i).day_sic,
          day_p1_us : result.rows.item(i).day_p1_us,
          day_p1_ut : result.rows.item(i).day_p1_ut,
          total : result.rows.item(i).total,
          night_pic : result.rows.item(i).night_pic,
          night_sic : result.rows.item(i).night_sic,
          night_p1_us : result.rows.item(i).night_p1_us,
          night_p1_ut : result.rows.item(i).night_p1_ut,
          night_total : result.rows.item(i).night_total,
          total_flying_time : result.rows.item(i).total_flying_time,
          instrumental_time_actual : result.rows.item(i).instrumental_time_actual,
          instrumental_time_simulated : result.rows.item(i).instrumental_time_simulated,
          simulator : result.rows.item(i).simulator,
          instructional_flying_day : result.rows.item(i).instructional_flying_day,
          instructional_flying_night : result.rows.item(i).instructional_flying_night,
          instructional_flying_total : result.rows.item(i).instructional_flying_total,
          day_to : result.rows.item(i).day_to,
          night_to : result.rows.item(i).night_to,
          day_landing : result.rows.item(i).day_landing,
          night_landing : result.rows.item(i).night_landing,
          day_dual : result.rows.item(i).day_dual,
          night_dual : result.rows.item(i).night_dual,
          remark : result.rows.item(i).remark,
          key : result.rows.item(i).key,
          lastUpdatedDate : result.rows.item(i).lastUpdatedDate,
          stl_day : result.rows.item(i).stl_day,
          stl_night : result.rows.item(i).stl_night,
          stl_total : result.rows.item(i).stl_total,
        });
        console.log('editable data',data);
        EditSetCategory(result.rows.item(i).category);
        editSetEngine(result.rows.item(i).engine)
        editSetEngineName(result.rows.item(i).engine_name)
        editSetClass(result.rows.item(i).engine_class)
        editSetday_pic(result.rows.item(i).day_pic)
        editSetday_sic(result.rows.item(i).day_sic)
        editSetDayp1_us(result.rows.item(i).day_p1_us)
        editSetDayp1_ut(result.rows.item(i).day_p1_ut)
        editSetDay_total(result.rows.item(i).total)
        editSetNight_pic(result.rows.item(i).night_pic)
        editSetNight_sic(result.rows.item(i).night_sic)
        editSetNightp1_us(result.rows.item(i).night_p1_us)
        editSetNight_sic(result.rows.item(i).night_sic)
        editSetNightp1_us(result.rows.item(i).night_p1_us)
        editSetNightp1_ut(result.rows.item(i).night_p1_ut)
        editSetNight_total(result.rows.item(i).night_total)
        editSetDay_dual(result.rows.item(i).day_dual)
        editSetNight_dual(result.rows.item(i).night_dual)
        editSetTotal_flyingTime(result.rows.item(i).total_flying_time)
        editSetActual(result.rows.item(i).instrumental_time_actual)
        editSetSimulated(result.rows.item(i).instrumental_time_simulated)
        editSetSimulator(result.rows.item(i).simulator)
        editSetInstructional_day(result.rows.item(i).instructional_flying_day)
        editSetInstructional_night(result.rows.item(i).instructional_flying_night)
        editSetInstructional_total(result.rows.item(i).instructional_flying_total)
        editSetDay_to(result.rows.item(i).day_to)
        editSetNight_to(result.rows.item(i).night_to)
        editSetDayLanding(result.rows.item(i).day_landing)
        editSetNightLanding(result.rows.item(i).night_landing)
        editSetStl_day(result.rows.item(i).stl_day)
        editSetStl_night(result.rows.item(i).stl_night)
        editSetStl_total(result.rows.item(i).stl_total)
        editSetRemark(result.rows.item(i).remark)
      
      }
      });
  });
}
}


//sqlite ends

  // stl hours calculation
console.log('engineName', engineName);
return (
  <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? "padding" : null}>
    <ScrollView ref={ref}>
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>

      <View style={styles.header}>
      <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
      <Text style={styles.aircrafts}>BuildLogbook</Text>
      </View>
    
    <View style={dark?styles.DarkHeadline:styles.headline}>
          <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>First Aircraft <Text style={{color:'red'}}>*</Text></Text>
    </View>

    <View style={{...styles.fieldWithoutBottom, ...styles.otherEnd, ...{zIndex:99}}}>
           <TouchableOpacity onPress={getLogBook}><Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Aircraft Type</Text></TouchableOpacity>
                {edit?<View style={{flexDirection:'row'}}>
                  <Text style={{marginTop:8, color:Colors.primary}}>{params.itemName?params.itemName:<Text>Select AirType</Text> }</Text>
                  <TouchableOpacity onPress={()=>navigation.navigate('BLAircraft', {fromScreen:'BuildLogBook'})}>
                  <MaterialCommunityIcons 
                  name="arrow-down-drop-circle-outline" color={'#256173'} size={18} style={{marginTop:8, paddingHorizontal:3}} />
                  </TouchableOpacity>
                  </View>:
                  <TouchableOpacity onPress={()=>navigation.navigate('Aircraft',{fromScreenBuildLogbbook:'BL'})}>
                  <Text style={styles.fieldText1}>{params.BuildlogBookAirType?params.BuildlogBookAirType:<Text>AirCraft Type</Text> }</Text>
                  </TouchableOpacity>}
    </View>

    <View style={dark?styles.DarkHeadline:styles.headline}>
          <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Category <Text style={{color:'red'}}>*</Text></Text>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
        <RadioButton.Group value={edit?editCategory:category} 
         onValueChange={edit?(editCategory)=>EditSetCategory(editCategory):(category)=>setCategory(category)}
         >
         <RadioButton.Android
            value={"Air Plane"}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
        </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Air Plane</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:78,}}>
        <RadioButton.Group value={edit?editCategory:category} 
          onValueChange={edit?(editCategory)=>EditSetCategory(editCategory):category=>setCategory(category)}>
          <RadioButton.Android
            value="microlight"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Microlight</Text>
        </View>
      </View>
      <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row',}}>
        <RadioButton.Group value={edit?editCategory:category} 
          onValueChange={edit?(editCategory)=>EditSetCategory(editCategory):category=>setCategory(category)}> 
         <RadioButton.Android
            value="Helicopter"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Helicopter</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:70}}>
        <RadioButton.Group value={edit?editCategory:category} 
          onValueChange={edit?(editCategory)=>EditSetCategory(editCategory):category=>setCategory(category)}>
        <RadioButton.Android
            value="Glider"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Glider</Text>
        </View>
      </View>

    <View style={dark?styles.DarkHeadline:styles.headline}>
          <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Engine <Text style={{color:'red'}}>*</Text></Text>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
        <RadioButton.Group value={edit?editEngine:engine} 
         onValueChange={edit?editEngine=>editSetEngine(editEngine):engine=>setEngine(engine)}>
         <RadioButton.Android
            value="Jet"
            color = '#256173'
            uncheckedColor = '#256173'
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Jet</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:40,}}>
        <RadioButton.Group value={edit?editEngine:engine} 
          onValueChange={edit?editEngine=>editSetEngine(editEngine):engine=>setEngine(engine)}>
          <RadioButton.Android
            value="Turbo Prop"
            color = '#256173'
            uncheckedColor = '#256173'
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Turbo Prop</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:25,}}>
        <RadioButton.Group value={edit?editEngine:engine} 
          onValueChange={edit?editEngine=>editSetEngine(editEngine):engine=>setEngine(engine)}>
        <RadioButton.Android
            value="Turbo Shaft"
            color = '#256173'
            uncheckedColor = '#256173'
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Turbo-Shaft</Text>
        </View>
      </View>
      <View style={styles.fieldWithoutBottom}>
          <View style={styles.underline}>
        <View style={{flexDirection:'row',}}> 
        <RadioButton.Group value={edit?editEngine:engine} 
          onValueChange={edit?editEngine=>editSetEngine(editEngine):engine=>setEngine(engine)}>
         <RadioButton.Android
            value="Piston"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>Piston</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:23}}>
        <RadioButton.Group value={edit?editEngine:engine} 
          onValueChange={edit?editEngine=>editSetEngine(editEngine):engine=>setEngine(engine)}>
        <RadioButton.Android
            value="Not Powered"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
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
            value={edit?editEngineName:engineName.toString()}
            onChangeText={edit?inputText=>editSetEngineName(inputText):inputText=>setEngineName(inputText)}
            style={{marginTop: -5, color:dark?'#fff':'#000'}} />
        </View>
        </View>

           <View style={styles.halfViews}>
              <View style={{justifyContent:'center', width:'30%'}}>
                  <Text style={styles.fieldText}>Class</Text>
              </View>
              <View style={{width:'70%'}}>
              <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
        <RadioButton.Group value={edit?editClass:Class} 
          onValueChange={edit?editClass=>editSetClass(editClass):Class=>setClass(Class)}>
         <RadioButton.Android
            value="ME Land"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>ME Land</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft: 20,}}>
        <RadioButton.Group value={edit?editClass:Class} 
          onValueChange={edit?editClass=>editSetClass(editClass):Class=>setClass(Class)}>
        <RadioButton.Android
            value="ME Sea"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>ME Sea</Text>
        </View>
      </View>
      <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row',}}>
        <RadioButton.Group value={edit?editClass:Class} 
          onValueChange={edit?editClass=>editSetClass(editClass):Class=>setClass(Class)}> 
         <RadioButton.Android
            value="SE Land"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
        </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>SE Land</Text>
        </View>
      <View style={{flexDirection:'row', paddingLeft:25}}>
      <RadioButton.Group value={edit?editClass:Class} 
          onValueChange={edit?editClass=>editSetClass(editClass):Class=>setClass(Class)}>
        <RadioButton.Android
            value="SE Sea"
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
      </RadioButton.Group>
          <Text style={styles.fieldTextRadio}>SE Sea</Text>
        </View>
      </View>
      </View>
      </View>

    <View style={dark?styles.DarkHeadline:styles.headline}>
        <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Time</Text>
    </View>

    <View style={{...styles.fields, ...styles.extra}}>
       <Text style={{...styles.fieldText, ...{fontWeight:'700'}}}>Day</Text>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>PIC/P1</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editDay_pic:day_pic}
                    onChangeText={edit?(inputText) => editSetday_pic(inputText):(inputText) => setday_pic(inputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>
    { Class=== 'SE Land' || Class=== 'SE Sea'|| editClass==='SE Land' || editClass==='SE Sea' ? <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Dual</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editDay_dual=='null'?'00:00':editDay_dual:day_dual}
                    onChangeText={edit?inputText => editSetDay_dual(inputText):inputText => setDay_dual(inputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View> : <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>SIC/P2</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editDay_sic:day_sic}
                    onChangeText={edit?inputText => editSetday_sic(inputText):inputText => setday_sic(inputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View> }
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>P1(U/S)</Text>
           { Class=== 'SE Land' || Class=== 'SE Sea' || editClass==='SE Land' || editClass==='SE Sea' ? <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>N/A</Text>:
           <MaskedTextInput
           mask= '99:99'
           value={edit?editDayp1_us:dayp1_us}
           onChangeText={edit?inputText => editSetDayp1_us(inputText):inputText => setDayp1_us(inputText)}
           keyboardType="numeric"
           placeholder="hh:mm"
       />}
        </View>
    </View>
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>P1(U/T)</Text>
           { Class=== 'SE Land' || Class=== 'SE Sea' || editClass==='SE Land' || editClass==='SE Sea' ? <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>N/A</Text>:
           <MaskedTextInput
           mask= '99:99'
           value={edit?editDayp1_ut:dayp1_ut}
           onChangeText={edit?inputText => editSetDayp1_ut(inputText):inputText => setDayp1_ut(inputText)}
           keyboardType="numeric"
           placeholder="hh:mm"
       />}
        </View>
    </View>
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Total</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={ edit?editDay_total:Class=== 'SE Land' || Class=== 'SE Sea' ? DaySETotalH :DayMETotalH }
                    onChangeText={edit?editDay_total => editSetDay_total(editDay_total):day_total => setDay_total(day_total)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={{...styles.fields, ...styles.extra}}>
       <Text style={{...styles.fieldText, ...{fontWeight:'700'}}}>Night</Text>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>PIC/P1</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit? editNight_pic : night_pic}
                    onChangeText={edit?(inputText) => editSetNight_pic(inputText):night_pic => setnight_pic(night_pic)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>
    { Class=== 'SE Land' || Class=== 'SE Sea' || editClass==='SE Land' || editClass==='SE Sea' ? <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Dual</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editNight_dual== 'null'?'00:00':editNight_dual:night_dual}
                    onChangeText={edit?(inputText) => editSetNight_dual(inputText):night_dual => setNight_dual(night_dual)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View> : <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>SIC/P2</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit? editNight_sic :night_sic}
                    onChangeText={edit?(inputText) => editSetNight_sic(inputText):night_sic => setnight_sic(night_sic)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View> }
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>P1(U/S)</Text>
           { Class=== 'SE Land' || Class=== 'SE Sea' ||  editClass==='SE Land' || editClass==='SE Sea' ? <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>N/A</Text>:
           <MaskedTextInput
           mask= '99:99'
           value={edit? editNightp1_us : nightp1_us}
           onChangeText={edit?(inputText) => editSetNightp1_us(inputText):nightp1_us => setNightp1_us(nightp1_us)}
           keyboardType="numeric"
           placeholder="hh:mm"
       />}
        </View>
    </View>
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>P1(U/T)</Text>
           { Class=== 'SE Land' || Class=== 'SE Sea' || editClass==='SE Land' || editClass==='SE Sea'? <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>N/A</Text>:
           <MaskedTextInput
           mask= '99:99'
           value={edit? editNightp1_ut :nightp1_ut}
           onChangeText={edit?(inputText) => editSetNightp1_ut(inputText):nightp1_ut => setNightp1_ut(nightp1_ut)}
           keyboardType="numeric"
           placeholder="hh:mm"
       />}
        </View>
    </View>
    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Total</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editNight_total:Class=== 'SE Land' || Class=== 'SE Sea' ? NightSETotalH : NightMETotalH }
                    onChangeText={edit?editNight_total => editSetNight_total(editNight_total):night_total => setNight_total(night_total)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Total Flying Time *</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editTotal_flying_time:Class=== 'SE Land' || Class=== 'SE Sea' ? TotalSEFlyingTime : TotalMEFlyingTime}
                    onChangeText={edit?editTotal_flying_time => editSetTotal_flyingTime(editTotal_flying_time):total_flying_time => setTotal_flyingTime(total_flying_time)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>STL Hours</Text>
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Day</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editStl_day=== 'null'?'00:00':editStl_day:stl_day}
                    onChangeText={edit?(InputText) => editSetStl_day(InputText):(InputText) => setStl_Day(InputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Night</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editStl_night==='null'?'00:00':editStl_night:stl_night}
                    onChangeText={edit?InputText => editSetStl_night(InputText):InputText => setStl_Night(InputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Total</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editStl_total==='null'?'00:00':editStl_total:TotalStlTime}
                    onChangeText={edit?InputText => editSetStl_total(InputText):InputText => setStl_Total(InputText)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Instrument Time</Text>
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Actual</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editActual:actual}
                    onChangeText={edit?(inputText) => editSetActual(inputText):actual => setActual(actual)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Simulated</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit? editSimulated : simulated}
                    onChangeText={edit?(inputText) => editSetSimulated(inputText):simulated => setSimulated(simulated)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Simulator</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editSimulator:simulator}
                    onChangeText={edit?(inputText) => editSetSimulator(inputText):simulator => setSimulator(simulator)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Instructional Flying</Text>
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Day</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editInstructional_day:instructional_day}
                    onChangeText={edit?(inputText) => editSetInstructional_day(inputText):instructional_day => setInstructional_day(instructional_day)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Night</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editInstructional_night:instructional_night}
                    onChangeText={edit?(inputText) => editSetInstructional_night(inputText):instructional_night => setInstructional_night(instructional_night)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Total</Text>
           <MaskedTextInput
                    mask= '99:99'
                    value={edit?editInstructional_total:TotalInsTime}
                    onChangeText={edit?editInstructional_total => editSetInstructional_total(editInstructional_total):instructional_total => setInstructional_total(instructional_total)}
                    keyboardType="numeric"
                    placeholder="hh:mm"
                />
        </View>
    </View>

    <View style={dark?styles.DarkHeadline:styles.headline}>
        <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>T/O & Landing</Text>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Day T/O</Text>
           <TextInput
           placeholder='Please Enter Number'
           placeholderTextColor='#393F45'
           value={edit?editDay_to:day_to}
           onChangeText={edit?(inputText) => editSetDay_to(inputText):day_to => setDay_to(day_to)}
           style={{marginTop: -5}} />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Night T/O</Text>
           <TextInput
           placeholder='Please Enter Number'
           placeholderTextColor='#393F45'
           value={edit?editNight_to:night_to}
           onChangeText={edit?(inputText) => editSetNight_to(inputText):night_to => setNight_to(night_to)}
           style={{marginTop: -5}} />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Day Landing</Text>
           <TextInput
           placeholder='Please Enter Number'
           placeholderTextColor='#393F45'
           value={edit?editDayLanding:dayLanding}
           onChangeText={edit?(inputText) => editSetDayLanding(inputText):dayLanding => setDayLanding(dayLanding)}
           style={{marginTop: -5}} />
        </View>
    </View>

    <View style={styles.fieldWithoutBottom}>
        <View style={styles.fields}>
           <Text style={{...styles.fieldText, ...{lineHeight:35,}}}>Night Landing</Text>
           <TextInput
           placeholder='Please Enter Number'
           placeholderTextColor='#393F45'
           value={edit?editNightLanding:nightLanding}
           onChangeText={edit?(inputText) => editSetNightLanding(inputText):nightLanding => setNightLanding(nightLanding)}
           style={{marginTop: -5}} />
        </View>
    </View>

    <View style={dark?styles.DarkHeadline:styles.headline}>
        <Text style={dark?styles.DarkHeadlineText:styles.HeadlineText}>Remarks</Text>
    </View>

    <View style={{padding:20,}}>
    <View style={[styles.remarksBox, {borderColor: theme.color}]}>
    <TextInput
           placeholder=' Your Remarks'
           placeholderTextColor='#393F45'
           value={edit? editRemark :remark}
           onChangeText={edit?(inputText) => editSetRemark(inputText):remark => setRemark(remark)}
           style={Platform.OS=== 'android' ? {marginTop: -20,color:dark?'#fff':'#000'}: {marginTop:-10}} />
    </View>
    </View>

    {edit === true ? console.log('hello') : console.log('world')}
    
    <View style={dark?styles.DarkBottomButtonSection:styles.bottomButtonSection}>
    {edit ?<TouchableOpacity onPress={editable}>
    <View style={{paddingLeft:15}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}>cancel</Text>
      </View>
    </View>
    </TouchableOpacity>:<TouchableOpacity onPress={editable}>
    <View style={{paddingLeft:15}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}>Edit</Text>
      </View>
    </View>
    </TouchableOpacity>}

    {edit?<TouchableOpacity onPress={()=>{Edit();Update_locally()}}>
      <View style={{paddingHorizontal:85,}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}> Save </Text>
      </View>
      </View>
    </TouchableOpacity>:<TouchableOpacity onPress={()=>{insertQuery();upload_logbook()}}>
      <View style={{paddingLeft:35,}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}> Save & Add another {'\n'} Aircraft</Text>
      </View>
      </View>
    </TouchableOpacity>}

    {edit?<TouchableOpacity onPress={()=>{Delete();Delete_locally();}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}>Delete</Text>
      </View>
    </TouchableOpacity>:<TouchableOpacity onPress={()=>{}}>
      <View style={{paddingLeft:35,}}>
      <View style={styles.button}>
      <Text style={styles.buttonText}>Upload{'\n'}Logbook</Text>
      </View>
      </View>
    </TouchableOpacity>}
    </View>

    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    headline: {
        padding: 20,
        backgroundColor: '#F3F3F3',
        width: '100%',
        justifyContent:'center',
    },
    HeadlineText:{
        color:'#000',
        fontSize: Platform.OS == 'ios' ? 14 : 16,
        fontFamily: 'WorkSans-Regular',
        fontWeight: '700'
    },
    fieldWithoutBottom: {
        paddingHorizontal:15, 
        paddingVertical:10, 
        width:'100%',
        flexDirection:'row'
    },
    otherEnd: {
        justifyContent: 'space-between'
    },
    fieldText1: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '600',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.accent
    },
    fieldText: {
        fontSize: Platform.OS == 'ios' ? 13 : 15,
        //marginTop: 5,
        fontWeight: Platform.OS == 'ios' ? '600' : '700',
        fontFamily: 'WorkSans-Regular',
        lineHeight: 25,
        color: Colors.primary,
        },
    fieldTextRadio: {
            fontSize: 14,
            //marginTop: 5,
            fontWeight: Platform.OS == 'ios' ? '600':'700',
            fontFamily: 'WorkSans-Regular',
            lineHeight: 30,
            color: Colors.primary,
            },
        underline:{
                borderBottomWidth: 0.6,
                borderBottomColor: Colors.accent,
                //paddingVertical:15,
                width: '100%',
                flexDirection: 'row'
            },
        fields:{
                borderBottomWidth: 0.6,
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
        extra: {
            padding:15,
        },
        extra1:{
          paddingHorizontal: 25,
          paddingVertical: 15
        },
        remarksBox: {
          borderWidth:1, 
          borderRadius:10,
          borderColor: '#000', 
          width: Dimensions.get('window').width * 0.9,
          padding: Platform.OS=== 'android' ? 10: 20,
        },
        bottomButtonSection:{
          padding: 5,
          backgroundColor:'#F3F3F3',
          width: '100%',
          flexDirection: 'row',
        },
        button: {
          backgroundColor: Colors.primary,
          padding: 10,
          marginTop: 5,
          //width: Dimensions.get('window').width*0.2,
          width:'100%',
          borderRadius:10,
          alignItems:'center'
        },
        buttonText:{
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center'
        },
        header:{
          padding:15, 
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
        //dark
        DarkHeadline:{
          padding: 20,
          backgroundColor: '#000',
          width: '100%',
          justifyContent:'center',
        },
        DarkHeadlineText:{
          color:'#fff',
          fontSize: 14,
          fontFamily: 'WorkSans-Regular',
        },
        DarkBottomButtonSection:{
          padding: 5,
          backgroundColor:'#000',
          width: '100%',
          flexDirection: 'row',
        },
});

//make this component available to the app
export default BuildBook;
