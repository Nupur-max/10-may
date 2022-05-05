//import liraries
import React from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet,RefreshControl,Alert, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions, Modal,SafeAreaView,Platform } from 'react-native';
import { LogbookListing } from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../../params-context';
import { useDispatch, useSelector } from 'react-redux';
import { LogListData } from '../../store/actions/loglistAction';
import { Divider,ProgressBar } from 'react-native-paper';
import { ThemeContext } from '../../theme-context';
import SegmentedControlTab from "react-native-segmented-control-tab";
import NetInfo from "@react-native-community/netinfo";
import Swipeout from 'react-native-swipeout';
import { BaseUrl } from '../../components/url.json';
import {BaseUrlAndroid} from '../../components/urlAndroid.json';
import DatePicker from 'react-native-datepicker';

import { DisplayContext } from '../../display-context';

import SQLite from 'react-native-sqlite-storage';

import Draggable from 'react-native-draggable';

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
const LogBookListing = ({ navigation }) => {

  const { datee, Dateform, DateFormat, role, config, configCheck,egcaModalOpen,setEgcaModalOpen } = React.useContext(DisplayContext);

  const isFocused = useIsFocused();

  const dataDispatcher = useDispatch();
  const dataSelector = useSelector(state => state.logList.data);
  const { dark, theme, toggle } = React.useContext(ThemeContext);

  const getReduxBACKUPData = useSelector(state => state.backup.BackupTime);

  const [localLogbookData, setLocalLogbookData] = React.useState([])

  const [loading, setLoading] = React.useState(false)

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const [search, setSearch] = React.useState('')

  const [modalVisible, setModalVisible] = React.useState(false);

  const [downloadmodalVisible, setDownloadModalVisible] = React.useState(false);

  const [checkTag, setCheckTag] = React.useState('');

  const [deletedRoaster, setDeletedRoaster] = React.useState(false)

  const [reg_date, setReg_date] = React.useState('')

  const [rosterId, setRosterId] = React.useState('')

  const [rosterLength, setRosterLength] = React.useState('')

  const [freeHours, setFreeHours] = React.useState('')

  const [subscribe, setSubscribe] = React.useState('')

  const [done, setDone] = React.useState(false)

  const [refreshing,setRefreshing] = React.useState(false)

  const [openButtons,setOpenButtons] = React.useState(false)

  const [RostermodalVisible, setRosterModalVisible] = React.useState(false);

  const [fromDate, setFromDate] = React.useState('')
  
  const [toDate, setToDate] = React.useState('')

  const [dataFetched, setDataFetched]=React.useState(false);

  const [userRosterId,setUserRosterId] = React.useState('');

  const [userRosterPwd, setUserRosterPwd]= React.useState('');

  const [userRosterAirlineType, setUserAirlineType]= React.useState('');

  const [progressValue, setProgressValue] = React.useState('')

  const [showProgress, setShowProgress] = React.useState(true)



  const [selectedId, setSelectedId] = React.useState('')
  const [focused, setFocused] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [loadmore, setLoadmore] = React.useState(false);
  const [findTag, setFindTag] = React.useState('')
  const [totalFlyingHours, setTotalFlyingHours] = React.useState('')

  const [activeRowKey, setActiveRowKey] = React.useState(null)

  const Roaster = async() => {
    setShowProgress(true)
    setProgressValue(0.3)
    //dataDispatcher(LogListData({ data: [], inProgress: false }))
    setDataFetched(true)
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);

    await fetch(Platform.OS==='ios'?BaseUrl + 'roasterImport':BaseUrlAndroid + 'roasterImport', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_id": user.id,
        "user": userRosterId, 
        "pass": userRosterPwd,
        "airline_type": userRosterAirlineType,
        "from": fromDate,
        "to": toDate,
      })
    }).then(res => res.json())
      .then(resData => {
      if(resData.msg!==false){
        for (let i = 0; i < resData.data.length; i++) {

          const AircraftReg = resData.data[i].Aircraft_Reg
          const AircraftType = resData.data[i].Aircraft_type
          const chocksOn = resData.data[i].Arrival_time
          const date = resData.data[i].Dept_date
          const fromCity = resData.data[i].Dept_place_ICAO
          const toCity = resData.data[i].Arrival_place_ICAO
          const chocksOff = resData.data[i].Dept_time
          const dayland = resData.data[i].Lands_Day
          const nightLand = resData.data[i].Lands_Night
          const SelfField = resData.data[i].Name_PIC
          const dayTO = resData.data[i].TkkOff_Day
          const nightTO = resData.data[i].TkkOff_Night
          const RosterFromLat = resData.data[i].RosterFromLat
          const RosterFromLong = resData.data[i].RosterFromLong
          const RosterToLat = resData.data[i].RosterToLat
          const RosterToLong = resData.data[i].RosterToLong
          const Pilot_Pic = resData.data[i].Pilot_function_PIC
          const Pilot_Copilot = resData.data[i].Pilot_function_Copilot
          const Pilot_Instructor = resData.data[i].error

          const RealAircraftType = AircraftType === '320' || AircraftType === '321' ? 'A-' + AircraftType : AircraftType;

         console.log('Pilot_Copilot', Pilot_Copilot)

          let text = date;
          const myArray = text.split("-");
          const day = myArray[2] + myArray[1] + myArray[0]

      prePopulateddb.transaction((tx) => {
        tx.executeSql(
          'SELECT * from logbook WHERE user_id="'+user.id+'" AND tag="roster" AND onTime="'+chocksOn+'"', [], (tx, result1) => {

            if(result1.rows.length>0){
              if ((i + 1) == resData.data.length) {
              Alert.alert(
                "This data is already fetched",
                "Do you want to skip?",
                [
                  {
                    text: "Skip",
                    onPress: () => {console.log('cancel pressed')}
                  },
                  //{ text: "Cancel", onPress: () => console.log('cancel pressed') }
                ]
              )
              }
              if (Pilot_Pic !== '') {
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'",instructional="'+Pilot_Instructor+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              else if (Pilot_Copilot === '' && Pilot_Pic === ''){
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'",instructional="'+Pilot_Instructor+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              else if (Pilot_Instructor !== ''){
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'",instructional="'+Pilot_Instructor+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              setProgressValue(1)
              setShowProgress(false)
              setRosterModalVisible(false)
            }
            else{
            prePopulateddb.transaction((tx) => {
            if (Pilot_Pic !== '') {
              //Alert.alert('Pilot_Pic')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate,instructional) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '","'+Pilot_Instructor+'")',
              );
            }
            else if (Pilot_Copilot === '' && Pilot_Pic === '') {
              //Alert.alert ('Pilot_Copilot')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate,instructional) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '","'+Pilot_Instructor+'")',
              );
            }
            else if (Pilot_Instructor !== '') {
              //Alert.alert ('Pilot_Instructor')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate,instructional) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '","'+Pilot_Instructor+'")',
              );
            }
            console.log('data pos ' + i + ' ' + resData.data.length);
            
            if (resData.data.length > 10) {
              setProgressValue(0.5)
            }

            if(resData.msg!==false){
            if ((i + 1) == resData.data.length) {
              //selection from table logbook
              let temData = [];
              prePopulateddb.transaction(tx => {
                tx.executeSql('SELECT id,tag,aircraftType,aircraftReg,user_id,date,from_nameICAO,to_nameICAO,offTime,onTime,from_lat,from_long,to_lat,to_long,p1,p2,dayLanding,nightLanding,dayTO,nightTO,instructional from logbook WHERE user_id = "' + user.id + '" AND tag ="roster" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime DESC', [], (tx, result) => {
                  setOffset(offset + 10);
                  
                  for (let j = 0; j < result.rows.length; j++) {
                    temData.push({
                      id: result.rows.item(j).id,
                      tag: result.rows.item(j).tag,
                      aircraftType: result.rows.item(j).aircraftType,
                      aircraftReg: result.rows.item(j).aircraftReg,
                      user_id: result.rows.item(j).user_id,
                      date: result.rows.item(j).date,
                      from: result.rows.item(j).from_nameICAO, //add here
                      to: result.rows.item(j).to_nameICAO,
                      chocksOffTime: result.rows.item(j).offTime,
                      chocksOnTime: result.rows.item(j).onTime,
                      from_lat: result.rows.item(j).from_lat,
                      from_long: result.rows.item(j).from_long,
                      to_lat: result.rows.item(j).to_lat,
                      to_long: result.rows.item(j).to_long,
                      p1: result.rows.item(j).p1,
                      p2: result.rows.item(j).p2,
                      dayLanding: result.rows.item(j).dayLanding,
                      nightLanding: result.rows.item(j).nightLanding,
                      dayTO: result.rows.item(j).dayTO,
                      nightTO: result.rows.item(j).nightTO,
                      instructional: result.rows.item(j).instructional,
                    });
                    console.log('Entry fetched ' + j + ' out of :' + result.rows.length);
                    setProgressValue(1)
                    dataDispatcher(LogListData({ data: temData, inProgress: false }))
                    let jPos = j + 1
                    if (jPos == result.rows.length) {
                        fetch(Platform.OS==='ios'?BaseUrl + 'edit_profile':BaseUrlAndroid + 'edit_profile', {
                          method: 'POST',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            "user_id": user.id,
                            "rosterLength" : result.rows.length,
                    
                          })
                        }).then(res => res.json())
                          .then(resData => {
                            //console.log(resData);
                            //GetUserDetails()
                            //Alert.alert(resData.message);
                    });
                    
                      Alert.alert("Message", 'Data fetched successfully');
                      setDataFetched(false)
                      //setModalVisible(false)
                      return false;
                    }
                  }
                });
              });
            }
          }
          });
        }
        });
        });

        }
      }
      else {
        alert('Invalid Credentials')
        setShowProgress(false)
      }
       })
      .catch((error) => {
          console.log(error)
        setShowProgress(false)
        //setModalVisible(false)
        alert('Something Went wrong')
      });
  }
 

  const onFocusChange = () => setFocused(true);
  const onFocusCancelled = () => setFocused(false);

  const [, setParamsLogbook] = React.useContext(ParamsContext);

  React.useEffect(() => {
    if(isFocused){
      dataToServer()
    }
  },[isFocused]);

  const dataToServer = async() => {
    
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    
    NetInfo.addEventListener(networkState => {
      // console.log("Connection type - ", networkState.type);
       //console.log("Is connected? - ", networkState.isConnected);
      if (networkState.isConnected === false) {
        console.log("due to network unavailability your data is not syncronized with server but whenever the network would be availbale it would automatically sync with server...")
      }
      else {
         prePopulateddb.transaction(tx => {
          tx.executeSql('SELECT * from logbook WHERE user_id = "' + user.id + '"AND tag = "manual"', [], (tx, result1) => {
            //console.log('hello',result1.rows.length)
            for(i = 0; i <= result1.rows.length; i++) {

              const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
              "July", "Aug", "Sep", "Oct", "Nov", "Dec"
              ];

              const Serverddmmyy = ("0" + result1.rows.item(i).date.getDate()).slice(-2) + "-" + (monthNames[result1.rows.item(i).date.getMonth()]) + "-" + result1.rows.item(i).date.getFullYear();

           
             console.log(result1.rows.item(i).date)

              if(result1.rows.length>0){
               console.log('uploading to server')
              // console.log('dsgfdgfd',result1.rows.item(i).id)
               fetch(Platform.OS==='ios'?BaseUrl + 'addLogbook':BaseUrlAndroid + 'addLogbook', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "roaster_id": result1.rows.item(i).id,
                    "user_id": user.id,
                    "local_id" : result1.rows.item(i).id,
                    "tag": 'server',
                    "date": Serverddmmyy,
                    "flight_no": '',
                    "aircraftReg": result1.rows.item(i).aircraftReg,
                    "aircraftType": result1.rows.item(i).aircraftType,
                    "route": result1.rows.item(i).route,
                    "from_city": 'hello',
                    "from_nameICAO": result1.rows.item(i).from_nameICAO,
                    "to_city": 'hello',
                    "to_nameICAO": result1.rows.item(i).to_nameICAO,
                    "p1": result1.rows.item(i).p1,
                    "p2": result1.rows.item(i).p2,
                    "totalTime": result1.rows.item(i).totalTime,
                    "day": result1.rows.item(i).day,
                    "night": result1.rows.item(i).night,
                    "actual_Instrument": result1.rows.item(i).actual_Instrument,
                    "dual_day": result1.rows.item(i).dual_day,
                    "dual_night": result1.rows.item(i).dual_night,
                    "ifr_vfr": result1.rows.item(i).ifr_vfr,
                    "p1_us_day": result1.rows.item(i).p1_us_day,
                    "p1_us_night": result1.rows.item(i).p1_us_night,
                    "p1_ut_day": result1.rows.item(i).p1_ut_day,
                    "p1_ut_night": result1.rows.item(i).p1_ut_night,
                    "pic_day": result1.rows.item(i).pic_day,
                    "pic_night": result1.rows.item(i).pic_night,
                    "sim_instrument": result1.rows.item(i).sim_instrument,
                    "stl": result1.rows.item(i).stl,
                    "sic_day": result1.rows.item(i).sic_day,
                    "sic_night": result1.rows.item(i).sic_night,
                    "x_country_day": result1.rows.item(i).x_country_day,
                    "x_country_night": result1.rows.item(i).x_country_night,
                    "x_country_day_leg": result1.rows.item(i).x_country_day_leg,
                    "x_country_night_leg": result1.rows.item(i).x_country_night_leg,
                    "dayLanding": result1.rows.item(i).dayLanding,
                    "nightLanding": result1.rows.item(i).nightLanding,
                    "dayTO": result1.rows.item(i).dayTO,
                    "nightTO": result1.rows.item(i).nightTO,
                    "remark": result1.rows.item(i).remark,
                    "timeCustom1": result1.rows.item(i).purpose1,
                    "timeCustom2": "",
                    "timeCustom3": "",
                    "timeCustom4": "",
                    "timeCustom5": "",
                    "timeCustom6": "",
                    "timeCustom7": "",
                    "timeCustom8": "",
                    "timeCustom9": "",
                    "timeCustom10": "",
                    "landingCustom1": "",
                    "landingCustom2": "",
                    "landingCustom3": "",
                    "landingCustom4":"",
                    "landingCustom5": "",
                    "landingCustom6": "",
                    "landingCustom7": "",
                    "landingCustom8": "",
                    "landingCustom9": "",
                    "landingCustom10": "",
                    "approach1": result1.rows.item(i).approach1,
                    "approach2" : result1.rows.item(i).approach2,
                    "approach3": "",
                    "approach4": "",
                    "approach5": "",
                    "approach6": "",
                    "approach7": "",
                    "approach8": "",
                    "approach9": "",
                    "approach10": "",
                    "crewCustom1": "",
                    "crewCustom2": "",
                    "crewCustom3": "",
                    "crewCustom4": "",
                    "crewCustom5": "",
                    "onTime": result1.rows.item(i).onTime,
                    "offTime": result1.rows.item(i).offTime,
                    "inTime": result1.rows.item(i).inTime,
                    "outTime": result1.rows.item(i).outTime,
                    "reliefCrew1":result1.rows.item(i).reliefCrew1,
                    "reliefCrew2":result1.rows.item(i).reliefCrew2,
                    "reliefCrew3":result1.rows.item(i).reliefCrew3,
                    "reliefCrew4":result1.rows.item(i).reliefCrew4,
                    "reliefCrew5":"",
                    "instructor":result1.rows.item(i).instructor,
                    "instructional":result1.rows.item(i).instructional,
                    "student":result1.rows.item(i).student,
                    "waterLanding":result1.rows.item(i).waterLanding,
                    "waterTO":result1.rows.item(i).waterTO,
                    "touch_n_gos":result1.rows.item(i).touch_n_gos,
                    "fullStop":result1.rows.item(i).fullStop,
                    "autolanding":result1.rows.item(i).autolanding,
                    "flight":result1.rows.item(i).flight,
                    "sim_type": result1.rows.item(i).sim_type,
                    "simLocation":result1.rows.item(i).simLocation,
                    "sim_exercise":result1.rows.item(i).sim_exercise,	
                    "pf_hours":result1.rows.item(i).pf_time,
                    "pm_hours":result1.rows.item(i).pm_time,
                    "sfi_sfe":result1.rows.item(i).sfi_sfe,
                    "from_lat":result1.rows.item(i).from_lat,
                    "from_long":result1.rows.item(i).from_long,
                    "to_lat":result1.rows.item(i).to_lat,
                    "to_long":result1.rows.item(i).to_long,
                    "is_Saved":1,
                })
            }).then(res => res.json())
                .then(resData => {
                   console.log(resData);
                   //alert('hello')
                }).catch((error) => {
                  console.log('error',error)
                });
            }
            else{
              console.log('No available data')
            }
          }
        })
        })
      }
    });
}

  React.useEffect(() => {
    if(isFocused){
  GetUserDetails();
    }
  }, [isFocused]);

  const GetUserDetails = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = [];
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT roster_id,roster_pwd,airline_type,reg_date,roster_id,Total_flying_hours,rosterLength,freeHours,subscribe FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available '); 
        }
        else {
          console.log('error')
        }
        for (let i = 0; i <= result.rows.length; i++) {
          temData.push({
            user_id: result.rows.item(i).user_id,
            reg_date: result.rows.item(i).reg_date,
            roster_id: result.rows.item(i).roster_id,
            Total_flying_hours: result.rows.item(i).Total_flying_hours,
            rosterLength : result.rows.item(i).rosterLength,
            roster_id: result.rows.item(i).roster_id,
            roster_pwd: result.rows.item(i).roster_pwd,
            airline_type: result.rows.item(i).airline_type,
          });
          console.log('subscription', result.rows.item(i).subscribe);
          console.log('rosterLength', result.rows.item(i).rosterLength);
          console.log('freeHours', result.rows.item(i).freeHours);
          setReg_date(result.rows.item(i).reg_date)
          setRosterId(result.rows.item(i).roster_id)
          setRosterLength(result.rows.item(i).rosterLength)
          //setTotalFlyingHours(result.rows.item(i).Total_flying_hours)
          setFreeHours(result.rows.item(i).freeHours)
          setSubscribe(result.rows.item(i).subscribe)
          setUserRosterId(result.rows.item(i).roster_id)
          setUserRosterPwd(result.rows.item(i).roster_pwd)
          setUserAirlineType(result.rows.item(i).airline_type)
         }
        });
    });
  }

  const subscription = () => {
    const subscribe_date = new Date();
    const after15Days = subscribe_date.setDate(subscribe_date.getDate() + 15);
  }

  // roster data

  // local data

  const getReduxProgressData = useSelector(state => state.progressBar.ProgressValue);
  const ProgressBar1 = getReduxProgressData.ProgressValue + '/' + getReduxProgressData.totalvalue

 const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[LogbookListing.item]}>
      <View style={dark?[LogbookListing.Darklisting,backgroundColor]:[LogbookListing.listing, backgroundColor]}>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={dark?{color:'#fff',fontFamily: 'WorkSans-Bold', fontSize: 15}:{ fontFamily: 'WorkSans-Bold', fontSize: 15 }}>{item.date} </Text>
                 <MaterialCommunityIcons name={item.tag === 'uploaded' ? "lock" : "lock-open-variant"} color={dark?'#fff':'#000'} size={20} style={{}} /> 
          </View>
          <Divider/>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={dark?{color:'#fff', fontWeight: 'bold', paddingTop: 10 }:{ fontWeight: 'bold', paddingTop: 10 }}>{item.from}</Text>
            {item.aircraftReg==="SIMU"?
            <MaterialCommunityIcons name="seat-recline-extra" color={dark?'#fff':'#000'} size={30} style={{ paddingHorizontal: 10, paddingTop: 10 }} />:
            <MaterialCommunityIcons name="airplane-takeoff" color={dark?'#fff':'#000'} size={30} style={{ paddingHorizontal: 10, paddingTop: 10 }} />
            }
            <Text style={dark?{color:'#fff',fontWeight: 'bold', paddingTop: 10}:{ fontWeight: 'bold', paddingTop: 10 }}>{item.to}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {item.aircraftReg === 'SIMU' ? <Text style={{color:dark?'#fff':'#000'}}>{item.takeOff}</Text> : <Text style={{color:dark?'#fff':'#000'}}>{item.chocksOffTime}</Text>}
            {item.aircraftReg === 'SIMU' ? <Text style={dark?{color:'#fff',paddingLeft: 28}:{ paddingLeft: 28 }}>{item.landing}</Text> : <Text style={dark?{color:'#fff',paddingLeft: 28}:{ paddingLeft: 28 }}>{item.chocksOnTime}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  

  const renderItem = ({ item }) => {

    const backgroundColor = item.tag === 'manual' || item.tag === 'uploaded' || item.tag === 'server' || item.tag === 'null' ? dark?"#000":"#fff" : item.tag === 'roster' ? "#708090" : item.id === selectedId ? "grey" : '';
  
    const color = item.id === selectedId ? 'white' : 'black';
    
    const changDateFormat = (date) => {
      if (date.length < 20) {
        let str = date;
        const myArr = str.split("-");
        date = myArr[2] + '-' + myArr[1] + '-' + myArr[0];
        return date;
      } else {
        return date;
      }
    }

    const DeleteEgcaUploadedFlights = () =>
    Alert.alert(
      "Caution!!!!",
      "Before deleting From logbook Please also delete it from Egca",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {DeleteLogs();deleteLogbbok()} }
      ]
    );

    const swipeSettings = {
      autoClose : true,
      onClose : (secId, rowId, direction) => {
        if(activeRowKey != null){
        setActiveRowKey(null);
        }
      },
      onOpen : (secId, rowId, direction) => {
        setActiveRowKey(selectedId)
      },
      right : [
        {
          onPress: () => {
            item.tag==='uploaded' ? Alert.alert(
              'This flight is Uploaded on egca already',
              'Are you Still want to delete ?',
              [
                {text : 'No', onPress : () => console.log('Cancel Pressed'), style:'cancel'},
                {text : 'Yes', onPress: () => {DeleteEgcaUploadedFlights()}},
              ],
            ):
            Alert.alert(
              'Alert',
              'Are you sure you want to delete ?',
              [
                {text : 'No', onPress : () => console.log('Cancel Pressed'), style:'cancel'},
                {text : 'Yes', onPress: () => {DeleteLogs();deleteLogbbok()}},
              ],
            )
          },
          text: 'Delete', type: 'delete'
        }
      ],
      rowId: selectedId,
      sectionId: selectedId
    }

    const deleteLogbbok = async () => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);

      await fetch(Platform.OS==='ios'?BaseUrl + 'deletelogbook':BaseUrlAndroid + 'deletelogbook', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "user_id": user.id,
              "id": item.serverId,
          })
      }).then(res => res.json())
          .then(resData => {
              //Alert.alert(resData.message);
          });
  };

  console.log(item.serverId)

    const DeleteLogs = () => {
      prePopulateddb.transaction(tx => {
        tx.executeSql(
          'DELETE FROM logbook WHERE id = "'+item.serverId+'"', [], (tx, Delresult) => {
            SELECTAfterDelOnSlide()
            //navigation.navigate('LogBookListing')
          }
        );
      });
    }
  
    const SELECTAfterDelOnSlide = async () => {
      onRefresh()
    }

    const selectingEgcaUploadedFlights = ()=>{
      Alert.alert(
        "WARNING!!!!This flight has been already uploaded on EGCA",
        "Do you still want to Edit ? ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => LastWarningEgcaUploadedFlights() }
        ]
      );
    }

    const LastWarningEgcaUploadedFlights = ()=>{
      Alert.alert(
        "Please make Sure to delete the flight from Egca",
        "Are you sure to proceed? ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => selectParams() }
        ]
      );
    }

    const selectParams = () => {
      setSelectedId(item.id)
      setParamsLogbook(previousParams => ({
        ...(previousParams || {}),
        childParamList: 'Listvalue',
        fromParams: 'Logbook',
        RoasterId: item.serverId,
        RoasterDate: changDateFormat(item.date),
        RoasterAType: item.aircraftType,
        RoasterFrom: item.from,
        RoasterFrom_lat: item.from_lat,
        RoasterFrom_long: item.from_long,
        RoasterChocksOff: item.chocksOffTime,
        RoasterChocksOn: item.chocksOnTime,
        RoasterP1: item.p1,
        RoasterP2: item.p2,
        RoasterTo: item.to,
        RoasterTo_lat: item.to_lat,
        RoasterTo_long: item.to_long,
        RoasterSim_type: item.sim_type,
        RoasterSim_exc: item.sim_exercise,
        RoasterPf_time: item.pf_time,
        RoasterPm_time: item.pm_time,
        RoasterSF: item.sfi_sfe,
        RoasterSimLoc: item.simLocation,
        RoasterTakeoff: item.takeOff,
        Roasterlanding:item.landing,
        RosterPurpose : item.purpose1,
        RoasterSavedChocksOff: item.savedChocksOff,
        RoasterInstructional: item.instructional,
        RoasterRemark: item.remark,
        RoasterAi: item.actual_Instrument,
      }));
        navigation.navigate('CreateLogbook');
      //}
    }
     return (
      <Swipeout {...swipeSettings}>
      <Item
        item={item}
        onPress={() => {item.tag==='uploaded'?selectingEgcaUploadedFlights():selectParams()}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
      </Swipeout>

    );

  }

  const ToOpenButtons = () => {
    setOpenButtons(!openButtons)
  }

  const OpenRosterDateModal = () => {
    setRosterModalVisible(true)
   }

  const PlusNavigation = () => {
    setSelectedId('')
    setParamsLogbook(previousParams => ({
      ...(previousParams || {}),
      childParamList: 'Listvalue',
      fromParams: 'Logbook',
      RoasterId: '',
      RoasterUser_id: '',
      RoasterFlightNo: '',
      RoasterDate: new Date(),
      RoasterDay: '',
      RoasterAi: '',
      RoasterAId: '',
      RoasterAType: '',
      RoasterApproach1: '',
      RoasterApproach2: '',
      RoasterDayLanding: '',
      RoasterDayTO: '',
      RoasterDual_day: '',
      RoasterDual_night: '',
      RoasterFlight: '',
      RoasterFrom: '',
      RoasterFrom_lat: '',
      RoasterFrom_long: '',
      RoasterFullstop: '',
      RoasterIfr_vfr: '',
      RoasterInstructional: '',
      RoasterInstructor: '',
      RoasterLanding: '',
      RoasterNight: '',
      RoasterNightLanding: '',
      RoasterNightTO: '',
      RoasterChocksOff: '',
      RoasterChocksOn: '',
      RoasterP1: '',
      RoasterP1_us_day: '',
      RoasterP1_us_night: '',
      RoasterP2: '',
      RoasterPic_day: '',
      RoasterPic_night: '',
      RoasterStl: '',
      RoasterRC1: '',
      RoasterRC2: '',
      RoasterRC3: '',
      RoasterRC4: '',
      RoasterRoute: '',
      RoasterSic_day: '',
      RoasterSic_night: '',
      RoasterSim_instructional: '',
      RoasterSim_instrument: '',
      RoasterStudent: '',
      RoasterTo: '',
      RoasterTo_lat: '',
      RoasterTo_long: '',
      RoasterTotalTime: '',
      RoasterTouchnGos: '',
      RoasterWaterLanding: '',
      RoasterWaterTO: '',
      RoasterX_country_day: '',
      RoasterX_country_night: '',
      RoasterX_country_day_leg: '',
      RoasterX_country_night_leg: '',
      RoasterSim_type: '',
      RoasterSim_exc: '',
      RoasterPf_time: '',
      RoasterPm_time: '',
      RoasterSF: '',
      RoasterSimLoc: '',
      RoasterP1_ut_day: '',
      RoasterP1_ut_night: '',
      RoasterRemark: '',
      RoasterAutoLanding: '',
      RoasterTakeoff: '',
      Roasterlanding:'',
    }));
    navigation.navigate('CreateLogbook');

  }

  //Sqlite starts

  const searchQuery = (dataToSearch) => {
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    let SearchedData = [];
    let SingleResult = '';
    setSearch(dataToSearch)
    if (selectedIndex === 0) {
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE crewCustom1  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            for (let i = 0; i <= result.rows.length; i++) {
              SingleResult = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                aircraftType: result.rows.item(i).aircraftType,
                from_city: result.rows.item(i).from_city,
                from_lat: result.rows.item(i).from_lat,
                from_long: result.rows.item(i).from_long,
                from: result.rows.item(i).from_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
                p1: result.rows.item(i).p1,
                p2: result.rows.item(i).p2,
                to: result.rows.item(i).to_nameICAO,
                to_lat: result.rows.item(i).to_lat,
                to_long: result.rows.item(i).to_long,
              }
              SearchedData.push(SingleResult);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
          }
        });
      });

    }
    else if (selectedIndex === 1) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE from_city  LIKE "%' + dataToSearch + '%" OR to_city LIKE "%' + dataToSearch + '%" OR from_nameICAO LIKE "%' + dataToSearch + '%" OR to_nameICAO LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            for (let i = 0; i <= result.rows.length; i++) {
              SingleResult = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                aircraftType: result.rows.item(i).aircraftType,
                from_city: result.rows.item(i).from_city,
                from_lat: result.rows.item(i).from_lat,
                from_long: result.rows.item(i).from_long,
                from: result.rows.item(i).from_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
                p1: result.rows.item(i).p1,
                p2: result.rows.item(i).p2,
                to: result.rows.item(i).to_nameICAO,
                to_lat: result.rows.item(i).to_lat,
                to_long: result.rows.item(i).to_long,
              }
              SearchedData.push(SingleResult);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
            
          }
        });
      });
    }
    else if (selectedIndex === 2) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE aircraftReg  LIKE "%' + dataToSearch + '%" OR aircraftType LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            for (let i = 0; i <= result.rows.length; i++) {
              SingleResult = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                aircraftType: result.rows.item(i).aircraftType,
                from_city: result.rows.item(i).from_city,
                from_lat: result.rows.item(i).from_lat,
                from_long: result.rows.item(i).from_long,
                from: result.rows.item(i).from_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
                p1: result.rows.item(i).p1,
                p2: result.rows.item(i).p2,
                to: result.rows.item(i).to_nameICAO,
                to_lat: result.rows.item(i).to_lat,
                to_long: result.rows.item(i).to_long,
              }
              SearchedData.push(SingleResult);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
          }
        });
      });
    }
    else if (selectedIndex === 3) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftReg,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime FROM logbook WHERE date  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            for (let i = 0; i <= result.rows.length; i++) {
              SingleResult = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                aircraftType: result.rows.item(i).aircraftType,
                aircraftReg: result.rows.item(i).aircraftReg,
                from_city: result.rows.item(i).from_city,
                from_lat: result.rows.item(i).from_lat,
                from_long: result.rows.item(i).from_long,
                from: result.rows.item(i).from_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
                p1: result.rows.item(i).p1,
                p2: result.rows.item(i).p2,
                to: result.rows.item(i).to_nameICAO,
                to_lat: result.rows.item(i).to_lat,
                to_long: result.rows.item(i).to_long,
                outTime: result.rows.item(i).outTime,
                inTime: result.rows.item(i).inTime,
              }
              console.log('searched for', SingleResult)
              SearchedData.push(SingleResult);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
          }
        });
      });
    }
    else if (selectedIndex === 4) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime FROM logbook WHERE flight  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            for (let i = 0; i <= result.rows.length; i++) {
              SingleResult = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                aircraftType: result.rows.item(i).aircraftType,
                from_city: result.rows.item(i).from_city,
                from_lat: result.rows.item(i).from_lat,
                from_long: result.rows.item(i).from_long,
                from: result.rows.item(i).from_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
                p1: result.rows.item(i).p1,
                p2: result.rows.item(i).p2,
                to: result.rows.item(i).to_nameICAO,
                to_lat: result.rows.item(i).to_lat,
                to_long: result.rows.item(i).to_long,
              }
              SearchedData.push(SingleResult);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
          }
        });
      });
    }
    else {
      dataDispatcher(LogListData({ data: [] }))
    }
  }

  // React.useEffect(() => {
  //   if(isFocused){
  //     FreeTrial();
  //   }
  // }, [isFocused,subscribe]);

  // const FreeTrial = () => {
  //   if(subscribe===1){
  //     navigation.navigate('subscribe')
  //   }
  //   else{
  //     navigation.navigate('LogBookListing')
  //   }
  // }

 

  const getLogbookData = async () => {
    setLoadmore(true)
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = (getReduxData.data === undefined) ? [] : getReduxData.data;
    let pur = []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT id,tag,serverId,user_id,date,aircraftReg,aircraftType,from_nameICAO,inTime,offTime,onTime,outTime,p1,p2,to_nameICAO,remark,from_lat,from_long,to_lat,to_long,purpose1,distance,sim_type,sim_exercise,pf_time,pm_time,sfi_sfe,simLocation,isSaved,savedChocksOff,instructional from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime DESC LIMIT 20 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          setLoadmore(false)
          return false;
        }
        
        setOffset(offset + 20);
        //if (result.rows.length > 1){
        for (let i = 0; i <= result.rows.length; i++) {
          if (result.rows.length !== 0){

            const chocksOFF =  result.rows.item(i).offTime.split(':')
            if(chocksOFF[0]<10){
              chocksOFF[0] = '0'+chocksOFF[0]
            }
            const getChocksOff = chocksOFF[0].slice(-2)+':'+chocksOFF[1].slice(-2)

            const chocksON = result.rows.item(i).onTime.split(':')
            if(chocksON[0]<10){
              chocksON[0] = '0'+chocksON[0]
            }
            const getChocksOn = chocksON[0].slice(-2)+':'+chocksON[1].slice(-2)

          setModalVisible(true)
          if(result.rows.item(i).aircraftReg!=="SIMU"){
            pur.push(result.rows.item(i).purpose1)
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            serverId: result.rows.item(i).serverId,
            user_id: result.rows.item(i).user_id,
            //flight_no: result.rows.item(i).flight_no,
            date: result.rows.item(i).date,
            //day: result.rows.item(i).day,
            actual_Instrument: result.rows.item(i).actual_Instrument,
            aircraftReg: result.rows.item(i).aircraftReg,
            aircraftType: result.rows.item(i).aircraftType,
            //dayLanding: result.rows.item(i).dayLanding,
            //dual_day: result.rows.item(i).dual_day,
            //dual_night: result.rows.item(i).dual_night,
            //flight: result.rows.item(i).flight,
            from: result.rows.item(i).from_nameICAO,
            //ifr_vfr: result.rows.item(i).ifr_vfr,
            instructional: result.rows.item(i).instructional,
            //instructor: result.rows.item(i).instructor,
            landing: result.rows.item(i).inTime,
            //night: result.rows.item(i).night,
            chocksOffTime: getChocksOff,
            nightLanding: result.rows.item(i).nightLanding,
            chocksOnTime: getChocksOn,
            takeOff: result.rows.item(i).outTime,
            p1: result.rows.item(i).p1,
            //p1_us_day: result.rows.item(i).p1_us_day,
            //p1_us_night: result.rows.item(i).p1_us_night,
            p2: result.rows.item(i).p2,
            //pic_day: result.rows.item(i).pic_day,
            //pic_night: result.rows.item(i).pic_night,
            //stl: result.rows.item(i).stl,
            //route: result.rows.item(i).route,
            //sic_day: result.rows.item(i).sic_day,
            //sic_night: result.rows.item(i).sic_night,
            //sim_instructional: result.rows.item(i).sim_instructional,
            //sim_instrument: result.rows.item(i).sim_instrument,
            //selected_role: result.rows.item(i).selected_role,
            //student: result.rows.item(i).student,
            to: result.rows.item(i).to_nameICAO,
            //totalTime: result.rows.item(i).totalTime,
            //x_country_day: result.rows.item(i).x_country_day,
            //x_country_night: result.rows.item(i).x_country_night,
            //x_country_day_leg: result.rows.item(i).x_country_day_leg,
            //x_country_night_leg: result.rows.item(i).x_country_night_leg,
            //p1_ut_day: result.rows.item(i).p1_ut_day,
            //p1_ut_night: result.rows.item(i).p1_ut_night,
            remark: result.rows.item(i).remark,
            from_lat: result.rows.item(i).from_lat,
            from_long: result.rows.item(i).from_long,
            to_lat: result.rows.item(i).to_lat,
            to_long: result.rows.item(i).to_long,
            purpose1 : result.rows.item(i).purpose1,
            distance: result.rows.item(i).distance,
            isSaved: result.rows.item(i).isSaved,
            savedChocksOff: result.rows.item(i).savedChocksOff,
          });
        }
        else {
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            serverId: result.rows.item(i).serverId,
            user_id: result.rows.item(i).user_id,
            date: result.rows.item(i).date,
            //flight: result.rows.item(i).flight,
            aircraftType: result.rows.item(i).aircraftType,
            aircraftReg: result.rows.item(i).aircraftReg,
            from: result.rows.item(i).from_nameICAO,
            to: result.rows.item(i).to_nameICAO,
            //totalTime: result.rows.item(i).totalTime,
            sim_type: result.rows.item(i).sim_type,
            sim_exercise: result.rows.item(i).sim_type,
            pf_time: result.rows.item(i).pf_time,
            pm_time: result.rows.item(i).pm_time,
            sfi_sfe: result.rows.item(i).sfi_sfe,
            simLocation: result.rows.item(i).simLocation,
            takeOff: result.rows.item(i).outTime,
            landing: result.rows.item(i).inTime,
            p1: "hello",
            isSaved: result.rows.item(i).isSaved,
            savedChocksOff: result.rows.item(i).savedChocksOff,
            remark: result.rows.item(i).remark,
          });
        }
          setLocalLogbookData(temData);
          var arr = temData;
          var clean = arr.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))

          dataDispatcher(LogListData({ data: clean, inProgress: false }))
          //setLoadmore(false)
          setFindTag(result.rows.item(i).tag);
          setRefreshing(false);
          setLoadmore(false)
        }
        else {
          dataDispatcher(LogListData({ data: [], inProgress: false }))
          setRefreshing(false);
          setLoadmore(false)
        }
        
        }
    });
    });
  };

  const getLatestData = async() => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);

    await fetch(Platform.OS==='ios'?BaseUrl + 'getSaveLogbook':BaseUrlAndroid + 'getSaveLogbook', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "user_id": user.id,
            "is_saved": 1,
        })
    }).then(res => res.json())
        .then(resData => {
            console.log('DocData',resData);
            for (let i = 0; i < resData.length; i++) {
              const AircraftReg = resData[i].aircraftReg
              console.log('AircraftReg',AircraftReg)

              const conditonalP1 = resData[i].p1 === 'SELF' ? 'Self' : resData[i].p1 

              const takeoffTime = resData[i].offTime===''?resData[i].outTime : resData[i].offTime;
              const LandingTime = resData[i].onTime===''?resData[i].inTime : resData[i].onTime;

              var d = new Date(resData[i].date);
                let month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
                if(day<10) {day = "0" + day}
                if (month < 10) { month = "0" + month; }
                //console.log('exact month',month)
                const PerfectDate = day+"-"+month+"-"+year

                const orderedDate = year+month+day;

                const nameAircrfat = resData[i].aircraftType === '13122017071818455'  ? 'A-320' : resData[i].aircraftType === '31052021095435455' ? 'A-321': resData[i].aircraftType === '04092020174148455' ? 'A-320' : resData[i].aircraftType

              prePopulateddb.transaction((tx) => {
                tx.executeSql('SELECT * FROM logbook Where user_id = "'+user.id+'" AND isSaved=1', [], (tx, result) => {
                tx.executeSql(
                  'INSERT INTO logbook (tag, user_id, flight_no, date, day,  actual_Instrument, aircraftReg, aircraftType, approach1, approach2, approach3, approach4, approach5, approach6, approach7, approach8, approach9, approach10, crewCustom1, crewCustom2, crewCustom3, crewCustom4, crewCustom5, dayLanding, dayTO, dual_day, dual_night, flight, from_airportID, from_altitude, from_city, from_country, from_dayLightSaving, from_source, from_lat, from_long, from_name, from_nameICAO, from_nameIATA, from_timeZone, from_type, from_dst_status, fullStop, ifr_vfr, instructional, instructor, inTime, landingCustom1, landingCustom2, landingCustom3, landingCustom4, landingCustom5, landingCustom6, landingCustom7, landingCustom8, landingCustom9, landingCustom10, night,nightLanding, nightTO, offTime, onTime, outTime, p1, p1_us_day, p1_us_night, p2, pic_day, pic_night, stl, reliefCrew1, reliefCrew2, reliefCrew3, reliefCrew4, route, sic_day, sic_night, sim_instructional, sim_instrument, selected_role, student, timeCustom1, timeCustom2, timeCustom3, timeCustom4, timeCustom5, timeCustom6, timeCustom7, timeCustom8, timeCustom9, timeCustom10, to_airportID, to_altitude, to_city, to_country, to_dayLightSaving, to_source, to_lat, to_long, to_name, to_nameIATA, to_nameICAO, to_timeZone, to_type, to_dst_status, totalTime, touch_n_gos, waterLanding, waterTO, x_country_day, x_country_night, x_country_day_leg, x_country_night_leg, outTime_LT, offTime_LT, onTime_LT, inTime_LT, sim_type, sim_exercise, pf_time, pm_time, sfi_sfe, simCustom1, simCustom2, simCustom3, simCustom4, simCustom5, simLocation, p1_ut_day, p1_ut_night, remark, autolanding, flight_date, selected_flight_timelog, imported_log, orderedDate,purpose1,isSaved) VALUES ("'+resData[i].tag+'","'+resData[i].user_id+'","'+resData[i].flight_no+'","'+PerfectDate+'","'+resData[i].day+'","'+resData[i].actual_Instrument+'","'+resData[i].aircraftReg+'","'+nameAircrfat+'","'+resData[i].approach1+'","'+resData[i].approach2+'","'+resData[i].approach3+'","'+resData[i].approach4+'","'+resData[i].approach5+'","'+resData[i].approach6+'","'+resData[i].approach7+'","'+resData[i].approach8+'","'+resData[i].approach9+'","'+resData[i].approach10+'","'+resData[i].crewCustom1+'","'+resData[i].crewCustom2+'","'+resData[i].crewCustom3+'","'+resData[i].crewCustom4+'","'+resData[i].crewCustom5+'","'+resData[i].dayLanding+'" , "'+resData[i].dayTO+'" , "'+resData[i].dual_day+'" , "'+resData[i].dual_night+'" , "'+resData[i].flight+'" , "'+resData[i].from_airportID+'" , "'+resData[i].from_altitude+'" , "'+resData[i].from_city+'" , "'+resData[i].from_country+'" , "'+resData[i].from_dayLightSaving+'" , "'+resData[i].from_source+'" , "'+resData[i].from_lat+'" , "'+resData[i].from_long+'" , "'+resData[i].from_name+'" ,"'+resData[i].from_nameICAO+'" , "'+resData[i].from_nameIATA+'" , "'+resData[i].from_timeZone+'" , "'+resData[i].from_type+'" , "'+resData[i].from_dst_status+'" , "'+resData[i].fullStop+'" , "'+resData[i].ifr_vfr+'" , "'+resData[i].instructional+'" , "'+resData[i].instructor+'" , "'+resData[i].inTime+'" , "'+resData[i].landingCustom1+'" , "'+resData[i].landingCustom2+'" , "'+resData[i].landingCustom3+'" , "'+resData[i].landingCustom4+'" , "'+resData[i].landingCustom5+'" , "'+resData[i].landingCustom6+'" , "'+resData[i].landingCustom7+'" , "'+resData[i].landingCustom8+'" , "'+resData[i].landingCustom9+'" , "'+resData[i].landingCustom10+'" , "'+resData[i].night+'" , "'+resData[i].nightLanding+'" , "'+resData[i].nightTO+'" , "'+takeoffTime+'" , "'+LandingTime+'" , "'+resData[i].outTime+'" , "'+conditonalP1+'" , "'+resData[i].p1_us_day+'" , "'+resData[i].p1_us_night+'" , "'+resData[i].p2+'" , "'+resData[i].pic_day+'" , "'+resData[i].pic_night+'" , "'+resData[i].stl+'" , "'+resData[i].reliefCrew1+'" , "'+resData[i].reliefCrew2+'" , "'+resData[i].reliefCrew3+'" , "'+resData[i].reliefCrew4+'" , "'+resData[i].route+'" , "'+resData[i].sic_day+'" , "'+resData[i].sic_night+'" , "'+resData[i].sim_instructional+'" , "'+resData[i].sim_instrument+'" , "'+resData[i].selected_role+'" , "'+resData[i].student+'" , "'+resData[i].timeCustom1+'" , "'+resData[i].timeCustom2+'" , "'+resData[i].timeCustom3+'" , "'+resData[i].timeCustom4+'" , "'+resData[i].timeCustom5+'" , "'+resData[i].timeCustom6+'" , "'+resData[i].timeCustom7+'" , "'+resData[i].timeCustom8+'" , "'+resData[i].timeCustom9+'" , "'+resData[i].timeCustom10+'" , "'+resData[i].to_airportID+'" , "'+resData[i].to_altitude+'" , "'+resData[i].to_city+'" , "'+resData[i].to_country+'" , "'+resData[i].to_dayLightSaving+'" , "'+resData[i].to_source+'" , "'+resData[i].to_lat+'" , "'+resData[i].to_long+'" , "'+resData[i].to_name+'" , "'+resData[i].to_nameIATA+'" , "'+resData[i].to_nameICAO+'" , "'+resData[i].to_timeZone+'" , "'+resData[i].to_type+'" , "'+resData[i].to_dst_status+'" , "'+resData[i].totalTime+'" , "'+resData[i].touch_n_gos+'" , "'+resData[i].waterLanding+'" , "'+resData[i].waterTO+'" , "'+resData[i].x_country_day+'" , "'+resData[i].x_country_night+'" , "'+resData[i].x_country_day_leg+'" , "'+resData[i].x_country_night_leg+'" , "'+resData[i].outTime_LT+'" , "'+resData[i].offTime_LT+'" , "'+resData[i].onTime_LT+'" , "'+resData[i].inTime_LT+'" , "'+resData[i].sim_type+'" , "'+resData[i].sim_exercise+'" , "'+resData[i].pf_hours+'" , "'+resData[i].pm_hours+'" , "'+resData[i].sfi_sfe+'" , "'+resData[i].simCustom1+'" , "'+resData[i].simCustom2+'" , "'+resData[i].simCustom3+'" , "'+resData[i].simCustom4+'" , "'+resData[i].simCustom5+'","'+resData[i].simLocation+'","'+resData[i].p1_ut_day+'","'+resData[i].p1_ut_night+'","'+resData[i].remark+'","'+resData[i].autolanding+'","'+resData[i].flight_date+'","'+resData[i].selected_flight_timelog+'","'+resData[i].imported_log+'","'+orderedDate+'","'+resData[i].timeCustom1+'","'+resData[i].is_saved+'")',
                  );
                  let temData = [];
                  tx.executeSql('SELECT id,tag,user_id,date,aircraftReg,aircraftType,from_nameICAO,inTime,offTime,onTime,outTime,p1,p2,to_nameICAO,remark,from_lat,from_long,to_lat,to_long,purpose1,distance,sim_type,sim_exercise,pf_time,pm_time,sfi_sfe,simLocation,isSaved,savedChocksOff,instructional from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" AND isSaved = 1 ORDER BY orderedDate DESC, onTime DESC', [], (tx, result) => {
                    console.log('e',result.rows.length)
                    if (result.rows.length == 0) {
                      console.log('no data to load')
                      //setLoadmore(false)
                      return false;
                    }
                    
                    //setOffset(offset + 20);
                    //if (result.rows.length > 1){
                    for (let i = 0; i <= result.rows.length; i++) {
                      if (result.rows.length !== 0){
            
                        const chocksOFF =  result.rows.item(i).offTime.split(':')
                        if(chocksOFF[0]<10){
                          chocksOFF[0] = '0'+chocksOFF[0]
                        }
                        const getChocksOff = chocksOFF[0].slice(-2)+':'+chocksOFF[1].slice(-2)
            
                        const chocksON = result.rows.item(i).onTime.split(':')
                        if(chocksON[0]<10){
                          chocksON[0] = '0'+chocksON[0]
                        }
                        const getChocksOn = chocksON[0].slice(-2)+':'+chocksON[1].slice(-2)
            
                      setModalVisible(true)
                      if(result.rows.item(i).aircraftReg!=="SIMU"){
                        pur.push(result.rows.item(i).purpose1)
                      temData.push({
                        id: result.rows.item(i).id,
                        tag: result.rows.item(i).tag,
                        user_id: result.rows.item(i).user_id,
                        //flight_no: result.rows.item(i).flight_no,
                        date: result.rows.item(i).date,
                        //day: result.rows.item(i).day,
                        actual_Instrument: result.rows.item(i).actual_Instrument,
                        aircraftReg: result.rows.item(i).aircraftReg,
                        aircraftType: result.rows.item(i).aircraftType,
                        from: result.rows.item(i).from_nameICAO,
                        instructional: result.rows.item(i).instructional,
                        landing: result.rows.item(i).inTime,
                        chocksOffTime: getChocksOff,
                        nightLanding: result.rows.item(i).nightLanding,
                        chocksOnTime: getChocksOn,
                        takeOff: result.rows.item(i).outTime,
                        p1: result.rows.item(i).p1,
                        p2: result.rows.item(i).p2,
                        to: result.rows.item(i).to_nameICAO,
                        remark: result.rows.item(i).remark,
                        from_lat: result.rows.item(i).from_lat,
                        from_long: result.rows.item(i).from_long,
                        to_lat: result.rows.item(i).to_lat,
                        to_long: result.rows.item(i).to_long,
                        purpose1 : result.rows.item(i).purpose1,
                        distance: result.rows.item(i).distance,
                        isSaved: result.rows.item(i).isSaved,
                        savedChocksOff: result.rows.item(i).savedChocksOff,
                      });
                    }
                    else {
                      temData.push({
                        id: result.rows.item(i).id,
                        tag: result.rows.item(i).tag,
                        user_id: result.rows.item(i).user_id,
                        date: result.rows.item(i).date,
                        aircraftType: result.rows.item(i).aircraftType,
                        aircraftReg: result.rows.item(i).aircraftReg,
                        from: result.rows.item(i).from_nameICAO,
                        to: result.rows.item(i).to_nameICAO,
                        sim_type: result.rows.item(i).sim_type,
                        sim_exercise: result.rows.item(i).sim_type,
                        pf_time: result.rows.item(i).pf_time,
                        pm_time: result.rows.item(i).pm_time,
                        sfi_sfe: result.rows.item(i).sfi_sfe,
                        simLocation: result.rows.item(i).simLocation,
                        takeOff: result.rows.item(i).outTime,
                        landing: result.rows.item(i).inTime,
                        p1: "hello",
                        isSaved: result.rows.item(i).isSaved,
                        savedChocksOff: result.rows.item(i).savedChocksOff,
                        remark: result.rows.item(i).remark,
                      });
                    }
                      setLocalLogbookData(temData);
                      var arr = temData;
                      var clean = arr.filter((arr, index, self) =>
                      index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))
            
                      dataDispatcher(LogListData({ data: clean, inProgress: false }))
                      //setLoadmore(false)
                      //setFindTag(result.rows.item(i).tag);
                      //setRefreshing(false);
                      //setLoadmore(false)
                    }
                    else {
                      dataDispatcher(LogListData({ data: [], inProgress: false }))
                      //setRefreshing(false);
                      //setLoadmore(false)
                    }
                    
                    }
                });
              })
            });
            }
            //setData(resData);
            //dataDispatcher(LogListData({ data: resData, inProgress:false }))
        });
  }

  const onRefresh = React.useCallback(async () => {
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    //setRefreshing(true);
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData =  []
    let pur = []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT id,tag,serverId,user_id,date,aircraftReg,aircraftType,from_nameICAO,inTime,offTime,onTime,outTime,p1,p2,to_nameICAO,remark,from_lat,from_long,to_lat,to_long,purpose1,distance,sim_type,sim_exercise,pf_time,pm_time,sfi_sfe,simLocation,isSaved,savedChocksOff,instructional,pic_day from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime ASC  LIMIT 10 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          //setLoadmore(false)
          return false;
        }
        setOffset(offset + 10);
        for (let i = 0; i <= result.rows.length; i++) {
          if (result.rows.length !== 0){

            const chocksOFF =  result.rows.item(i).offTime.split(':') 
            if(chocksOFF[0]<10){
              chocksOFF[0] = '0'+chocksOFF[0]
            }
            const getChocksOff = chocksOFF[0].slice(-2)+':'+chocksOFF[1].slice(-2)

            const chocksON = result.rows.item(i).onTime.split(':')
            if(chocksON[0]<10){
              chocksON[0] = '0'+chocksON[0]
            }
            const getChocksOn = chocksON[0].slice(-2)+':'+chocksON[1].slice(-2)

          setModalVisible(true)
          if(result.rows.item(i).aircraftReg!=="SIMU"){
           pur.push(result.rows.item(i).purpose1)
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            serverId: result.rows.item(i).serverId,
            user_id: result.rows.item(i).user_id,
            //flight_no: result.rows.item(i).flight_no,
            date: result.rows.item(i).date,
            //day: result.rows.item(i).day,
            actual_Instrument: result.rows.item(i).actual_Instrument,
            aircraftReg: result.rows.item(i).aircraftReg,
            aircraftType: result.rows.item(i).aircraftType,
            //dayLanding: result.rows.item(i).dayLanding,
            //dual_day: result.rows.item(i).dual_day,
            //dual_night: result.rows.item(i).dual_night,
            //flight: result.rows.item(i).flight,
            from: result.rows.item(i).from_nameICAO,
            //ifr_vfr: result.rows.item(i).ifr_vfr,
            instructional: result.rows.item(i).instructional,
            //instructor: result.rows.item(i).instructor,
            landing: result.rows.item(i).inTime,
            //night: result.rows.item(i).night,
            chocksOffTime: getChocksOff,
            //nightLanding: result.rows.item(i).nightLanding,
            chocksOnTime: getChocksOn,
            takeOff: result.rows.item(i).outTime,
            p1: result.rows.item(i).p1,
            //p1_us_day: result.rows.item(i).p1_us_day,
            //p1_us_night: result.rows.item(i).p1_us_night,
            p2: result.rows.item(i).p2,
            pic_day: result.rows.item(i).pic_day,
            //pic_night: result.rows.item(i).pic_night,
            //stl: result.rows.item(i).stl,
            //route: result.rows.item(i).route,
            //sic_day: result.rows.item(i).sic_day,
            //sic_night: result.rows.item(i).sic_night,
            //sim_instructional: result.rows.item(i).sim_instructional,
            //sim_instrument: result.rows.item(i).sim_instrument,
            //selected_role: result.rows.item(i).selected_role,
            //student: result.rows.item(i).student,
            to: result.rows.item(i).to_nameICAO,
            //totalTime: result.rows.item(i).totalTime,
            //x_country_day: result.rows.item(i).x_country_day,
            //x_country_night: result.rows.item(i).x_country_night,
            //x_country_day_leg: result.rows.item(i).x_country_day_leg,
            //x_country_night_leg: result.rows.item(i).x_country_night_leg,
            //p1_ut_day: result.rows.item(i).p1_ut_day,
            //p1_ut_night: result.rows.item(i).p1_ut_night,
            remark: result.rows.item(i).remark,
            from_lat: result.rows.item(i).from_lat,
            from_long: result.rows.item(i).from_long,
            to_lat: result.rows.item(i).to_lat,
            to_long: result.rows.item(i).to_long,
            purpose1 : result.rows.item(i).purpose1,
            distance: result.rows.item(i).distance,
            isSaved: result.rows.item(i).isSaved,
            savedChocksOff: result.rows.item(i).savedChocksOff,
          });
        }
        else{
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            serverId: result.rows.item(i).serverId,
            user_id: result.rows.item(i).user_id,
            date: result.rows.item(i).date,
            //flight: result.rows.item(i).flight,
            aircraftType: result.rows.item(i).aircraftType,
            aircraftReg: result.rows.item(i).aircraftReg,
            from: result.rows.item(i).from_nameICAO,
            to: result.rows.item(i).to_nameICAO,
            totalTime: result.rows.item(i).totalTime,
            takeOff: result.rows.item(i).outTime,
            sim_type: result.rows.item(i).sim_type,
            sim_exercise: result.rows.item(i).sim_exercise,
            pf_time: result.rows.item(i).pf_time,
            pm_time: result.rows.item(i).pm_time,
            sfi_sfe: result.rows.item(i).sfi_sfe,
            simLocation: result.rows.item(i).simLocation,
            landing: result.rows.item(i).inTime,
            p1: "hello",
            isSaved: result.rows.item(i).isSaved,
            savedChocksOff: result.rows.item(i).savedChocksOff,
            remark: result.rows.item(i).remark,
            
          })
        }
          //console.log('tagssss',result.rows.item(i).tag)
          setLocalLogbookData(temData);
          var arr = temData;
          var clean = arr.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))
          dataDispatcher(LogListData({ data: clean, inProgress: false }))

          setFindTag(result.rows.item(i).tag);
          setRefreshing(false);
        }
        else {
          dataDispatcher(LogListData({ data: [], inProgress: false }))
          setRefreshing(false);
        }
        }
    });
    });
  }, [getReduxData]);

  const getReduxData = useSelector(state => state.logList.data);
  //console.log('reduxData',getReduxData.data)

  React.useEffect(() => {
    if(isFocused){
      // if(subscribe==='0'){
      //   navigation.navigate('subscribe')
      // }
      // else{
      getLatestData();
      onRefresh();
      //}
    }
  }, [isFocused]);

