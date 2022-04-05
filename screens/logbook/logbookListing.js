//import liraries
import React from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet,RefreshControl,Alert, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions, Modal,SafeAreaView } from 'react-native';
import { LogbookListing } from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../../params-context';
import { useDispatch, useSelector } from 'react-redux';
import { LogListData } from '../../store/actions/loglistAction';
import { Divider } from 'react-native-paper';
import { ThemeContext } from '../../theme-context';
import SegmentedControlTab from "react-native-segmented-control-tab";
import NetInfo from "@react-native-community/netinfo";
import Swipeout from 'react-native-swipeout';
import { BaseUrl } from '../../components/url.json';
import {BaseUrlAndroid} from '../../components/urlAndroid.json';

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

// NetInfo.addEventListener(networkState => {
//   console.log("Connection type - ", networkState.type);
//   console.log("Is connected? - ", networkState.isConnected);

//   if (networkState.isConnected === false) {
//     //alert ("Couldn't be able to sync data from server cause of non availability of network")
//   }
// });

// create a component
const LogBookListing = ({ navigation }) => {

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


  const [selectedId, setSelectedId] = React.useState('')
  const [focused, setFocused] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [loadmore, setLoadmore] = React.useState(false);
  const [findTag, setFindTag] = React.useState('')
  const [totalFlyingHours, setTotalFlyingHours] = React.useState('')

  const [activeRowKey, setActiveRowKey] = React.useState(null)
 

  const onFocusChange = () => setFocused(true);
  const onFocusCancelled = () => setFocused(false);

  const [, setParamsLogbook] = React.useContext(ParamsContext);


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
      tx.executeSql('SELECT reg_date,roster_id,Total_flying_hours,rosterLength,freeHours,subscribe FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available '); 
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
          console.log('subscription', result.rows.item(i).subscribe);
          console.log('rosterLength', result.rows.item(i).rosterLength);
          console.log('freeHours', result.rows.item(i).freeHours);
          setReg_date(result.rows.item(i).reg_date)
          setRosterId(result.rows.item(i).roster_id)
          setRosterLength(result.rows.item(i).rosterLength)
          //setTotalFlyingHours(result.rows.item(i).Total_flying_hours)
          setFreeHours(result.rows.item(i).freeHours)
          setSubscribe(result.rows.item(i).subscribe)
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
  const ProgressBar = getReduxProgressData.ProgressValue + '/' + getReduxProgressData.totalvalue

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
              "local_id": item.id
          })
      }).then(res => res.json())
          .then(resData => {
              console.log(resData)
              //Alert.alert(resData.message);
          });
  };

    const DeleteLogs = () => {
      prePopulateddb.transaction(tx => {
        tx.executeSql(
          'DELETE FROM logbook WHERE id = "'+item.id+'"', [], (tx, Delresult) => {
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
        RoasterId: item.id,
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

  React.useEffect(() => {
    if(isFocused){
      if(subscribe==='0'){
        navigation.navigate('subscribe')
      }
      else{
      onRefresh();
      }
    }
  }, [isFocused,subscribe]);

  const getLogbookData = async () => {
    setLoadmore(true)
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = (getReduxData.data === undefined) ? [] : getReduxData.data;
    let pur = []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT id,tag,user_id,date,aircraftReg,aircraftType,from_nameICAO,inTime,offTime,onTime,outTime,p1,p2,to_nameICAO,remark,from_lat,from_long,to_lat,to_long,purpose1,distance,sim_type,sim_exercise,pf_time,pm_time,sfi_sfe,simLocation,isSaved,savedChocksOff,instructional from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime DESC LIMIT 30 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          setLoadmore(false)
          return false;
        }
        
        setOffset(offset + 30);
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

  const onRefresh = React.useCallback(async () => {
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    setRefreshing(true);
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData =  []
    let pur = []
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT id,tag,user_id,date,aircraftReg,aircraftType,from_nameICAO,inTime,offTime,onTime,outTime,p1,p2,to_nameICAO,remark,from_lat,from_long,to_lat,to_long,purpose1,distance,sim_type,sim_exercise,pf_time,pm_time,sfi_sfe,simLocation,isSaved,savedChocksOff,instructional from logbook WHERE user_id = "' + user.id + '" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime DESC  LIMIT 50 OFFSET ' + offset, [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          //setLoadmore(false)
          return false;
        }
        setOffset(offset + 50);
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
        else{
          temData.push({
            id: result.rows.item(i).id,
            tag: result.rows.item(i).tag,
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
          setLocalLogbookData(temData);
          var arr = temData;
          var clean = arr.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.chocksOffTime === arr.chocksOffTime && t.date === arr.date && t.from === arr.from)))
          dataDispatcher(LogListData({ data: clean, inProgress: false }))
          //setLoadmore(false)

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
                {getReduxProgressData.ProgressValue !== undefined ? <Text style={{ color: '#fff' }}>{ProgressBar}</Text> : null}
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#fff',
  }
});

//make this component available to the app
export default LogBookListing;
