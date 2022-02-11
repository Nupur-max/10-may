//import liraries
import React, { Component } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet,RefreshControl, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions, Modal,SafeAreaView } from 'react-native';
import { LogbookListing } from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LogBookList } from '../../components/dummyLogBookListing';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../../components/colors';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../../params-context';
import { ProgressBar } from 'react-native-paper';
import * as Progress from 'react-native-progress';

import { BaseUrl } from '../../components/url.json';
import { useDispatch, useSelector } from 'react-redux';
import { LogListData } from '../../store/actions/loglistAction';
import { FlyingData } from '../../store/actions/flyingAction'
import { Divider } from 'react-native-paper';
import { ThemeContext } from '../../theme-context';
import SegmentedControlTab from "react-native-segmented-control-tab";
import NetInfo from "@react-native-community/netinfo";

import SQLite from 'react-native-sqlite-storage';

import Draggable from 'react-native-draggable';
import { Rect } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

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

NetInfo.addEventListener(networkState => {
  console.log("Connection type - ", networkState.type);
  console.log("Is connected? - ", networkState.isConnected);

  if (networkState.isConnected === false) {
    //alert ("Couldn't be able to sync data from server cause of non availability of network")
  }
});

// create a component
const LogBookListing = ({ navigation }) => {

  const isFocused = useIsFocused();

  const dataDispatcher = useDispatch();
  const dataSelector = useSelector(state => state.logList.data);
  const { dark, theme, toggle } = React.useContext(ThemeContext);

  const getReduxBACKUPData = useSelector(state => state.backup.BackupTime);
  //console.log('backupTime', getReduxBACKUPData.BackupTime);

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

  const [done, setDone] = React.useState(false)

  const [refreshing,setRefreshing] = React.useState(false)


  const [selectedId, setSelectedId] = React.useState('')
  const [from, setFrom] = React.useState('')
  const [to, setTo] = React.useState('')
  const [fromLat1, setFromLat] = React.useState('')
  const [fromLong1, setFromLong] = React.useState('')
  const [toLat1, setToLat] = React.useState('')
  const [toLong1, setToLong] = React.useState('')
  const [givenDate, setGivenDate] = React.useState(new Date())
  const [chocksOffTime1, setChocksOffTime] = React.useState('')
  const [chocksOnTime1, setChocksOnTime] = React.useState('')
  const [focused, setFocused] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [loadmore, setLoadmore] = React.useState(true);
  const [findTag, setFindTag] = React.useState('')
  const [totalFlyingHours, setTotalFlyingHours] = React.useState('')
  const [localData, setLocalData] = React.useState(null)
  const [totalLogs,setTotalLogs] = React.useState('')

  const onFocusChange = () => setFocused(true);
  const onFocusCancelled = () => setFocused(false);

  const [date, setDate] = React.useState('')
  const [logbookData, setlogbookData] = React.useState([]);

  const [, setParamsLogbook] = React.useContext(ParamsContext);

  //TocheckIf available imp fields
  const [getDate, setGetDate] = React.useState('')
  const [getAircrfat, setGetAircraft] = React.useState('')
  const [getAircraftId, setGetAircraftId] = React.useState('')
  const [getFrom, setGetFrom] = React.useState('')
  const [getTo, setGetTo] = React.useState('')
  const [getChocksOff, setGetChocksOff] = React.useState('')
  const [getChocksOn, setGetChocksOn] = React.useState('')
  const [getP1, setGetP1] = React.useState('')


  React.useEffect(() => {
    if(isFocused){
  GetUserDetails();
    }
  //console.log('Tarun')
  }, [isFocused]);

  const GetUserDetails = async () => {
    //console.log('hello')
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = [];
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT reg_date,roster_id,Total_flying_hours,rosterLength FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available '); 
          console.log('result', result)
        }
        else {
          console.log('error')
        }
        for (let i = 0; i <= result.rows.length; i++) {
          //console.log('name:', result.rows.item(i).airline_name, 'loginlink: ', result.rows.item(i).loginUrl)
          temData.push({
            user_id: result.rows.item(i).user_id,
            reg_date: result.rows.item(i).reg_date,
            roster_id: result.rows.item(i).roster_id,
            Total_flying_hours: result.rows.item(i).Total_flying_hours,
            rosterLength : result.rows.item(i).rosterLength,
          });
          //console.log('user Data', temData);
          setReg_date(result.rows.item(i).reg_date)
          setRosterId(result.rows.item(i).roster_id)
          //console.log('rosterlength', result.rows.item(i).rosterLength)
          setRosterLength(result.rows.item(i).rosterLength)
          setTotalFlyingHours(result.rows.item(i).Total_flying_hours)
         }
        //console.log('rosterid', rosterId)
        });
    });
  }

  const subscription = () => {
    const subscribe_date = new Date();
    const after15Days = subscribe_date.setDate(subscribe_date.getDate() + 15);
    console.log('aftre 15 days', after15Days)
  }



  //console.log('roasted data', getReduxData.data)
  //console.log('data', logbookData)

  // roster data

  // local data

  const getReduxProgressData = useSelector(state => state.progressBar.ProgressValue);
  //console.log('progressData', getReduxProgressData.ProgressValue+'/'+getReduxProgressData.totalvalue)
  const ProgressBar = getReduxProgressData.ProgressValue + '/' + getReduxProgressData.totalvalue

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[LogbookListing.item]}>
      <ScrollView style={dark?[LogbookListing.Darklisting,backgroundColor]:[LogbookListing.listing, backgroundColor]}>
        {/* <View>
            <Text>{item.date}</Text>
            <Text style={{fontWeight:'bold'}}>{item.from_city}-{item.to_city}  {item.offTime}-{item.onTime} ({item.totalTime})</Text>
            </View> */}
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={dark?{color:'#fff',fontFamily: 'WorkSans-Bold', fontSize: 15}:{ fontFamily: 'WorkSans-Bold', fontSize: 15 }}>{item.date} </Text>
            {/* <Text style={{fontFamily:'WorkSans-Bold', fontSize:15}}>{item.aircraftType} </Text> */}
            {item.tag === 'manual' ?
              <MaterialCommunityIcons name="lock-open-variant" color={dark?'#fff':'#000'} size={20} style={{}} /> :
              item.tag === 'server' ?
                <MaterialCommunityIcons name="lock-open-variant" color={dark?'#fff':'#000'} size={20} style={{}} /> :
                item.tag === 'uploaded' ? <MaterialCommunityIcons name="lock" color={dark?'#fff':'#000'} size={20} style={{}} /> :
                null
            }
          </View>
          <Divider/>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={dark?{color:'#fff', fontWeight: 'bold', paddingTop: 10 }:{ fontWeight: 'bold', paddingTop: 10 }}>{item.from}</Text>
            <MaterialCommunityIcons name="airplane-takeoff" color={dark?'#fff':'#000'} size={30} style={{ paddingHorizontal: 10, paddingTop: 10 }} />
            <Text style={dark?{color:'#fff',fontWeight: 'bold', paddingTop: 10}:{ fontWeight: 'bold', paddingTop: 10 }}>{item.to}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {item.aircraftReg === 'SIMU' ? <Text style={{color:dark?'#fff':'#000'}}>{item.takeOff}</Text> : <Text style={{color:dark?'#fff':'#000'}}>{item.chocksOffTime}</Text>}
            {item.aircraftReg === 'SIMU' ? <Text style={dark?{color:'#fff',paddingLeft: 28}:{ paddingLeft: 28 }}>{item.landing}</Text> : <Text style={dark?{color:'#fff',paddingLeft: 28}:{ paddingLeft: 28 }}>{item.chocksOnTime}</Text>}
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );



  const renderItem = ({ item }) => {

    const backgroundColor = item.tag === 'manual' || item.tag === 'server' ? dark?"#000":"#fff" : item.tag === 'roster' ? "#708090" : item.id === selectedId ? "grey" : '';
  
    const color = item.id === selectedId ? 'white' : 'black';
    
    const changDateFormat = (date) => {
      //console.log('date formate length :' + date.length)
      if (date.length < 20) {
        let str = date;
        const myArr = str.split("-");
        date = myArr[2] + '-' + myArr[1] + '-' + myArr[0];
        //console.log('new format '+date)
        return date;
      } else {
        //console.log('same format ' +date)
        return date;
      }
    }

    const selectParams = () => {
      setSelectedId(item.id)
      // setFrom(item.from)
      // setTo(item.to)
      // setFromLat(item.from_lat)
      // setFromLong(item.from_long)
      // setToLat(item.to_lat)
      // setToLong(item.to_long)
      // setGivenDate(item.date)
      // setChocksOffTime(item.chocksßOffTime)
      // setChocksOnTime(item.chocksOnTime)
      // if(selectedId !== '')
      // {
      setParamsLogbook(previousParams => ({
        ...(previousParams || {}),
        childParamList: 'Listvalue',
        fromParams: 'Logbook',
        RoasterId: item.id,
        //RoasterUser_id : item.user_id,
        //RoasterFlightNo : item.flight_no,
        RoasterDate: changDateFormat(item.date),
        //RoasterDay : item.day,
        //RoasterAi : item.actual_Instrument,
        //RoasterAId : item.aircraftReg,
        RoasterAType: item.aircraftType,
        //RoasterApproach1 : item.approach1,
        //RoasterApproach2 : item.approach2,
        //RoasterDayLanding : item.dayLanding,
        //RoasterDayTO : item.dayTO,
        //RoasterDual_day : item.dual_day,
        //RoasterDual_night : item.dual_night,
        //RoasterFlight : item.flight,
        RoasterFrom: item.from,
        RoasterFrom_lat: item.from_lat,
        RoasterFrom_long: item.from_long,
        //RoasterFullstop : item.fullStop,
        //RoasterIfr_vfr : item.ifr_vfr,
        //RoasterInstructional : item.instructional,
        //RoasterInstructor : item.instructor,
        //RoasterLanding : item.landing,
        //RoasterNight : item.night,
        // RoasterNightLanding : item.nightLanding,
        //RoasterNightTO : item.nightTO,
        RoasterChocksOff: item.chocksOffTime,
        RoasterChocksOn: item.chocksOnTime,
        RoasterP1: item.p1,
        //RoasterP1_us_day : item.p1_us_day,
        //RoasterP1_us_night : item.p1_us_night,
        RoasterP2: item.p2,
        //RoasterPic_day : item.pic_day,
        //RoasterPic_night : item.pic_night,
        //RoasterStl : item.stl,
        //RoasterRC1 : item.RC1,
        //RoasterRC2 : item.RC2,
        //RoasterRC3 : item.RC3,
        //RoasterRC4 : item.RC4,
        //RoasterRoute : item.route,
        //RoasterSic_day : item.sic_day,
        //RoasterSic_night : item.sic_night,
        //RoasterSim_instructional : item.sim_instructional,
        //RoasterSim_instrument : item.sim_instrument,
        //RoasterStudent : item.student,
        RoasterTo: item.to,
        RoasterTo_lat: item.to_lat,
        RoasterTo_long: item.to_long,
        //RoasterTotalTime : item.totalTime,
        //RoasterTouchnGos : item.touch_n_gos,
        //RoasterWaterLanding : item.waterLanding,
        //RoasterWaterTO : item.waterTO,
        //RoasterX_country_day : item.x_country_day,
        //RoasterX_country_night : item.x_country_night,
        //RoasterX_country_day_leg : item.x_country_day_leg,
        //RoasterX_country_night_leg : item.x_country_night_leg,
        //RoasterSim_type : item.sim_type,
        //RoasterSim_exercise : item.sim_exercise,
        //RoasterPfTime : item.pf_time,
        //RoasterPmTime : item.pm_time,
        //RoasterSfi_sfe : item.sfi_sfe,
        //RoasterSimLocation : item.simLocation,
        //RoasterP1_ut_day : item.p1_ut_day,
        //RoasterP1_ut_night : item.p1_ut_night,
        //RoasterRemark : item.remark,
        //RoasterAutoLanding : item.autolanding,
      }));
      console.log('id', item.id);

      navigation.navigate('CreateLogbook');
      //}
    }

    return (
      <Item
        item={item}
        onPress={() => { selectParams() }}
        // backgroundColor={item.tag === 'roster' ? backgroundColor:backgroundColor1}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />

    );

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
      RoasterSim_exercise: '',
      RoasterPfTime: '',
      RoasterPmTime: '',
      RoasterSfi_sfe: '',
      RoasterSimLocation: '',
      RoasterP1_ut_day: '',
      RoasterP1_ut_night: '',
      RoasterRemark: '',
      RoasterAutoLanding: '',
    }));
    //console.log('id', item.id);
    navigation.navigate('CreateLogbook');

  }

  //Sqlite starts

  const searchQuery = (dataToSearch) => {
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    let SearchedData = [];
    let SingleResult = '';
    setSearch(dataToSearch)
    //console.log('Searching for ', dataToSearch);
    if (selectedIndex === 0) {
      //console.log('hello')
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE crewCustom1  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            //alert('data available ');
            //console.log('Searched result raw: ', result)
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
              // console.log('single', result.rows.item(i).outTime,)
              //console.log(' Searched data', SearchedData);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
            //setFilteredData(SearchedData);
            //console.log('Searched Result array: ', SearchedData)
          }
        });
      });

    }
    else if (selectedIndex === 1) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE from_city  LIKE "%' + dataToSearch + '%" OR to_city LIKE "%' + dataToSearch + '%" OR from_nameICAO LIKE "%' + dataToSearch + '%" OR to_nameICAO LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            //alert('data available ');
            //console.log('Searched result raw: ', result)
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
              //console.log('single', SingleResult)
              //console.log(' Searched data', SearchedData);
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
            //alert('data available ');
            //console.log('Searched result raw: ', result)
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
              //console.log('single', SingleResult)
              //console.log(' Searched data', SearchedData);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
            //setFilteredData(SearchedData);
            //console.log('Searched Result array: ', SearchedData)
          }
        });
      });
    }
    else if (selectedIndex === 3) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime FROM logbook WHERE date  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            //alert('data available ');
            //console.log('Searched result raw: ', result)
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
                outTime: result.rows.item(i).outTime,
                inTime: result.rows.item(i).inTime,
              }
              SearchedData.push(SingleResult);
              //console.log('single', SingleResult)
              //console.log(' Searched data', SearchedData);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
            //setFilteredData(SearchedData);
            //console.log('Searched Result array: ', SearchedData)
          }
        });
      });
    }
    else if (selectedIndex === 4) {
      dataDispatcher(LogListData({ data: [], inProgress: false }))
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime FROM logbook WHERE flight  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
          if (result.rows.length > 0) {
            //alert('data available ');
            //console.log('Searched result raw: ', result)
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
              //console.log('single', SingleResult)
              //console.log(' Searched data', SearchedData);
              dataDispatcher(LogListData({ data: SearchedData, inProgress: false }))
            }
            //setFilteredData(SearchedData);
            //console.log('Searched Result array: ', SearchedData)
          }
        });
      });
    }
    else {
      dataDispatcher(LogListData({ data: [] }))
      //console.log('No Data found')
    }
  }
  //console.log("INDEXXXXX", selectedIndex)



  

  // React.useEffect(() => {
  //   console.log(modalVisible)
  //   if(modalVisible===false){
  //   Total();
  //   }
  // }, [modalVisible]);

  const testfunc = () => {
    console.log('reached end')
  }

  React.useEffect(() => {
    if(isFocused){
    onRefresh();
  }
  }, [isFocused]);

  const test = async () => {
    console.log('GHGHHM')
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let testtemData = []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * from logbook WHERE user_id = "' + user.id + '" AND date = "02-02-2022"', [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          //dataDispatcher(LogListData({ data: [], inProgress: false }))
          setLoadmore(false)
          return false;
        }
        setOffset(offset + 10);
        console.log('leng',result.rows.length)
        //return;
        //if (result.rows.length > 1){
        for (let i = 0; i <= result.rows.length; i++) {
          if (result.rows.length !== 0){
          //setModalVisible(true)
          testtemData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            date: result.rows.item(i).date,
            //aircraftType: result.rows.item(i).aircraftType,
            //from_lat: result.rows.item(i).from_lat,
            //from_long: result.rows.item(i).from_long,
            //from: result.rows.item(i).from_nameICAO,
            chocksOffTime: result.rows.item(i).offTime,
            chocksOnTime: result.rows.item(i).onTime,
            //p1: result.rows.item(i).p1,
            //p2: result.rows.item(i).p2,
            //to: result.rows.item(i).to_nameICAO,
            // to_lat: result.rows.item(i).to_lat,
            // to_long: result.rows.item(i).to_long,
            // totalTime: result.rows.item(i).totalTime,
            // orderedDate: result.rows.item(i).orderedDate,

          });
          //console.log('checkdata', temData);
          //setLocalLogbookData(temData);
          // var arr = temData;
          // var clean = arr.filter((arr, index, self) =>
          //index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))

          console.log('test data',testtemData);
          //dataDispatcher(LogListData({ data: clean, inProgress: false }))
          
        }
        else {
          console.log('no data to show')
          dataDispatcher(LogListData({ data: [], inProgress: false }))
          setRefreshing(false);
        }
        }
    });
    });
  }

  const getLogbookData = async () => {
    //console.log('First')
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = (getReduxData.data === undefined) ? [] : getReduxData.data;
    //let temData =  []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC,onTime DESC LIMIT 10 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          //dataDispatcher(LogListData({ data: [], inProgress: false }))
          setLoadmore(false)
          return false;
        }
        setOffset(offset + 10);
        //if (result.rows.length > 1){
        for (let i = 0; i <= result.rows.length; i++) {
          if (result.rows.length !== 0){
          setModalVisible(true)
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            user_id: result.rows.item(i).user_id,
            flight_no: result.rows.item(i).flight_no,
            date: result.rows.item(i).date,
            day: result.rows.item(i).day,
            actual_Instrument: result.rows.item(i).actual_Instrument,
            aircraftReg: result.rows.item(i).aircraftReg,
            aircraftType: result.rows.item(i).aircraftType,
            dayLanding: result.rows.item(i).dayLanding,
            dual_day: result.rows.item(i).dual_day,
            dual_night: result.rows.item(i).dual_night,
            flight: result.rows.item(i).flight,
            from: result.rows.item(i).from_nameICAO,
            ifr_vfr: result.rows.item(i).ifr_vfr,
            instructional: result.rows.item(i).instructional,
            instructor: result.rows.item(i).instructor,
            landing: result.rows.item(i).inTime,
            night: result.rows.item(i).night,
            chocksOffTime: result.rows.item(i).offTime,
            nightLanding: result.rows.item(i).nightLanding,
            chocksOnTime: result.rows.item(i).onTime,
            takeOff: result.rows.item(i).outTime,
            p1: result.rows.item(i).p1,
            p1_us_day: result.rows.item(i).p1_us_day,
            p1_us_night: result.rows.item(i).p1_us_night,
            p2: result.rows.item(i).p2,
            pic_day: result.rows.item(i).pic_day,
            pic_night: result.rows.item(i).pic_night,
            stl: result.rows.item(i).stl,
            route: result.rows.item(i).route,
            sic_day: result.rows.item(i).sic_day,
            sic_night: result.rows.item(i).sic_night,
            sim_instructional: result.rows.item(i).sim_instructional,
            sim_instrument: result.rows.item(i).sim_instrument,
            selected_role: result.rows.item(i).selected_role,
            student: result.rows.item(i).student,
            to: result.rows.item(i).to_nameICAO,
            totalTime: result.rows.item(i).totalTime,
            x_country_day: result.rows.item(i).x_country_day,
            x_country_night: result.rows.item(i).x_country_night,
            x_country_day_leg: result.rows.item(i).x_country_day_leg,
            x_country_night_leg: result.rows.item(i).x_country_night_leg,
            p1_ut_day: result.rows.item(i).p1_ut_day,
            p1_ut_night: result.rows.item(i).p1_ut_night,
            remark: result.rows.item(i).remark,
            from_lat: result.rows.item(i).from_lat,
            from_long: result.rows.item(i).from_long,
            to_lat: result.rows.item(i).to_lat,
            to_long: result.rows.item(i).to_long,
          });
          //console.log('checkdata', temData[0]);
          setLocalLogbookData(temData);
          var arr = temData;
          var clean = arr.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))

          //console.log('imp-data',clean[0]);
          dataDispatcher(LogListData({ data: clean, inProgress: false }))
          setLoadmore(false)
          setFindTag(result.rows.item(i).tag);
          setRefreshing(false);
        }
        else {
          console.log('no data to show')
          dataDispatcher(LogListData({ data: [], inProgress: false }))
          setRefreshing(false);
        }
        }
    });
    });
  };

  const onRefresh = React.useCallback(async () => {
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    setRefreshing(true);
    //console.log('First')
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    //let temData = (getReduxData.data === undefined) ? [] : getReduxData.data;
    let temData =  []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC,onTime DESC LIMIT 10 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          //dataDispatcher(LogListData({ data: [], inProgress: false }))
          setLoadmore(false)
          return false;
        }
        setOffset(offset + 10);
        //if (result.rows.length > 1){
        for (let i = 0; i <= result.rows.length; i++) {
          if (result.rows.length !== 0){
          setModalVisible(true)
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
            user_id: result.rows.item(i).user_id,
            flight_no: result.rows.item(i).flight_no,
            date: result.rows.item(i).date,
            day: result.rows.item(i).day,
            actual_Instrument: result.rows.item(i).actual_Instrument,
            aircraftReg: result.rows.item(i).aircraftReg,
            aircraftType: result.rows.item(i).aircraftType,
            dayLanding: result.rows.item(i).dayLanding,
            dual_day: result.rows.item(i).dual_day,
            dual_night: result.rows.item(i).dual_night,
            flight: result.rows.item(i).flight,
            from: result.rows.item(i).from_nameICAO,
            ifr_vfr: result.rows.item(i).ifr_vfr,
            instructional: result.rows.item(i).instructional,
            instructor: result.rows.item(i).instructor,
            landing: result.rows.item(i).inTime,
            night: result.rows.item(i).night,
            chocksOffTime: result.rows.item(i).offTime,
            nightLanding: result.rows.item(i).nightLanding,
            chocksOnTime: result.rows.item(i).onTime,
            takeOff: result.rows.item(i).outTime,
            p1: result.rows.item(i).p1,
            p1_us_day: result.rows.item(i).p1_us_day,
            p1_us_night: result.rows.item(i).p1_us_night,
            p2: result.rows.item(i).p2,
            pic_day: result.rows.item(i).pic_day,
            pic_night: result.rows.item(i).pic_night,
            stl: result.rows.item(i).stl,
            route: result.rows.item(i).route,
            sic_day: result.rows.item(i).sic_day,
            sic_night: result.rows.item(i).sic_night,
            sim_instructional: result.rows.item(i).sim_instructional,
            sim_instrument: result.rows.item(i).sim_instrument,
            selected_role: result.rows.item(i).selected_role,
            student: result.rows.item(i).student,
            to: result.rows.item(i).to_nameICAO,
            totalTime: result.rows.item(i).totalTime,
            x_country_day: result.rows.item(i).x_country_day,
            x_country_night: result.rows.item(i).x_country_night,
            x_country_day_leg: result.rows.item(i).x_country_day_leg,
            x_country_night_leg: result.rows.item(i).x_country_night_leg,
            p1_ut_day: result.rows.item(i).p1_ut_day,
            p1_ut_night: result.rows.item(i).p1_ut_night,
            remark: result.rows.item(i).remark,
            from_lat: result.rows.item(i).from_lat,
            from_long: result.rows.item(i).from_long,
            to_lat: result.rows.item(i).to_lat,
            to_long: result.rows.item(i).to_long,

          });
          //console.log('checkdata', result.rows.item(i).totalTime);
          setLocalLogbookData(temData);
          var arr = temData;
          var clean = arr.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))

          //console.log('imp-data',clean[0]);
          dataDispatcher(LogListData({ data: clean, inProgress: false }))
          setLoadmore(false)
          setFindTag(result.rows.item(i).tag);
          setRefreshing(false);
        }
        else {
          console.log('no data to show')
          dataDispatcher(LogListData({ data: [], inProgress: false }))
          setRefreshing(false);
        }
        }
    });
    });
    //test()
  }, [getReduxData]);