//Sqlite ends

const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  const DeleteALLRosterList = () => {
    dataDispatcher(LogListData({ data: [] }))
    prePopulateddb.transaction(tx => {
      tx.executeSql(
        'DELETE FROM logbook WHERE tag = "roster"', [], (tx, Delresult) => {
          SELECTAfterDel()
        }
      );
    });
  }

  const SELECTAfterDel = async () => {
    onRefresh()
  }

  const UpdateAllRoster = () => {
    dataDispatcher(LogListData({ data: [] }))
    prePopulateddb.transaction(tx => {
      tx.executeSql(
        'UPDATE logbook set tag="manual" WHERE tag = "roster"', [], (tx, Delresult) => {
          SELECTAfterAccept(true)
        }
      );
    });
  }

  const SELECTAfterAccept = async (AcceptRoster = false) => {
    onRefresh();
  }
  
 const getFlyingReduxData = useSelector(state => state.FlyingTime.totalFlyingHours);
  const TotalFlyingHours = getFlyingReduxData.totalFlyingHours

  const getTotalTypeReduxData = useSelector(state => state.tt.totalType);


  const renderFooter = () => {
    let myArray = []
    for (var i = 0; i < getReduxData.data.length; ++i) {
      var json = getReduxData.data[i];
      for (var prop in json) {
        myArray.push(json[prop])
        setCheckTag(myArray.includes('roster'))
      }
    }
    if (getReduxProgressData.ProgressValue === undefined) {
      setDownloadModalVisible(true)
    }
    else {
      setDownloadModalVisible(false)
    }
  };
  React.useEffect(() => {
    if (getReduxData.data&&isFocused) {
      renderFooter()
    }
  }, [getReduxData.data,isFocused]);

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:theme.backgroundColor}]}>

      <View style={LogbookListing.header}>
        <Text style={LogbookListing.aircrafts}>Logbook Listing</Text>
      </View>

      <View style={{ backgroundColor:dark?'#000':'#F3F3F3', padding: 10, flexDirection: 'row' }}>
        <View style={(focused) ? LogbookListing.searchbar2 : LogbookListing.searchbar}>
          <MaterialCommunityIcons name="magnify" color={'#000'} size={25} style={{ padding: 6 }} />
          <TextInput
            onFocus={onFocusChange}
            placeholder='Search for Logs'
            placeholderTextColor="#D0D0D0"
            value={search}
            onChangeText={(inputText) => searchQuery(inputText)}
            style={{ marginTop: -7, fontSize: 15, width: '100%', lineHeight: 25 }}
          />
        </View>
        {focused ? <Text style= {dark?LogbookListing.DarkcancelButton:LogbookListing.cancelButton} onPress={onFocusCancelled}>Cancel</Text> : null}
      </View>
      {focused ? <SegmentedControlTab
        values={["Crew", "Place", "Aircraft", "Date", "Flight"]}
        selectedIndex={selectedIndex}
        onTabPress={(index) => handleIndexChange(index)}
        tabsContainerStyle={{padding:10}}
        tabStyle={{borderColor:'#256173'}}
        tabTextStyle={{color:'#256173'}}
        activeTabStyle={{backgroundColor:'#256173'}}
      /> : null}

      {getReduxData.inProgress === undefined?
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Logs are Downloading!!</Text>
                <ActivityIndicator color={'#fff'} />
                {getReduxProgressData.ProgressValue !== undefined ? <Text style={{ color: '#fff' }}>{ProgressBar1}</Text> : null}
              </View>
            </View>
          </Modal>
        </View>
        :
        <FlatList
          style={{ width: '100%', marginBottom: 150 }}
          data={getReduxData.data} // From Roaster data
          renderItem={renderItem}
          keyExtractor={(_, index) => { return index.toString() }}
          numColumns={1}
          onEndReached={()=>{search !== ''? null:getLogbookData();console.log('called')}}
          onEndReachedThreshold={0.8}
          //initialNumToRender={100}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={getLatestData}
          //   />
          // }
        />
      }
      {getReduxProgressData.ProgressValue!== undefined? 
      <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={downloadmodalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Logs are Downloading!!</Text>
                <ActivityIndicator color={'#fff'} />
                {getReduxProgressData.ProgressValue !== undefined ? <Text style={{ color: '#fff' }}>{ProgressBar1}</Text> : null}
              </View>
            </View>
          </Modal>
        </View>  
      :null}

          <Modal
            animationType="fade"
            transparent={true}
            visible={RostermodalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setRosterModalVisible(!RostermodalVisible);
            }}
            >
            <View style={styles.RostercenteredView}>
            <View style={styles.modalView1}>
            <View style={{backgroundColor:'#fff',width:'100%',borderRadius: 10}}>
                <View style={{paddingVertical:10, alignItems: 'center'}}>
                    <MaterialCommunityIcons name="close-circle" color={'#000'} size={20} style={{paddingLeft:300}} onPress={()=>setRosterModalVisible(false)}/>
                    <MaterialCommunityIcons name="check-circle-outline" color={'#000'} size={50} style={{}}/>
                    <Text style={styles.modalText1}>Roster Import</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', paddingTop:10}}>
            <Text style={{paddingRight:120}}>From</Text>
            <Text>To</Text>
            </View>
              <View style={{flexDirection:'row',padding:10}}>
              <DatePicker
                    //style={styles.datePickerStyle}
                    date={fromDate} // Initial date from state
                    mode="date" // The enum of date, datetime and time
                    placeholder="From"
                    placeholderTextColor = "#266173"
                    format= "DD-MM-YYYY"
                    //minDate="01-01-2016"
                    //maxDate="01-01-2019"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    suffixIcon={null}
                    customStyles={{
                        dateInput: {
                        borderWidth:0.2,
                        borderRadius: 15,
                        borderColor: '#EFEFEF',
                        width: '100%',
                        backgroundColor: '#fff',
                        },
                        dateIcon: {
                        width:0,
                        height:0,
                        },
                    }}
                    onDateChange={(fromDate) => {
                        setFromDate(fromDate);
                    }}
                    />
                    <DatePicker
                    //style={styles.datePickerStyle}
                    date={toDate} // Initial date from state
                    mode="date" // The enum of date, datetime and time
                    placeholder="To"
                    placeholderTextColor = "#266173"
                    format = "DD-MM-YYYY" 
                    //minDate="01-01-2016"
                    //maxDate="01-01-2019"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    suffixIcon={null}
                    customStyles={{
                        dateInput: {
                        borderWidth:0.2,
                        borderRadius: 15,
                        borderColor: '#EFEFEF',
                        width: '100%',
                        backgroundColor: '#fff'
                        },
                        dateIcon: {
                        width:0,
                        height:0,
                        },
                    }}
                    onDateChange={(toDate) => {
                        setToDate(toDate);
                    }}
                    />
                    </View>
                {dataFetched === true ?
                <View>
                    <ProgressBar progress={progressValue} color={'#256173'} style={{width:200, marginTop:15}} visible={showProgress}/>
                </View>: 
                    null}
              
              <View style={{flexDirection:'row', padding:10}}>
              <TouchableOpacity
              style={[styles.Modalbutton, styles.buttonClose]}
              onPress={Roaster}
              >
              <Text style={{color: '#fff'}}>Import Log Data</Text>
              </TouchableOpacity>
              </View>

              </View>
              </View>
          </Modal>

      <Draggable
        debug x={300} y={450} z={5} renderColor={'#256173'} renderSize={70} isCircle={true}
        onShortPressRelease={() => ToOpenButtons()}
      />
      {openButtons===true?<Draggable
        debug x={300} y={370} z={5} renderColor={'#256173'} renderSize={60} isCircle={false}
        onShortPressRelease={() => PlusNavigation()} renderText='New Flight'
      />:null}
      {openButtons===true?<Draggable
      debug x={310} y={540} z={5} renderColor={'#256173'} renderSize={60} isCircle={false}
      onShortPressRelease={() => {navigation.navigate('Docs');setEgcaModalOpen(true)}} renderText='EGCA Upload'
      />:null}
      {openButtons===true?<Draggable
        debug x={230} y={460} z={5} renderColor={'#256173'} renderSize={60} isCircle={false}
        onShortPressRelease={() => OpenRosterDateModal()} renderText='Roster Import'
      />:null}

      <View style={dark?LogbookListing.DarkbottomView:LogbookListing.bottomView}>
      {loadmore==true?<ActivityIndicator color={dark?'#fff':'#000'}/>:null}
        {checkTag === true ?
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
            <TouchableOpacity style={{ backgroundColor: '#256173', paddingHorizontal: 8, paddingVertical: 2 }} onPress={UpdateAllRoster}>
              <Text style={{ color: '#fff' }}>Accept all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { DeleteALLRosterList() }} style={{ backgroundColor: '#256173', paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: '#fff' }}>Delete all</Text>
            </TouchableOpacity>
          </View> : null
        }
        {getReduxProgressData.ProgressValue !== undefined? <Text>Downloading logs : {ProgressBar1}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{color:dark?'#fff':'#000'}}> TOTAL ON TYPE-</Text>
          <View style={{ backgroundColor: '#256173', paddingHorizontal: 8, paddingVertical: 2 }}>
            {getTotalTypeReduxData.totalType===undefined ? <Text style={{ color: '#fff' }}>0:00</Text> : <Text style={{ color: '#fff' }}>{getTotalTypeReduxData.totalType}</Text>}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
          <Text style={{color:dark?'#fff':'#000'}}> TOTAL FLYING HOURS-</Text>
          <View style={{ backgroundColor: '#256173', paddingHorizontal: 8, paddingVertical: 2 }}>
          {getFlyingReduxData.totalFlyingHours!== undefined?<Text style={{color:'#fff'}}>{TotalFlyingHours}</Text>:<Text style={{color:'#fff'}}>{totalFlyingHours}</Text>}
          </View>
        </View>
        
      </View>

    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spinnerView: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF88",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalView1:{
    marginLeft: '5%',
        backgroundColor: "#EFEFEF",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        position: 'absolute',
        bottom: '1%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#fff',
  },
  modalText1: {
    textAlign: "center", 
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
  },
  RostercenteredView:{
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 400,
    //padding:100
  },
  Modalbutton:{
    backgroundColor: '#256173',
      padding: 5,
      marginTop: 20,
      width: Dimensions.get('window').width*0.3,
      borderRadius:10,
      alignItems:'center',
      
  },
});

//make this component available to the app
export default LogBookListing;
