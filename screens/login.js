//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableOpacity, Alert, Modal, Pressable,Platform } from 'react-native';
import Colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { LogListData } from '../store/actions/loglistAction';
import {ProgressData} from '../store/actions/progressAction';
import { LoginData } from '../store/actions/loginAction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlyingData } from '../store/actions/flyingAction'


import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';
// import axios from 'axios';

// const BASE_URL = 'https://dummyapi.io/data/api';
// const APP_ID = '60ed8864a110fb2c8dc22dff';


// create a component
import SQLite from 'react-native-sqlite-storage';
import { ActivityIndicator } from 'react-native-paper';

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

const Login = ({navigation}) => {

  const [email, setEmail] = React.useState(''); //anantmathur1@yahoo.co.in//nupur1@gmail.com //aviatorrishabh@gmail.com
  const [pwd, setPwd] = React.useState(''); //Fighters12//1234 //riturishi
  const [loading, setLoading] = React.useState(true)
  const [offset, setOffset] = React.useState(1)
  const [forgotModalVisible, setForgotModalVisible] = React.useState(false)
  const [forgotEmail, setForgotEmail] = React.useState('')
  const [localData, setLocalData]= React.useState([])
  const [show, setShow] =React.useState(true)

  const dataDispatcher = useDispatch();

  const myfun = async() => {
    setShow(false)
    dataDispatcher(LogListData({data: []}))
    //Alert.alert(petname);
    await fetch(Platform.OS==='ios'?BaseUrl + 'login' : BaseUrlAndroid + 'login',{
        method : 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email":email,
          "password":pwd,
    })
    }).then(res => res.json())
    .then(resData => {
       //console.log(resData)
       //Alert.alert(resData.msg);
       if(resData.msg === 'loggedin'){
        AsyncStorage.setItem('id', JSON.stringify(resData.data.id));
        //console.log(resData.data.id)
        AsyncStorage.setItem(
          'userdetails',
          JSON.stringify({
            id: resData.data.id,
            name: resData.data.name,
            email: resData.data.email,
            password: resData.data.password,
            r_id : resData.data.roaster_id,
            r_pwd : resData.data.roaster_pass,
            airline_type: resData.data.airline_type,
            mobile : resData.data.mobile_number,
            profile_pic : resData.data.profile_pic,
            registrationDate : resData.data.registrationDate,
            lT : resData.data.licance_type,
            lN : resData.data.licance_number,
            country : resData.data.country,
            validity : resData.data.validity,
            profile_pic : resData.data.profile_pic,
            subscribe : resData.data.subscribe,
            rosterLength: resData.data.rosterLength,
            freeHours: resData.data.freeHours,
          }),
        )
        //console.log('reg-date',resData.data.registrationDate )
        db.transaction((tx) => {
          tx.executeSql(
        'INSERT INTO userProfileData (user_id,name,email,Contact,roster_id,roster_pwd,airline_type,reg_date,LicenceNumber,LicenceType,Country,validity,profile_pic,subscribe,rosterLength,freeHours) VALUES ("'+resData.data.id+'","'+resData.data.name+'","'+resData.data.email+'","'+resData.data.mobile_number+'","'+resData.data.roaster_id+'","'+resData.data.roaster_pass+'","'+resData.data.airline_type+'","'+resData.data.registrationDate+'","'+resData.data.licance_number+'","'+resData.data.licance_type+'","'+resData.data.country+'","'+resData.data.validity+'","'+resData.data.profile_pic+'","'+resData.data.subscribe+'","'+resData.data.rosterLength+'","'+resData.data.freeHours+'")',
        );
        });
        navigation.navigate('SettingScreen')

        fetch(Platform.OS==='ios'?BaseUrl+'display_logbook':BaseUrlAndroid+'display_logbook',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "user_id": resData.data.id,
        })
      }).then(response => response.json())
      .then(syncBuildLogbookData => {
         if (syncBuildLogbookData.message.length !== 0){
          syncBuildLogbookData.message.map((BLdata, index) => {
            //console.log('synced BLdata',BLdata.aircraft_name)
            db.transaction((tx) => {
              tx.executeSql(
            'INSERT INTO buildlogbook (id,user_id,aircraft_id,aircraft_type,category,engine,engine_name,engine_class,engine_crew,day_pic,day_sic,day_p1_us,day_p1_ut,total,night_pic,night_sic,night_p1_us,night_p1_ut,night_total,total_flying_time,instrumental_time_actual,instrumental_time_simulated,simulator,instructional_flying_day,instructional_flying_night,instructional_flying_total,day_to,night_to,day_landing,night_landing,day_dual,night_dual,remark,key,lastUpdatedDate,stl_day,stl_night,stl_total) VALUES ("'+BLdata.id+'","'+resData.data.id+'","'+BLdata.aircraftRegNo+'","'+BLdata.aircraft_name+'","'+BLdata.category+'","'+BLdata.engine+'","'+BLdata.engine_name+'","'+BLdata.engine_class+'","'+BLdata.engine_crew+'","'+BLdata.day_pic+'","'+BLdata.day_sic+'","'+BLdata.day_p1_us+'","'+BLdata.day_p1_ut+'","'+BLdata.total+'","'+BLdata.night_pic+'","'+BLdata.night_sic+'","'+BLdata.night_p1_us+'","'+BLdata.night_p1_ut+'","'+BLdata.night_total+'","'+BLdata.total_flying_time+'","'+BLdata.instrumental_time_actual+'","'+BLdata.instrumental_time_simulated+'","'+BLdata.simulator+'","'+BLdata.instructional_flying_day+'","'+BLdata.instructional_flying_night+'","'+BLdata.instructional_flying_total+'","'+BLdata.day_to+'","'+BLdata.night_to+'","'+BLdata.day_landing+'","'+BLdata.night_landing+'","'+BLdata.day_dual+'","'+BLdata.night_dual+'","'+BLdata.remark+'","'+BLdata.key+'","'+BLdata.lastUpdatedDate+'","'+BLdata.stl_day+'","'+BLdata.stl_night+'","'+BLdata.stl_total+'")',
            );
              })
            })
          }
        })
        
        fetch(Platform.OS==='ios'?BaseUrl+'listlogbook':BaseUrlAndroid+'listlogbook',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "user_id": resData.data.id,
        })
      }).then(response => response.json())
      .then(syncData => {
         if (syncData.data.length !== 0){
         syncData.data.map((data, index) => {
            console.log('synced data',syncData.data.length)
            const takeoffTime = data.offTime===''?data.outTime : data.offTime;
            const LandingTime = data.onTime===''?data.inTime : data.onTime;
            console.log('data.date',data.date)
            var d = new Date(data.date);
            let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
            if(day<10) {day = "0" + day}
            if (month < 10) { month = "0" + month; }
            //console.log('exact month',month)
            const PerfectDate = day+"-"+month+"-"+year
            //console.log(day+"-"+month+"-"+year)
            const orderedDate = year+month+day;
            //console.log('times', takeoffTime,LandingTime)
            const conditonalP1 = data.p1 === 'SELF' ? 'Self' : data.p1 
            const nameAircrfat = data.aircraftType === '13122017071818455'  ? 'A-320' : data.aircraftType === '31052021095435455' ? 'A-321': data.aircraftType === '04092020174148455' ? 'A-320' : data.aircraftType
            // console.log('original', data.aircraftType)
            // console.log('fake', nameAircrfat)
            db.transaction((tx) => {
              tx.executeSql(
            'INSERT INTO logbook (tag,serverId, user_id, flight_no, date, day,  actual_Instrument, aircraftReg, aircraftType, approach1, approach2, approach3, approach4, approach5, approach6, approach7, approach8, approach9, approach10, crewCustom1, crewCustom2, crewCustom3, crewCustom4, crewCustom5, dayLanding, dayTO, dual_day, dual_night, flight, from_airportID, from_altitude, from_city, from_country, from_dayLightSaving, from_source, from_lat, from_long, from_name, from_nameICAO, from_nameIATA, from_timeZone, from_type, from_dst_status, fullStop, ifr_vfr, instructional, instructor, inTime, landingCustom1, landingCustom2, landingCustom3, landingCustom4, landingCustom5, landingCustom6, landingCustom7, landingCustom8, landingCustom9, landingCustom10, night,nightLanding, nightTO, offTime, onTime, outTime, p1, p1_us_day, p1_us_night, p2, pic_day, pic_night, stl, reliefCrew1, reliefCrew2, reliefCrew3, reliefCrew4, route, sic_day, sic_night, sim_instructional, sim_instrument, selected_role, student, timeCustom1, timeCustom2, timeCustom3, timeCustom4, timeCustom5, timeCustom6, timeCustom7, timeCustom8, timeCustom9, timeCustom10, to_airportID, to_altitude, to_city, to_country, to_dayLightSaving, to_source, to_lat, to_long, to_name, to_nameIATA, to_nameICAO, to_timeZone, to_type, to_dst_status, totalTime, touch_n_gos, waterLanding, waterTO, x_country_day, x_country_night, x_country_day_leg, x_country_night_leg, outTime_LT, offTime_LT, onTime_LT, inTime_LT, sim_type, sim_exercise, pf_time, pm_time, sfi_sfe, simCustom1, simCustom2, simCustom3, simCustom4, simCustom5, simLocation, p1_ut_day, p1_ut_night, remark, autolanding, flight_date, selected_flight_timelog, imported_log, orderedDate,purpose1) VALUES ("'+data.tag+'","'+data.id+'","'+resData.data.id+'","'+data.flight_no+'","'+PerfectDate+'","'+data.day+'","'+data.actual_Instrument+'","'+data.aircraftReg+'","'+nameAircrfat+'","'+data.approach1+'","'+data.approach2+'","'+data.approach3+'","'+data.approach4+'","'+data.approach5+'","'+data.approach6+'","'+data.approach7+'","'+data.approach8+'","'+data.approach9+'","'+data.approach10+'","'+data.crewCustom1+'","'+data.crewCustom2+'","'+data.crewCustom3+'","'+data.crewCustom4+'","'+data.crewCustom5+'","'+data.dayLanding+'" , "'+data.dayTO+'" , "'+data.dual_day+'" , "'+data.dual_night+'" , "'+data.flight+'" , "'+data.from_airportID+'" , "'+data.from_altitude+'" , "'+data.from_city+'" , "'+data.from_country+'" , "'+data.from_dayLightSaving+'" , "'+data.from_source+'" , "'+data.from_lat+'" , "'+data.from_long+'" , "'+data.from_name+'" ,"'+data.from_nameICAO+'" , "'+data.from_nameIATA+'" , "'+data.from_timeZone+'" , "'+data.from_type+'" , "'+data.from_dst_status+'" , "'+data.fullStop+'" , "'+data.ifr_vfr+'" , "'+data.instructional+'" , "'+data.instructor+'" , "'+data.inTime+'" , "'+data.landingCustom1+'" , "'+data.landingCustom2+'" , "'+data.landingCustom3+'" , "'+data.landingCustom4+'" , "'+data.landingCustom5+'" , "'+data.landingCustom6+'" , "'+data.landingCustom7+'" , "'+data.landingCustom8+'" , "'+data.landingCustom9+'" , "'+data.landingCustom10+'" , "'+data.night+'" , "'+data.nightLanding+'" , "'+data.nightTO+'" , "'+takeoffTime+'" , "'+LandingTime+'" , "'+data.outTime+'" , "'+conditonalP1+'" , "'+data.p1_us_day+'" , "'+data.p1_us_night+'" , "'+data.p2+'" , "'+data.pic_day+'" , "'+data.pic_night+'" , "'+data.stl+'" , "'+data.reliefCrew1+'" , "'+data.reliefCrew2+'" , "'+data.reliefCrew3+'" , "'+data.reliefCrew4+'" , "'+data.route+'" , "'+data.sic_day+'" , "'+data.sic_night+'" , "'+data.sim_instructional+'" , "'+data.sim_instrument+'" , "'+data.selected_role+'" , "'+data.student+'" , "'+data.timeCustom1+'" , "'+data.timeCustom2+'" , "'+data.timeCustom3+'" , "'+data.timeCustom4+'" , "'+data.timeCustom5+'" , "'+data.timeCustom6+'" , "'+data.timeCustom7+'" , "'+data.timeCustom8+'" , "'+data.timeCustom9+'" , "'+data.timeCustom10+'" , "'+data.to_airportID+'" , "'+data.to_altitude+'" , "'+data.to_city+'" , "'+data.to_country+'" , "'+data.to_dayLightSaving+'" , "'+data.to_source+'" , "'+data.to_lat+'" , "'+data.to_long+'" , "'+data.to_name+'" , "'+data.to_nameIATA+'" , "'+data.to_nameICAO+'" , "'+data.to_timeZone+'" , "'+data.to_type+'" , "'+data.to_dst_status+'" , "'+data.totalTime+'" , "'+data.touch_n_gos+'" , "'+data.waterLanding+'" , "'+data.waterTO+'" , "'+data.x_country_day+'" , "'+data.x_country_night+'" , "'+data.x_country_day_leg+'" , "'+data.x_country_night_leg+'" , "'+data.outTime_LT+'" , "'+data.offTime_LT+'" , "'+data.onTime_LT+'" , "'+data.inTime_LT+'" , "'+data.sim_type+'" , "'+data.sim_exercise+'" , "'+data.pf_hours+'" , "'+data.pm_hours+'" , "'+data.sfi_sfe+'" , "'+data.simCustom1+'" , "'+data.simCustom2+'" , "'+data.simCustom3+'" , "'+data.simCustom4+'" , "'+data.simCustom5+'","'+data.simLocation+'","'+data.p1_ut_day+'","'+data.p1_ut_night+'","'+data.remark+'","'+data.autolanding+'","'+data.flight_date+'","'+data.selected_flight_timelog+'","'+data.imported_log+'","'+orderedDate+'","'+data.timeCustom1+'")',
            );

            // tx.executeSql(
            //   'INSERT INTO EGCADetails (user_id,FlightType) VALUES ("'+resData.data.id+'","'+data.timeCustom2+'")'
            // );

            localData.push(data.totalTime)
            //console.log('Total Time Array',  localData)

            var TotalTime = 0;
            var Total_time1 = '';
            // console.log(localLogbookData)
            localData.map(d => {
              // // total  flying hours
              //console.log(d)
              
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
                //console.log(Total_time1)
                //console.log(Total_time1);
                if (isNaN(Total_time1[1])) {
                  Total_time1[1] = '0'
                }
              })

            dataDispatcher(FlyingData({totalFlyingHours: Total_time1}))
            tx.executeSql(
              'UPDATE userProfileData set Total_flying_hours = "'+Total_time1+'" where user_id="'+resData.data.id+'"'
              );

            dataDispatcher(ProgressData({ProgressValue: index+1, totalvalue: syncData.data.length}))
            if((index+1) == syncData.data.length ){
            let temData = [];
            db.transaction(tx => {
            tx.executeSql('SELECT id,tag,serverId,date,aircraftType,from_lat,from_long,from_nameICAO,offTime,onTime,p1,p2,to_nameICAO,to_lat,to_long,outTime,inTime,orderedDate,purpose1,timeCustom2 from logbook WHERE user_id = "'+resData.data.id+'" ORDER BY orderedDate DESC, onTime DESC limit 100', [], (tx, result) => {
                //setOffset(offset + 10);
                for (let i = 0; i < result.rows.length; i++) {
                  const chocksOFF =  result.rows.item(i).offTime.split(':')
                  if(chocksOFF[0]<10){
                    chocksOFF[0] = '0'+chocksOFF[0]
                  }
                  const getChocksOff = chocksOFF[0]+':'+chocksOFF[1]

                  const chocksON = result.rows.item(i).onTime.split(':')
                  if(chocksON[0]<10){
                    chocksON[0] = '0'+chocksON[0]
                  }
                  const getChocksOn = chocksON[0]+':'+chocksON[1]
              
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
                        purpose1 : result.rows.item(i).purpose1,
                        timeCustom2 : result.rows.item(i).timeCustom2,
                    });

                    dataDispatcher(LogListData({data: temData,inProgress: true, downloadCount: syncData.data.length}))
                  }
              });
          }); //  transition end
        } // if end
        })
      })
    }
   else{
      dataDispatcher(LogListData({data: [],inProgress: true, downloadCount: syncData.data.length}))
    }
   })
    }
      else {
         Alert.alert('Incorrect credentials')
       }
    });
    setShow(true)
 }

 const ForgotPassword = async() => {

  await fetch(Platform.OS==='ios'?BaseUrl+'forgot_password':BaseUrlAndroid+'forgot_password',{
    method : 'POST',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      "email": forgotEmail,                 
 })
}).then(res => res.json())
.then(resData => {
   //console.log(resData);
   if(forgotEmail===''){
     Alert.alert('Email Field is required')
   }
   else{
   Alert.alert(resData.message);
    setForgotModalVisible(false)
   }
});
 }

  return (
    <ImageBackground source={require('../images/loginbg.png')}
      imageStyle={{
        resizeMode: "cover",
        opacity: 0.2,
        //alignSelf: "flex-end"
      }}
      style={styles.backgroundImage}>
      <View style={{ width: '100%', paddingHorizontal: 30 }}>
        <View style={forgotModalVisible ? [styles.card,{backgroundColor:'rgba(0,0,0,0.2)'}] : styles.card}>
          <Text style={styles.login}>Login</Text>
          <Text style={styles.mainLine}>Please enter your email & {'\n'} phone</Text>

          <View style={styles.inputBox}>
            <Icon name="envelope" size={20} color='#266173' style={styles.icon} />
            <TextInput style={styles.textInputBox} 
            placeholder='email' 
            placeholderTextColor="#266173" 
            value={email}
            onChangeText={email => setEmail(email)}/>
          </View>
          <View style={styles.inputBox}>
            <Icon name="unlock-alt" size={20} color='#266173' style={styles.icon} />
            <TextInput style={styles.textInputBox} 
            placeholder='Password' 
            placeholderTextColor="#266173" 
            value={pwd}
            onChangeText={pwd => setPwd(pwd)}/>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={forgotModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setForgotModalVisible(!forgotModalVisible);
                    }}
                >
                    <View style={styles.FlightcenteredView}>
                        <View style={styles.flightModalView}>
                            
                            <View style={{paddingVertical:10, alignItems:'center'}}>
                            <MaterialCommunityIcons name="check-circle-outline" color={'#000'} size={50} style={{}}/>
                            <Text style={styles.modalText}>Change Password</Text>
                            </View>

                            <View style={{backgroundColor: '#EFEFEF', padding:10, borderRadius: 10,elevation:5}}>
                            <Text style={styles.modalText}>Please Enter Registered Email Id</Text>
                            <View style={{padding:10}}>
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor='#D0D0D0'
                                style={styles.modalViewTextInput} 
                                value={forgotEmail}
                                onChangeText={(text)=>setForgotEmail(text)}
                                />
                            </View>
                            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                                <Pressable
                                    style={[styles.Modalbutton, styles.buttonClose]}
                                    onPress={() => {ForgotPassword()}}
                                    >
                                    <Text style={styles.textStyle}>OK</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.Modalbutton, styles.buttonClose]}
                                    onPress={() => setForgotModalVisible(!forgotModalVisible)}>
                                    <Text style={styles.textStyle}>CANCEL</Text>
                                </Pressable>
                            </View>
                            </View>
                         
                         </View>
                    </View>
                </Modal>
          <TouchableOpacity onPress={()=> setForgotModalVisible(!forgotModalVisible)} style={styles.fullWidth}>
            <Text style={[styles.mainLine, styles.alignRight]}>Forgot password ?</Text>
          </TouchableOpacity>
          {show===false?<ActivityIndicator color='#000'/>:<TouchableOpacity onPress={myfun}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>}
          
            <View style={{flexDirection:'row'}}>
              <Text style={styles.mainLine}>Don't have account? </Text>
              <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={[styles.mainLine, styles.link]}>Signup</Text></TouchableOpacity>
            </View>
            {/* <TouchableOpacity onPress={()=>navigation.navigate('subscribe')}><Text style={[styles.mainLine, styles.link1]}>Subscribe</Text></TouchableOpacity> */}
        </View>
      </View>
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
    //height: Dimensions.get('window').height * 1.3,
  },
  fullWidth:{
    width:'100%',
  },
  card: {
    backgroundColor: '#E6FAFF',
    alignItems: 'center',
    borderRadius: 50,
    opacity: 0.9,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 50,
    shadowOpacity: 0.5,
    shadowColor: 'black',
    elevation: 8,
  },
  login: {
    fontFamily: 'AbrilFatface-Regular',
    fontSize: 34,
    color: Colors.primary,
  },
  mainLine: {
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
    color: Colors.accent,
  },
  alignRight: {
    alignContent: 'flex-end',
    textAlign: 'right',
    width: '100%'
  },
  button: {
    backgroundColor: Colors.primary,
    marginTop: 50,
    padding: 15,
    //alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    minWidth: 330,
    maxWidth: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  link: {
    color: '#0d70f2',
    fontSize: 15,
    textAlign:'center',
    marginLeft: 7,
  },
  link1: {
    color: '#0d70f2',
    fontSize: 20,
    textAlign:'center',
    marginLeft: 7,
  },
  icon: {
    marginHorizontal:5,
    marginTop: 15,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  inputBox: {
    flexDirection: 'row',
    marginTop:20,
    borderBottomWidth: 0.8,
    width:'100%',
    maxWidth:'100%',
    position: 'relative',
    paddingLeft: 40,
    height: 50,
  },
  textInputBox:{
    width: '100%',
    color: '#266173'
  },
  FlightcenteredView:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
flightModalView:{
  //marginLeft: '5%',
  backgroundColor: "white",
  borderRadius:10,
  //padding: 10,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  width:'80%',
  height:'25%',
  //position: 'absolute',
  //bottom: '1%'
},
modalText:{
  fontSize:11,
  //fontFamily:'AbrilFatface-Regular'
},
Modalbutton: {
  borderRadius: 20,
  padding: 5,
  //elevation: 2,
  width: '45%',
},
buttonOpen: {
  backgroundColor: "#F194FF",
},
buttonClose: {
  backgroundColor: "#256173",
},
textStyle:{
  color:'#fff',
  textAlign:'center',
  fontSize:10
},
modalViewTextInput:{
  padding:10,
  backgroundColor:'#fff',
  borderRadius:5,
  color:'#000',
},
});

//make this component available to the app
export default Login;
