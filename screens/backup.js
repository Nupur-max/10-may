//import liraries
import React, { Component } from 'react';
import { View, Text,SafeAreaView, BackupStyleheet, TouchableOpacity, ImageBackground, Dimensions, Platform, Image, Modal, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import { ThemeContext } from '../theme-context';
import BackupStyle from '../styles/backupStyles';
import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { useDispatch, useSelector } from 'react-redux';
import { LogListData } from '../store/actions/loglistAction';
import {BackupData} from '../store/actions/backupAction';

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
const Backup = ({navigation}) => {

  const [load, setLoad] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(true);


    const { dark, theme, toggle } = React.useContext(ThemeContext);
    //const [newDate, setNewDate] = React.useState(new Date().toString())
    const dt = null;
    const [cdate,setDate] = React.useState(dt); 
    const handelDate = async() =>{
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      let dt = new Date();
      var date = dt.getDate();
      if (date < 10) { date = "0" + date; }
      var month = dt.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
      if (month < 10) { month = "0" + month; }
      var year = dt.getFullYear();
      var dateStr = date + "-" + month + "-" + year;
      setDate(dateStr);
      dataDispatcher(BackupData({BackupTime:dateStr}))
     }
    const getReduxData = useSelector(state => state.backup.BackupTime);
    //console.log('backupTime', getReduxData.BackupTime);
    
    const dataDispatcher = useDispatch();

    const backupFunc = async() => {
      //console.log('hello')
      let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        await fetch(Platform.OS==='ios'?BaseUrl+'listlogbook':BaseUrlAndroid+'listlogbook',{
            method : 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "user_id": user.id,
          })
        }).then(response => response.json())
        .then(syncData => {
           //console.log('syncData',syncData)
           //console.log('innerData',syncData.data)
           //console.log('length', syncData.data.length)
           syncData.data.map((data, index) => {
            setLoad(true)
              //console.log('synced data',data.p1,data.p2)
              const takeoffTime = data.offTime===''?data.outTime : data.offTime;
              const LandingTime = data.onTime===''?data.inTime : data.onTime;
              var d = new Date(data.date);
              let month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();
              if(day<10) {day = "0" + day}
              if (month < 10) { month = "0" + month; }
              //console.log('exact month',month)
              const PerfectDate = day+"-"+month+"-"+year
              //console.log('orderedDate',year+month+day)
              const orderedDate = year+month+day;
              //console.log('times', takeoffTime,LandingTime)
              const conditonalP1 = data.p1 === 'SELF' ? 'Self' : data.p1 
              db.transaction((tx) => {
                tx.executeSql(
              'INSERT INTO logbook (tag, user_id, serverId, flight_no, date, day,  actual_Instrument, aircraftReg, aircraftType, approach1, approach2, approach3, approach4, approach5, approach6, approach7, approach8, approach9, approach10, crewCustom1, crewCustom2, crewCustom3, crewCustom4, crewCustom5, dayLanding, dayTO, dual_day, dual_night, flight, from_airportID, from_altitude, from_city, from_country, from_dayLightSaving, from_source, from_lat, from_long, from_name, from_nameICAO, from_nameIATA, from_timeZone, from_type, from_dst_status, fullStop, ifr_vfr, instructional, instructor, inTime, landingCustom1, landingCustom2, landingCustom3, landingCustom4, landingCustom5, landingCustom6, landingCustom7, landingCustom8, landingCustom9, landingCustom10, night,nightLanding, nightTO, offTime, onTime, outTime, p1, p1_us_day, p1_us_night, p2, pic_day, pic_night, stl, reliefCrew1, reliefCrew2, reliefCrew3, reliefCrew4, route, sic_day, sic_night, sim_instructional, sim_instrument, selected_role, student, timeCustom1, timeCustom2, timeCustom3, timeCustom4, timeCustom5, timeCustom6, timeCustom7, timeCustom8, timeCustom9, timeCustom10, to_airportID, to_altitude, to_city, to_country, to_dayLightSaving, to_source, to_lat, to_long, to_name, to_nameIATA, to_nameICAO, to_timeZone, to_type, to_dst_status, totalTime, touch_n_gos, waterLanding, waterTO, x_country_day, x_country_night, x_country_day_leg, x_country_night_leg, outTime_LT, offTime_LT, onTime_LT, inTime_LT, sim_type, sim_exercise, pf_time, pm_time, sfi_sfe, simCustom1, simCustom2, simCustom3, simCustom4, simCustom5, simLocation, p1_ut_day, p1_ut_night, remark, autolanding, flight_date, selected_flight_timelog, imported_log, orderedDate) VALUES ("server","'+user.id+'","'+data.id+'","'+data.flight_no+'","'+PerfectDate+'","'+data.day+'","'+data.actual_Instrument+'","'+data.aircraftReg+'","'+data.aircraftType+'","'+data.approach1+'","'+data.approach2+'","'+data.approach3+'","'+data.approach4+'","'+data.approach5+'","'+data.approach6+'","'+data.approach7+'","'+data.approach8+'","'+data.approach9+'","'+data.approach10+'","'+data.crewCustom1+'","'+data.crewCustom2+'","'+data.crewCustom3+'","'+data.crewCustom4+'","'+data.crewCustom5+'","'+data.dayLanding+'" , "'+data.dayTO+'" , "'+data.dual_day+'" , "'+data.dual_night+'" , "'+data.flight+'" , "'+data.from_airportID+'" , "'+data.from_altitude+'" , "'+data.from_city+'" , "'+data.from_country+'" , "'+data.from_dayLightSaving+'" , "'+data.from_source+'" , "'+data.from_lat+'" , "'+data.from_long+'" , "'+data.from_name+'" ,"'+data.from_nameICAO+'" , "'+data.from_nameIATA+'" , "'+data.from_timeZone+'" , "'+data.from_type+'" , "'+data.from_dst_status+'" , "'+data.fullStop+'" , "'+data.ifr_vfr+'" , "'+data.instructional+'" , "'+data.instructor+'" , "'+data.inTime+'" , "'+data.landingCustom1+'" , "'+data.landingCustom2+'" , "'+data.landingCustom3+'" , "'+data.landingCustom4+'" , "'+data.landingCustom5+'" , "'+data.landingCustom6+'" , "'+data.landingCustom7+'" , "'+data.landingCustom8+'" , "'+data.landingCustom9+'" , "'+data.landingCustom10+'" , "'+data.night+'" , "'+data.nightLanding+'" , "'+data.nightTO+'" , "'+takeoffTime+'" , "'+LandingTime+'" , "'+data.outTime+'" , "'+conditonalP1+'" , "'+data.p1_us_day+'" , "'+data.p1_us_night+'" , "'+data.p2+'" , "'+data.pic_day+'" , "'+data.pic_night+'" , "'+data.stl+'" , "'+data.reliefCrew1+'" , "'+data.reliefCrew2+'" , "'+data.reliefCrew3+'" , "'+data.reliefCrew4+'" , "'+data.route+'" , "'+data.sic_day+'" , "'+data.sic_night+'" , "'+data.sim_instructional+'" , "'+data.sim_instrument+'" , "'+data.selected_role+'" , "'+data.student+'" , "'+data.timeCustom1+'" , "'+data.timeCustom2+'" , "'+data.timeCustom3+'" , "'+data.timeCustom4+'" , "'+data.timeCustom5+'" , "'+data.timeCustom6+'" , "'+data.timeCustom7+'" , "'+data.timeCustom8+'" , "'+data.timeCustom9+'" , "'+data.timeCustom10+'" , "'+data.to_airportID+'" , "'+data.to_altitude+'" , "'+data.to_city+'" , "'+data.to_country+'" , "'+data.to_dayLightSaving+'" , "'+data.to_source+'" , "'+data.to_lat+'" , "'+data.to_long+'" , "'+data.to_name+'" , "'+data.to_nameIATA+'" , "'+data.to_nameICAO+'" , "'+data.to_timeZone+'" , "'+data.to_type+'" , "'+data.to_dst_status+'" , "'+data.totalTime+'" , "'+data.touch_n_gos+'" , "'+data.waterLanding+'" , "'+data.waterTO+'" , "'+data.x_country_day+'" , "'+data.x_country_night+'" , "'+data.x_country_day_leg+'" , "'+data.x_country_night_leg+'" , "'+data.outTime_LT+'" , "'+data.offTime_LT+'" , "'+data.onTime_LT+'" , "'+data.inTime_LT+'" , "'+data.sim_type+'" , "'+data.sim_exercise+'" , "'+data.pf_hours+'" , "'+data.pm_hours+'" , "'+data.sfi_sfe+'" , "'+data.simCustom1+'" , "'+data.simCustom2+'" , "'+data.simCustom3+'" , "'+data.simCustom4+'" , "'+data.simCustom5+'","'+data.simLocation+'","'+data.p1_ut_day+'","'+data.p1_ut_night+'","'+data.remark+'","'+data.autolanding+'","'+data.flight_date+'","'+data.selected_flight_timelog+'","'+data.imported_log+'","'+orderedDate+'")',
              );
              //console.log('index:', index+1) 
              //console.log('SyncedData Length',syncData.data.length )
              //dataDispatcher(ProgressData({ProgressValue: index+1, totalvalue: syncData.data.length}))
              if((index+1) == syncData.data.length ){
              let temData = [];
              db.transaction(tx => {
              tx.executeSql('SELECT id,tag,serverId,date,aircraftType,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime,orderedDate from logbook WHERE user_id = "'+user.id+'" ORDER BY orderedDate DESC limit 10', [], (tx, result) => {
                  //setOffset(offset + 10);
                  for (let i = 0; i < result.rows.length; i++) {
                    temData.push({
                          id : result.rows.item(i).id,
                          tag : result.rows.item(i).tag,
                          serverId : result.rows.item(i).serverId,
                          date: result.rows.item(i).date,
                          aircraftType : result.rows.item(i).aircraftType,
                          from_lat : result.rows.item(i).from_lat,
                          from_long : result.rows.item(i).from_long,
                          from : result.rows.item(i).from_nameICAO, 
                          chocksOffTime : result.rows.item(i).offTime, 
                          chocksOnTime : result.rows.item(i).onTime,
                          outTime : result.rows.item(i).outTime,
                          inTime : result.rows.item(i).inTime,
                          p1 : result.rows.item(i).p1,
                          p2 : result.rows.item(i).p2,
                          to : result.rows.item(i).to_nameICAO,
                          to_lat :  result.rows.item(i).to_lat,
                          to_long : result.rows.item(i).to_long,
                          orderedDate : result.rows.item(i).orderedDate,
                      });
                    dataDispatcher(LogListData({data: temData,inProgress: true, downloadCount: syncData.data.length}))
                    //console.log('data fetch '+ i +' out of '+ result.rows.length);
                    
                  }
                  setLoad(false)
                });
            }); //  transition end
          } // if end
          })
        })
      })
    }

    return (
        <SafeAreaView style={[BackupStyle.container, {backgroundColor: theme.backgroundColor}]}>

          <View style={BackupStyle.Topheader}>
            <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
            <Text style={BackupStyle.aircrafts}>Backup</Text>
            </View>
            
            <ImageBackground source={require('../images/backupBg.png')}
                imageStyle={{
                    resizeMode: "cover",
                    opacity: 0.2,
                }}
                style={BackupStyle.backgroundImage}>
                    <View style={BackupStyle.headlineView}>
                        <Text style={dark?BackupStyle.DarkHeadlineText:BackupStyle.headlineText}>Backup</Text>
                    </View>
                    {load===true ?
                      <View style={BackupStyle.centeredView}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                      >
                        <View style={BackupStyle.centeredView}>
                          <View style={BackupStyle.modalView}>
                            {/* <Text style={styles.modalText}>Logs are Downloading!!</Text> */}
                            <ActivityIndicator color={'#fff'} />
                            <Text style={{ color: '#fff' }}>Syncing Data ....</Text>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    :  null
                    }
                    <View style={BackupStyle.innerImage}>
                    <Image
                        style={BackupStyle.Vector}
                        source={require('../images/Vector.png')}
                    />
                    <View style={{paddingTop:10,}}>
                    <TouchableOpacity onPress={()=>{handelDate();backupFunc()}}>
                        <View style={BackupStyle.button}>
                        <Text style={BackupStyle.buttonText}>Backup/Sync Now</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                    </View>
                    <View style={{paddingTop: 10}}>
                    <Text style={dark?{color:'#fff'}:{color:'#000'}}>Last Backup : {cdate}</Text>
                    </View>
                </ImageBackground>
        
        </SafeAreaView>
    );
};

// define your BackupStyle


//make this component available to the app
export default Backup;