//   React.useEffect(() => {
//     if(isFocused){
//       getTotalTime();
//   }
//   }, [isFocused]);

// const getTotalTime = async () => {
//     //console.log('First')
//     let user = await AsyncStorage.getItem('userdetails');
//     user = JSON.parse(user);
//     let temData = [];
//     //console.log('tempdata', temData);
//     //dataDispatcher(LogListData({data: []}))
//     prePopulateddb.transaction(tx => {
//       tx.executeSql('SELECT totalTime from logbook WHERE user_id = "' + user.id + '" AND totalTime != "null"', [], (tx, result) => {

//         for (let i = 0; i <= result.rows.length; i++) {
//           temData.push({
//             totalTime: result.rows.item(i).totalTime,
//           });
//           console.log('single', temData);
//           //setLocalData(temData);
//           //setDone(true)
//           for (let j = 0; j < temData.length; j++) {
//             var counter = temData[j];
//             console.log('tetststtets',counter);
//         }
//         }
        
        
//       });
//     });
//   };



  // const getFlyingReduxData = useSelector(state => state.FlyingTime.FlyingData);
  // console.log('from Flying Time list details', getFlyingReduxData.FlyingData);

  const getReduxData = useSelector(state => state.logList.data);
  //console.log('from logbook list details', getReduxData.data);

  // const getFlyingReduxData = useSelector(state => state.FlyingTime.FlyingData);
 //console.log('from Flying ', getFlyingReduxData.FlyingData);

  //console.log('download count',useSelector(state => state.logList.downloadCount))

  //Sqlite ends

  //console.log('INDEXXXX', getReduxData.inProgress )

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  //   console.log('From', from)
  //   console.log('to', to)
  //   console.log('FromLat', fromLat1)
  //   console.log('FromLong', fromLong1)
  //   console.log('toLat', toLat1)
  //   console.log('toLong', toLong1)
  //   console.log('GivenDate', givenDate)
  //console.log('selected id', selectedId);
  // console.log('chocksOffTime1',chocksOffTime1)
  // console.log('chocksOnTime',chocksOnTime1)

  const DeleteALLRosterList = () => {
    dataDispatcher(LogListData({ data: [] }))
    prePopulateddb.transaction(tx => {
      tx.executeSql(
        'DELETE FROM logbook WHERE tag = "roster"', [], (tx, Delresult) => {
          console.log('Result', Delresult.rows.length);
          console.log('DELETE FROM logbook WHERE tag = "roster"')
          SELECTAfterDel(true)
        }
      );
    });
  }

  const SELECTAfterDel = async (deleteRoster = false) => {
    // let user = await AsyncStorage.getItem('userdetails');
    // user = JSON.parse(user);
    // console.log('test');
    // if (deleteRoster === true) {
    //   console.log('inner', user.id)
    //   const query = 'SELECT id,tag,date,aircraftType,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,orderedDate from logbook WHERE user_id = "' + user.id + '" ORDER BY orderedDate DESC LIMIT 5 OFFSET ' + offset
    //   console.log(query)
    //   prePopulateddb.transaction(tx => {
    //     tx.executeSql(query, [], (tx, result) => {

    //       if (result.rows.length == 0) {
    //         console.log('no data to load')
    //         setLoadmore(false)
    //         return false;
    //       }
    //       else {
    //         console.log('resultsLength', result.rows.length)
    //       }
    //       setOffset(offset + 5);
    //       let DataAfterRosterDel = [];
    //       for (let i = 0; i <= result.rows.length; i++) {
    //         if (result.rows.length !== 0){
    //         DataAfterRosterDel.push({
    //           id: result.rows.item(i).id,
    //           tag: result.rows.item(i).tag,

    //           date: result.rows.item(i).date,

    //           aircraftType: result.rows.item(i).aircraftType,

    //           from_lat: result.rows.item(i).from_lat,
    //           from_long: result.rows.item(i).from_long,

    //           from: result.rows.item(i).from_nameICAO,

    //           chocksOffTime: result.rows.item(i).offTime,
    //           chocksOnTime: result.rows.item(i).onTime,

    //           p1: result.rows.item(i).p1,

    //           p2: result.rows.item(i).p2,

    //           to: result.rows.item(i).to_nameICAO,
    //           to_lat: result.rows.item(i).to_lat,
    //           to_long: result.rows.item(i).to_long,

    //           orderedDate: result.rows.item(i).orderedDate,

    //         })
    //         console.log('DATTATTA', DataAfterRosterDel)
    //         dataDispatcher(LogListData({ data: DataAfterRosterDel, inProgress: false }))
    //         setLoadmore(false)
    //         setFindTag(result.rows.item(i).tag);
    //       }
    //       else {
    //         console.log('no data to show')
    //         dataDispatcher(LogListData({ data: [], inProgress: false }))
    //       }
    //     }
    //     });
    //   });
    // }
    //getLogbookData()
    onRefresh()
  }

  const UpdateAllRoster = () => {
    dataDispatcher(LogListData({ data: [] }))
    prePopulateddb.transaction(tx => {
      tx.executeSql(
        'UPDATE logbook set tag="manual" WHERE tag = "roster"', [], (tx, Delresult) => {
          console.log('Result', Delresult.rows.length);
          //console.log('DELETE FROM logbook WHERE tag = "roster"')
          SELECTAfterAccept(true)
        }
      );
    });
  }

  const SELECTAfterAccept = async (AcceptRoster = false) => {
    // let user = await AsyncStorage.getItem('userdetails');
    // user = JSON.parse(user);
    // console.log('test');
    // if (AcceptRoster === true) {
    //   console.log('inner', user.id)
    //   const query = 'SELECT id,tag,date,aircraftType,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,orderedDate from logbook WHERE user_id = "' + user.id + '" ORDER BY orderedDate DESC , inTime DESC LIMIT 5 OFFSET ' + offset
    //   console.log(query)
    //   prePopulateddb.transaction(tx => {
    //     tx.executeSql(query, [], (tx, result) => {

    //       if (result.rows.length == 0) {
    //         console.log('no data to load')
    //         setLoadmore(false)
    //         return false;
    //       }
    //       else {
    //         console.log('resultsLength', result.rows.length)
    //       }
    //       setOffset(offset + 5);
    //       let DataAfterRosterAccept = [];
    //       for (let i = 0; i <= result.rows.length; i++) {
    //         DataAfterRosterAccept.push({
    //           id: result.rows.item(i).id,
    //           tag: result.rows.item(i).tag,

    //           date: result.rows.item(i).date,

    //           aircraftType: result.rows.item(i).aircraftType,

    //           from_lat: result.rows.item(i).from_lat,
    //           from_long: result.rows.item(i).from_long,

    //           from: result.rows.item(i).from_nameICAO,

    //           chocksOffTime: result.rows.item(i).offTime,
    //           chocksOnTime: result.rows.item(i).onTime,

    //           p1: result.rows.item(i).p1,

    //           p2: result.rows.item(i).p2,

    //           to: result.rows.item(i).to_nameICAO,
    //           to_lat: result.rows.item(i).to_lat,
    //           to_long: result.rows.item(i).to_long,

    //           orderedDate: result.rows.item(i).orderedDate,

    //         });
    //         //console.log('single', result.rows.item(i).outTime);
    //         //setLocalLogbookData(DataAfterRosterDel);
    //         //console.log(DataAfterRosterDel)
    //         //setComplete(true)
    //         dataDispatcher(LogListData({ data: DataAfterRosterAccept, inProgress: false }))
    //       }
    //     });
    //   });
    //   //const getReduxDataDeleted = dataSelector;
    //   //console.log('from Deleted Logbook', getReduxDataDeleted.data);
    // }
    onRefresh();
  }

  const Total = () => {
    //if (localData!== null){
    var TotalTime = 0;
    var Total_time1 = '';
    // console.log(localLogbookData)
    getFlyingReduxData.FlyingData.map(d => {
      // // total  flying hours
      console.log(d)
      
        var total = d.split(":")

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
        console.log(Total_time1)
        console.log(Total_time1);
        if (isNaN(Total_time1[1])) {
          Total_time1[1] = '0'
        }
        //dataDispatcher(FlyingData({totalFlyingHours: Total_time1}))
      
    })
    setTotalFlyingHours(Total_time1)

    //}
  }
  

   const getFlyingReduxData = useSelector(state => state.FlyingTime.totalFlyingHours);
    //console.log('from Flying Time list details', getFlyingReduxData.totalFlyingHours);
  const TotalFlyingHours = getFlyingReduxData.totalFlyingHours

  const getTotalTypeReduxData = useSelector(state => state.tt.totalType);
  //console.log('from TotalType', getTotalTypeReduxData.totalType);


  const renderFooter = () => {
    // for (var g = 0; g <  getReduxData.data.length; g++) {
    //     for (key in getReduxData.data[g]) {
    //       console.log('Key: '+ key + ' Value: ' + getReduxData.data[g][key]);
    //     }
    //   }
    let myArray = []
    for (var i = 0; i < getReduxData.data.length; ++i) {
      var json = getReduxData.data[i];
      for (var prop in json) {
        //console.log(json[prop]);
        myArray.push(json[prop])
        //console.log(myArray)
        setCheckTag(myArray.includes('roster'))
        //setCheckTag(myArray)
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
      //localLogbookData
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
                {getReduxProgressData.ProgressValue !== undefined ? <Text style={{ color: '#fff' }}>{ProgressBar}</Text> : null}
              </View>
            </View>
          </Modal>
        </View>
        :
        <FlatList
          style={{ width: '100%', marginBottom: 150 }}
          data={getReduxData.data} // From Roaster data
          //data = {localLogbookData}
          renderItem={renderItem}
          keyExtractor={(_, index) => { return index.toString() }}
          numColumns={1}
          onEndReached={search !== '' ? null : getLogbookData}
          //onMomentumScrollEnd={getLogbookData}
          onEndReachedThreshold={1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          //extraData={getReduxData}
          //ListFooterComponent={loadmore === true ? <ActivityIndicator color={'#000'} /> : null}
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
                {getReduxProgressData.ProgressValue !== undefined ? <Text style={{ color: '#fff' }}>{ProgressBar}</Text> : null}
              </View>
            </View>
          </Modal>
        </View>  
      :null}


      <Draggable
        debug x={300} y={450} z={5} renderColor={'#256173'} renderSize={70} isCircle={true}
        onShortPressRelease={() => PlusNavigation()}
      />

      <View style={dark?LogbookListing.DarkbottomView:LogbookListing.bottomView}>
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
        {getReduxProgressData.ProgressValue !== undefined? <Text>Downloading logs : {ProgressBar}</Text> : null}
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
          <Text style={{color:dark?'#fff':'#000'}}> LAST BACKUP-</Text>
          <Text style={{color:dark?'#fff':'#000'}}>{getReduxBACKUPData.BackupTime}</Text>
        </View>
      </View>

    </SafeAreaView>
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
    //marginTop: 22
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
    //elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#fff',
  }
});

//make this component available to the app
export default LogBookListing;
