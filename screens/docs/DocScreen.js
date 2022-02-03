//import liraries
import React from 'react';
import { View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert, SafeAreaView } from 'react-native';
import DocScreenStyle from '../../styles/docStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { ThemeContext } from '../../theme-context';
//import { Checkbox } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { EGCADetailsData } from '../../store/actions/egcaDetailsAction';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { DocListData } from '../../store/actions/DocListAction';
import { DocData } from '../../store/actions/docAction';
import { useIsFocused } from "@react-navigation/native";


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
const Docs = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(false)
  const [data, setData] = React.useState(null)
  const [ATPLData, setATPLData] = React.useState(null)
  const [selectedItem, setSelectedItem] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [offset, setOffset] = React.useState(0);
  const [search, setSearch] = React.useState('')
  const [focused, setFocused] = React.useState(false);
  const [logModalVisible, setLogModalVisible] = React.useState(false);
  const [reportModalVisible, setReportModalVisible] = React.useState(false);
  const { dark, theme, toggle } = React.useContext(ThemeContext);

  const dataDispatcher = useDispatch();
  const onFocusChange = () => setFocused(true);
  const onFocusCancelled = () => setFocused(false);

  //Sqlite starts
  const searchQuery = (dataToSearch) => {
    dataDispatcher(DocListData({ data: [] }))
    let SearchedData = [];
    let SingleResult = '';
    setSearch(dataToSearch)
    if (selectedIndex === 0) {
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE tag = "manual" AND  crewCustom1 LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
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
              dataDispatcher(DocListData({ data: SearchedData }))
            }
          }
        });
      });

    }
    else if (selectedIndex === 1) {
      let queryString = 'SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE tag = "manual" AND from_city  LIKE "%' + dataToSearch + '%" OR to_city LIKE "%' + dataToSearch + '%" OR from_nameICAO LIKE "%' + dataToSearch + '%" OR to_nameICAO LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10';
      prePopulateddb.transaction(tx => {
        tx.executeSql(queryString, [], (tx, result) => {
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
              dataDispatcher(DocListData({ data: SearchedData }))
            }
          }
        });
      });
    }
    else if (selectedIndex === 2) {
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE tag = "manual" AND aircraftReg  LIKE "%' + dataToSearch + '%" OR aircraftType LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
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
              dataDispatcher(DocListData({ data: SearchedData }))
            }
          }
        });
      });
    }
    else if (selectedIndex === 3) {
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE tag = "manual" AND date  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
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
              dataDispatcher(DocListData({ data: SearchedData }))
            }
          }
        });
      });
    }
    else if (selectedIndex === 4) {
      prePopulateddb.transaction(tx => {
        tx.executeSql('SELECT id,tag,date,aircraftType,from_city,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long FROM logbook WHERE tag = "manual" AND flight  LIKE "%' + dataToSearch + '%" ORDER BY orderedDate DESC , inTime DESC limit 10', [], (tx, result) => {
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
              dataDispatcher(DocListData({ data: SearchedData }))
            }
          }
        });
      });
    }
    else {
      dataDispatcher(DocListData({ data: [] }))
    }
  }
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  React.useEffect(() => { 
    if(isFocused){
    getLogbookData() 
    }
  }, [getReduxDocData,isFocused]);
  //React.useEffect(() => { getATPLData() });


  const getLogbookData = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = (getReduxDocData.data === undefined) ? [] : getReduxDocData.data;
    //let temData = []
    //dataDispatcher(DocListData({data: []}))
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * from logbook WHERE user_id = ' + user.id + ' AND tag= "manual" ORDER BY orderedDate DESC , inTime DESC LIMIT 5 OFFSET "' + offset + '"', [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          return false;
        }
        //console.log(result)
        setOffset(offset + 5);
        for (let i = 0; i <= result.rows.length; i++) {
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
          });
          console.log(temData.length)
          setData(temData);
          dataDispatcher(DocListData({ data: temData }))
        }
      });
    });
  };
  const getATPLData = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = (getReduxDocData.data === undefined) ? [] : getReduxDocData.data;
    //let temData = []
    //dataDispatcher(DocListData({data: []}))
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * from logbook WHERE user_id = ' + user.id + ' AND tag= "server" ORDER BY orderedDate DESC , inTime DESC LIMIT 5 OFFSET "' + offset + '"', [], (tx, result) => {
        if (result.rows.length == 0) {
          console.log('no data to load')
          return false;
        }
        //console.log(result)
        setOffset(offset + 5);
        for (let i = 0; i <= result.rows.length; i++) {
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
          });
          setATPLData(temData);
        }
      });
    });
  };

  const getReduxDocData = useSelector(state => state.docList.data);
  //console.log(getReduxDocData.data.length)

  const openList = () => { setOpen(true); setSelectedItem([]); }
  const closeList = () => { setOpen(false); setSelectedItem([]); }

  const onUpdateValue = (index, value) => {
    var errors = [];
    if (!data[index].aircraftReg) {
      errors.push({ message: "You can't upload this log to dgca due to missing Registration NUmber" })
    }
    if (!data[index].p2) {
      errors.push({ message: "You can't upload this log to dgca due to missing SIC name" })
    }
    if (!data[index].p1) {
      errors.push({ message: "You can't upload this log to dgca due to missing PIC name" })
    }
    if (!data[index].from) {
      errors.push({ message: "You can't upload this log to dgca due to missing Departure Place" })
    }
    if (!data[index].chocksOffTime) {
      errors.push({ message: "You can't upload this log to dgca due to missing Departure time" })
    }
    if (!data[index].to) {
      errors.push({ message: "You can't upload this log to dgca due to missing Arrival Place" })
    }
    if (!data[index].chocksOnTime) {
      errors.push({ message: "You can't upload this log to dgca due to missing Arrival time" })
    }
    if (!data[index].aircraftReg) {
      errors.push({ message: "You can't upload this log to dgca due to missing Aircraft Registration" })
    }
    if (errors.length) {
      alert("Errors:\n" + errors.map(function (e) { return e.message; }).join('\n'));
      data[index].selected = false;
    }
    else {
      data[index].selected = value;
    }
    return setData([...data]);
  }

  const renderItem = ({ item, index }) => <ItemRenderer key={index} index={index} item={item} selected={item.selected} label={item.id} onUpdateValue={onUpdateValue} />
  const filterSelected = () => {
    var logs = [];
    data.filter(item => item.selected).map(item => {
      logs.push(item);
      setSelectedItem(logs);
      dataDispatcher(DocData({ selectedData: logs }))
    })
  }

  //DaTA FOR WEBVIEW
  const selection = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let Data = [];
    let SingleResult = '';
    prePopulateddb.transaction(tx => {
      tx.executeSql('SELECT * FROM EGCADetails WHERE user_id = "' + user.id + '"', [], (tx, result1) => {
        if (result1.rows.length > 0) {
          for (let i = 0; i <= result1.rows.length; i++) {
            SingleResult = {
              id: result1.rows.item(i).id,
              egcaId: result1.rows.item(i).egcaId,
              egcaPwd: result1.rows.item(i).egcaPwd,
              FtoOperator: result1.rows.item(i).FtoOperator,
              FlightType: result1.rows.item(i).FlightType,
              Purpose: result1.rows.item(i).Purpose,
              AuthVerifier: result1.rows.item(i).AuthVerifier,
              NameOfAuthVerifier: result1.rows.item(i).NameOfAuthVerifier,
            }
            Data.push(SingleResult)
            dataDispatcher(EGCADetailsData({ data: Data }))
          }
        }
        else {
          alert('Please Upload EGCA Settings from settings First')
          setOpen(false)
          navigation.navigate('EGCAUpload')
        }
      });
    });
  }
  // const getReduxData = useSelector(state => state.Egcadata.data);

  // const setFiltered = async () => {
  //   // await AsyncStorage.setItem('slectedLogs', JSON.stringify(selectedItem))
  //   // await AsyncStorage.setItem('EGCAData', JSON.stringify(getReduxData))
  //   setOpen(false)
  //   navigation.navigate('webview')
  // }
  const ItemRenderer = ({ item, index, selected, onUpdateValue }) => {
    return (
      <TouchableOpacity style={[styles.item]}>
          <ScrollView style={dark?[styles.Darklisting]:[styles.listing]}>
            <View style={{ width: '100%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={dark?{color:'#fff',fontSize:15, fontFamily:'WorkSans-Bold'}:{color:'#000',fontSize:15, fontFamily:'WorkSans-Bold'}}> {item.date} </Text>
                <CheckBox
                  disabled={false}
                  value={selected}
                  onValueChange={(value) => { onUpdateValue(index, value); filterSelected(); }}
                />
              </View>
              <Divider />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={dark?{color:'#fff',fontWeight: 'bold', paddingTop: 10}:{ fontWeight: 'bold', paddingTop: 10 }}>{item.from}</Text>
                <MaterialCommunityIcons name="airplane-takeoff" color={dark?'#fff':'#000'} size={30} style={{ paddingHorizontal: 10, paddingTop: 10 }} />
                <Text style={dark?{color:'#fff',fontWeight: 'bold', paddingTop: 10}:{ fontWeight: 'bold', paddingTop: 10 }}>{item.to}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{color:dark?'#fff':'#000'}}>{item.chocksOffTime}</Text>
                <Text style={dark?{color:'#fff', paddingLeft: 28 }:{ paddingLeft: 28 }}>{item.chocksOnTime}</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>
     );
  }
  const openWebView = () => {
    setOpen(false)
    navigation.navigate('webview')
  }

  const AtplHours = async () => {
    var total_Flying = 0
    var total_PIC_Time = 0
    var Night_Hours = 0;
    var total_instrument = 0

    var Final_Night_Time = ''
    var Final_PIC_Time = ''
    var total_instrument1 = ''
    var Total_Time = ''
    ATPLData.map((d) => {
      //--------  nightTime flying hours --------//
      if(d.night !== ""){
      var Night = d.night.split(":")
      var total_Nighttime = Number(Night[0] * 60) + Number(Night[1])
      Night_Hours += total_Nighttime
      var total_Night_Hours = Math.floor(Night_Hours / 60);
      var total_Night_Min = Night_Hours % 60;
      if (total_Night_Hours < 10) {
        total_Night_Hours = '0' + total_Night_Hours;
      }
      if (total_Night_Min < 10) {
        total_Night_Min = '0' + total_Night_Min;
      }
      Final_Night_Time = total_Night_Hours + ":" + total_Night_Min;
      if (isNaN(Final_Night_Time[1])) {
        Final_Night_Time = '00:00'
      }
    }

      //--------  total_Time flying hours --------//
      if(d.totalTime !== ""){
      var TotalTime = d.totalTime.split(":")
      var total_time = Number(TotalTime[0] * 60) + Number(TotalTime[1])
      total_Flying += total_time
      var total_Hours = Math.floor(total_Flying / 60);
      var total_Min = total_Flying % 60;
      if (total_Hours < 10) {
        total_Hours = '0' + total_Hours;
      }
      if (total_Min < 10) {
        total_Min = '0' + total_Min;
      }
      Total_Time = total_Hours + ":" + total_Min;
    }
      //--------  total_Pic Time flying hours --------//
      if(d.totalTime !== ""){
      var Pic_Hours = d.totalTime.split(":")
      var pic_hrs = Number(Pic_Hours[0] * 60) + Number(Pic_Hours[1])
      total_PIC_Time += pic_hrs
      var pic_total_Hours = Math.floor(total_PIC_Time / 60);
      var pic_total_Min = total_PIC_Time % 60;
      if (pic_total_Hours < 10) {
        pic_total_Hours = '0' + pic_total_Hours;
      }
      if (pic_total_Min < 10) {
        pic_total_Min = '0' + pic_total_Min;
      }
      Final_PIC_Time = pic_total_Hours + ":" + pic_total_Min;
      if (isNaN(Final_PIC_Time[1])) {
        Final_PIC_Time = '00:00'
      }
    }

    //------- instrument flying hours --------//
    if(d.totalTime !== ""){
    var sim_instrument = d.sim_instrument.split(":")
    var act_instrument = d.actual_Instrument.split(":")
    var total_sim_instrument = Number(sim_instrument[0] * 60) + Number(sim_instrument[1])
    var total_act_instrument = Number(act_instrument[0] * 60) + Number(act_instrument[1])
    var instrument = total_sim_instrument + total_act_instrument
    total_instrument += instrument
    var sim_instrument_Hours = Math.floor(total_instrument / 60);
    var sim_instrument_Min = total_instrument % 60;
    if (sim_instrument_Hours < 10) {
        sim_instrument_Hours = '0' + sim_instrument_Hours;
    }
    if (sim_instrument_Min < 10) {
        sim_instrument_Min = '0' + sim_instrument_Min;
    }
    total_instrument1 = sim_instrument_Hours + ":" + sim_instrument_Min;
    if (isNaN(total_instrument1[1])) {
        total_instrument1 = '00:00'
    }
  }
  })
    const htmldata = '<style type="text/css">td{border: 1px #ccc solid; font-size:12px; padding: 2px;} .ritz{width:100%}</style><div class="ritz grid-container"><table class="waffle" cellspacing="0" cellpadding="0"><tbody><tr style="height: 20px"><td class="s0" colspan="5">Total flying experience till THE DATE OF SUBMISSION OF PAPERS IN DGCA</td></tr><tr style="height: 20px"><td colspan="2">Requirement</td><td>Hrs Req.</td><td>Actual</td><td>Remarks</td></tr><tr style="height: 20px"><td class="s0" colspan="5">Total flying experience details</td></tr><tr style="height: 20px"><td>(i)</td><td>Total flying time (in this 50% of multi co-pilot hrs are counted)</td><td>1500</td><td>' +Total_Time+ '</td><td></td></tr><tr style="height: 20px"><td>(ii)</td><td>Total as PIC (in this P1 U/S and STL hrs are counted 50%)</td><td>500</td><td>' + Final_PIC_Time + '</td><td></td></tr><tr style="height: 20px"><td class="s2">(iii)</td><td>Total Night flying experience (in this 50% of multi co-pilot night hrs are counted)</td><td class="s2">100</td><td>' +Final_Night_Time + '</td><td></td></tr><tr style="height: 20px"><td>(iv)</td><td>Total Instrument Time (not more than 50 synthetic simulator hrs shall be counted)</td><td>100</td><td>'+total_instrument1+'</td><td></td></tr><tr style="height: 20px"><td class="s0" colspan="5">X-country flying time</td></tr><tr style="height: 20px"><td>(i)</td><td>Total X-country by day and night</td><td>1000</td><td></td><td></td></tr><tr style="height: 20px"><td>(ii)</td><td>Total PIC X-country by day and night</td><td>200</td><td></td><td></td></tr><tr style="height: 20px"><td class="s2">(iii)</td><td>Total PIC X-country flying time by Night</td><td>50</td><td></td><td></td></tr></tbody></table></div>';
    const resulthtml = await RNHTMLtoPDF.convert({
      width: 842,
      height: 595,
      html: htmldata,
      fileName: 'test',
      base64: true,

    });
    navigation.navigate('ShowPDF', {
      filepath: resulthtml.filePath,
      base64: resulthtml.base64,
    });

  }
  return (
    <SafeAreaView style={[DocScreenStyle.container, {backgroundColor: theme.backgroundColor}]}>
      <Modal animationType='slide' transparent={true} visible={open === true}>
        {/* <TouchableOpacity activeOpacity={1} onPress={closeList} style={{ flex: 1 }}> */}
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.listWrapper}>
            <View style={[styles.listContainer,{backgroundColor:theme.backgroundColor}]}>
              <MaterialCommunityIcons name="close" color={dark?'#fff':'#000'} size={20} style={{ padding: 6 }} onPress={closeList} />
              <View style={{ backgroundColor: dark?'#000':'#F3F3F3', padding: 10, flexDirection: 'row' }}>
                <View style={(focused) ? styles.searchbar2 : styles.searchbar}>
                  <MaterialCommunityIcons name="magnify" color={'#000'} size={25} style={{ padding: 6 }} />
                  <TextInput
                    onFocus={onFocusChange}
                    placeholder='Search'
                    placeholderTextColor="#D0D0D0"
                    value={search}
                    onChangeText={(inputText) => searchQuery(inputText)}
                    style={{ marginTop: -7, fontSize: 15, width: 100, lineHeight: 25 }}
                  />
                </View>
                {focused ? <Text style={dark?styles.DarkcancelButton:styles.cancelButton} onPress={onFocusCancelled}>Cancel</Text> : null}
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
              {data == null ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>No Logs To Upload</Text>
                </View>
                :
                <>
                  <FlatList
                    data={getReduxDocData.data}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => { return index.toString() }}
                    numColumns={1}
                    onEndReached={() => { search !== '' ? null : getLogbookData() }}
                    onEndReachedThreshold={1}
                  />

                  <View style={DocScreenStyle.footer}>
                    <TouchableOpacity onPress={() => { selectedItem.length > 0 ? openWebView() : alert('select logs to upload') }} >
                      <View style={DocScreenStyle.button}>
                        <Text style={DocScreenStyle.buttonText}>Proceed</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              }
            </View>

          </View>
        </SafeAreaView>
        {/* </TouchableOpacity> */}
      </Modal>
      <View style={DocScreenStyle.header}>
        <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.goBack()} />
        <Text style={DocScreenStyle.aircrafts}>Docs</Text>
      </View>
      <View style={dark?DocScreenStyle.DarkmainTagLine:DocScreenStyle.mainTagLine}>
        <Text style={dark?DocScreenStyle.DarktagLine:DocScreenStyle.tagLine}>Logbooks</Text>
        <MaterialCommunityIcons
          name="help-circle-outline" color='#256173' size={25} onPress={() => setLogModalVisible(true)} style={{ lineHeight: 23, position: 'absolute', right: 10, top: 10 }} />
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => navigation.navigate('DgcaLogBook')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>DGCA LogBook</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => { getLogbookData(); openList(); selection(); }}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Upload DGCA LogBook</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => navigation.navigate('JUSA')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Jeppessen Logbook (USA)</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => navigation.navigate('JEU')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Jeppessen Logbook (EU)</Text>
        </TouchableOpacity>
      </View>
      <View style={dark?DocScreenStyle.DarkmainTagLine:DocScreenStyle.mainTagLine}>
        <Text style={dark?DocScreenStyle.DarktagLine:DocScreenStyle.tagLine}>Reports</Text>
        <MaterialCommunityIcons
          name="help-circle-outline" color='#256173' size={25} onPress={() => setReportModalVisible(true)} style={{ lineHeight: 23, position: 'absolute', right: 10, top: 10 }} />
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => navigation.navigate('DGCA39')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>DGCA (CA-39)</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={AtplHours}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>ATPL Hours</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => Alert.alert('coming Soon ')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Experience Certificate</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.tabs}>
        <TouchableOpacity onPress={() => Alert.alert('coming Soon ')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Flights by city</Text>
        </TouchableOpacity>
      </View>
      <View style={DocScreenStyle.lastTab}>
        <TouchableOpacity onPress={() => Alert.alert('coming Soon ')}>
          <Text style={dark?DocScreenStyle.DarktabText:DocScreenStyle.tabText}>Flights by country</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centeredView} >
        <Modal
          animationType="fade"
          transparent={true}
          visible={logModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setLogModalVisible(!logModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={ styles.modalView}>
              <View style={{ width: '100%', backgroundColor:'#EFEFEF', padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text >LOGBOOKS</Text>
                <MaterialCommunityIcons
                  name="close" color='#256173' size={25} onPress={() => setLogModalVisible(!logModalVisible)} />
              </View>
              <View style={{ padding: 10, }}>
                <Text >
                  1. Create your logbook as per DGCA/ Jepp US/ Jepp EU format.{"\n"}
                  2. DGCA Logbook - Select STL to generate your STL logbook. P2 hours of STL flights will be automatically reflected in P1 (U/S)column.{"\n"}
                  3. You can number the Logbook page to ensure continuity of printed logbook pages{"\n"}
                  <Text style={{ color: 'blue' }}onPress={() => Linking.openURL('https://youtu.be/mMgHI2Z9Dok')}>(https://youtu.be/mMgHI2Z9Dok)</Text>
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={reportModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setReportModalVisible(!reportModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ width: '100%', backgroundColor:'#EFEFEF', padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text >REPORTS</Text>
                <MaterialCommunityIcons
                  name="close" color='#256173' size={25} onPress={() => setReportModalVisible(!reportModalVisible)} />
              </View>
              <View style={{ padding: 10, }}>
                <Text >
                  Enter Your User Id and Password to import
                  your logbook / roster. AIMS users can view
                  the video at <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL('https://www.youtube.com/watch?v=RrJ33MT1Q21')}>https://www.youtube.com/watch?v=RrJ33MT1Q21
                  </Text>.ARMS users at {"\n"}
                  <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL('https://www.youtube.com/watch?v=uhnRoBNJB64')}>https://www.youtube.com/watch?v=uhnRoBNJB64
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  DarkModalView: {
    margin: 20,
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  listWrapper: {
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: .5,
    elevation: 10,
    shadowRadius: 5
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC55'
  },
  tabHeading: {
    padding: 20,
    flexDirection: 'row',
  },
  title: {
    textTransform: 'capitalize',
    color: '#000'
  },
  listing: {
    borderRadius: 10,
    borderWidth: 0.3,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
  },
  Darklisting: {
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor:'#fff',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
  },
  searchbar: {
    //paddingLeft: 10,
    backgroundColor: '#fff',
    //padding: 10,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    //paddingVertical: 10,
  },
  searchbar2: {
    //paddingLeft: 10,
    backgroundColor: '#fff',
    //padding: 10,
    width: '80%',
    borderRadius: 10,
    flexDirection: 'row',
    //paddingVertical: 10,
  },
  cancelButton: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 5,
    //paddingHorizontal:150,
  },
  DarkcancelButton: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 5,
    color: '#fff'
  },
});

// define your styles

//make this component available to the app
export default Docs;