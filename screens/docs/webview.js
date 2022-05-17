// window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} + 1 , success:true, error:false}));
// window.location.href=("https://www.dgca.gov.in/digigov-portal/web?requestType=ApplicationRH&actionVal=checkLogin")
import React, { Component } from 'react';
import { View, Modal, StyleSheet, Text, StatusBar, TouchableOpacity,Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, ProgressBar, Colors } from 'react-native-paper';
import { connect } from "react-redux";
import { docReducer } from '../../store/reducers/docReducer';
import { allreducers } from '../../App1'
import { EGCADetailsReducer } from '../../store/reducers/egcaDetailsReducer';
import SQLite from 'react-native-sqlite-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LogListData } from '../../store/actions/loglistAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import {BaseUrl} from '../../components/url.json';
import {BaseUrlAndroid} from '../../components/urlAndroid.json';


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
// let data = Data
class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewUrl: 'https://www.dgca.gov.in/digigov-portal/web?requestType=ApplicationRH&actionVal=checkLogin',
      index: 0,
      arrDate: null,
      depDate: null,
      loading: true,
      egcaData: null,
      egcaUploadedData: null,
      airCraftReg: "",
      success: false,
      uploadedId: '',
      progress: 1,
      visible: false,
      error: null,
      purpse: [],
      PIC: '',
      SIC:'',
      chocksOffTime: '',
      chocksOnTime: '' ,
    };
  }
  componentDidMount = () => {
    this.getFiltered();
  }


  ////// TO GET SELECTED LOGS AND EGCA DETAILS /////
  getFiltered = async () => {
    var logData = this.props.logData.docs.selectedData.selectedData;
    var EData = this.props.egcaDetail.Egcadata;
    var uploadedEData = EData.data.data
    let arrival = logData[this.state.index].date;
    
    const ar = new Date(arrival);
    var arDay = ar.getDate() < 10 ? '0' + ar.getDate() : ar.getDate()
    var arMonth = ar.getMonth()+1 < 10 ? '0' + Number(ar.getMonth()+1) : ar.getMonth()+1
    var arYear = ar.getFullYear()
    const arr = arDay+'/'+arMonth+'/'+arYear;
    
    let departure = logData[this.state.index].date;
    const de = new Date(departure)
    var deDay = de.getDate() < 10 ? '0' + de.getDate() : de.getDate()
    var deMonth = de.getMonth()+1 < 10 ? '0' + Number(de.getMonth()+1) : de.getMonth()+1
    var deYear = de.getFullYear()
    let dep = deDay+'/'+deMonth+'/'+deYear;

    var p = logData[this.state.index].timeCustom1;
    var pur = p.split(",");
    var Pic_Name = logData[this.state.index].p1 ==='Self'? logData[this.state.index].p1 : logData[this.state.index].p1.split("(")
    var Pic_Name_Split =  Pic_Name === 'Self' ? Pic_Name : Pic_Name[1].split(")")
    var Sic_Name =  logData[this.state.index].p2 ==='Self'? logData[this.state.index].p2 : logData[this.state.index].p2.split("(")
    var Sic_Name_Split = Sic_Name === 'Self' ? Sic_Name : Sic_Name[1].split(")")
    const takeOffTime =logData[this.state.index].offTime.split(":");
    const landingTime=logData[this.state.index].onTime.split(":");
     
    const chokOff = Number(takeOffTime[0]) < 10 ? "0" + takeOffTime[0] + ":" + takeOffTime[1] : takeOffTime[0] + ":" + takeOffTime[1]
    const chokOn = Number(landingTime[0]) < 10 ? "0" + landingTime[0] + ":" + landingTime[1] : landingTime[0] + ":" + landingTime[1]

    this.setState({
      egcaData: logData,
      egcaUploadedData: uploadedEData,
      loading: false,
      purpse: pur,
      PIC: Pic_Name === 'Self' ? Pic_Name_Split : Pic_Name_Split[0] ,
      SIC: Sic_Name === 'Self' ? Sic_Name_Split : Sic_Name_Split[0],
      chocksOffTime: chokOff,
      chocksOnTime: chokOn,
    })

    if (logData[this.state.index].aircraftReg[2] !== '-') {
      this.setState({ airCraftReg: logData[this.state.index].aircraftReg.substr(0, 2) + "-" + logData[this.state.index].aircraftReg.substr(2, 5) })
    }
    else {
      console.log('no error')
    }

   
    

    if (Number(takeOffTime[0]) > Number(landingTime[0])) {
      let date = logData[this.state.index].date
      let newDate = new Date(date)
      let tomorrow =  new Date()
      tomorrow.setDate(newDate.getDate() + 1)
      var nextDay = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate()
    var nextMonth = tomorrow.getMonth()+1 < 10 ? '0' + Number(tomorrow.getMonth()+1) : tomorrow.getMonth()+1
    var nextYear = tomorrow.getFullYear()
      const arrivalDate = nextDay + "/" + nextMonth + "/" +  nextYear
      this.setState({
        arrDate: arrivalDate,
        depDate: dep,
      })
    }
    else {
      this.setState({
        arrDate: arr,
        depDate: dep,
      })
      console.log("no error")
    }
  }

 

  //// TO UPDATE INDEX ///
  updateIndex = async () => {
    const value = await AsyncStorage.getItem('result');
    if (value !== null) {
      const dt = JSON.parse(value)
      this.setState({
        index: dt.index,
        success: dt.success,
        error: dt.error,
      });
      this.getFiltered();
      this.updateLogTags();
    }
    else {
      console.log('value is equal to null')
    }
  }

  //// TO GET EGCA RESPONSE ///
  updateLogTags = async () => {
    const value = await AsyncStorage.getItem('result');
    if (value !== null) {
      const logRes = JSON.parse(value)
      console.log('logRes',logRes.id)
      if (logRes.success !== false) {
        let id = Number(logRes.id)
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        await fetch(Platform.OS==='ios'?BaseUrl + 'updateLogbook':BaseUrlAndroid + 'updateLogbook', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "user_id": user.id,
              "local_id": logRes.id,
              "tag": 'uploaded'
              
          })
      }).then(res => res.json())
          .then(resData => {
              console.log('server data',resData);
          });
        let allSuccess = await AsyncStorage.getItem('success');
        allSuccess = JSON.parse(allSuccess) == null ? [] : JSON.parse(allSuccess)
        // console.log("sucess of log upload" , allSuccess)
        prePopulateddb.transaction(tx => {
          tx.executeSql('UPDATE logbook set tag="uploaded" WHERE user_id = "' + user.id + '" AND  id = "' + logRes.id + '"')
          let Data = [];
          let SingleResult = '';
          prePopulateddb.transaction(tx => {
            tx.executeSql('SELECT * from logbook WHERE user_id = "' + user.id + '" AND  id = "' + logRes.id + '"', [], (tx, result) => {
              if (result.rows.length > 0) {
                for (let i = 0; i <= result.rows.length; i++) {
                  SingleResult = {
                    id: result.rows.item(i).id,
                    tag: result.rows.item(i).tag,
                    date: result.rows.item(i).date,
                    aircraftType: result.rows.item(i).aircraftType,
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
                    orderedDate: result.rows.item(i).orderedDate,
                  }
                  Data.push(SingleResult)
                  this.props.LogListData({ data: Data, inProgress: false })
                  var successData = [...allErrors, temData];
                 AsyncStorage.setItem('success', JSON.stringify(successData));
                }
              }
              else {
                this.props.navigation.navigate('Docs')
                alert('can\'t update')
              }
            })
          });
        });
      } else if (logRes.error == true) {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let allErrors = await AsyncStorage.getItem('failed');
        allErrors = JSON.parse(allErrors) == null ? [] : JSON.parse(allErrors)
        prePopulateddb.transaction(tx => {
          tx.executeSql('SELECT * from logbook WHERE user_id = ' + user.id + ' AND id = ' + logRes.id + ' AND tag = "manual" ', [], async (tx, result) => {
            if (result.rows.length == 0) {
              console.log('no data to load')
              return false;
            }
            for (let i = 0; i <= result.rows.length; i++) {
              let temData = {
                id: result.rows.item(i).id,
                tag: result.rows.item(i).tag,
                date: result.rows.item(i).date,
                from: result.rows.item(i).from_nameICAO,
                to: result.rows.item(i).to_nameICAO,
                chocksOffTime: result.rows.item(i).offTime,
                chocksOnTime: result.rows.item(i).onTime,
              }
              var saveddata = [...allErrors, temData];
        console.log('allErrors',saveddata)

              await AsyncStorage.setItem('failed', JSON.stringify(saveddata));
            }
          });
        });
      }
    }
    else {
    }
  }
  ///////  ------------  TO COMMUNICATE BETWEEN REACT NATIVE AND WEBVIEW  -----------  ///////////
  onMessage = async (key) => {
    const data = JSON.parse(key.data)
    this.setState({
      progress: data.index / this.state.egcaData.length,
      visible: data.visible
    })
    if (data.index <= this.state.egcaData.length - 1) {
      await AsyncStorage.setItem('result', JSON.stringify(data));
      this.updateIndex();
    }
    else {
      await AsyncStorage.setItem('result', JSON.stringify(data));
      this.setState({
        progress: data.index / this.state.egcaData.length,
        visible: false
      })
      this.updateLogTags()
      this.props.navigation.navigate('Docs')
    }
  }

  injectJs = (dataPos, arrD, depD, airCraftReg, err , PiC ,SiC , chocksOff , chocksOn) => {
    const injectData =
      `if (window.location.href === "https://www.dgca.gov.in/digigov-portal/jsp/dgca/common/login.jsp") {
        
                setTimeout(function () {
                document.querySelector('#username').value = '${this.state.egcaUploadedData[0].egcaId}';
                document.querySelector('#password ').value = '${this.state.egcaUploadedData[0].egcaPwd}';
              }, 2000)
            
        }
            else if (window.location.href === "https://www.dgca.gov.in/digigov-portal/web?requestType=ApplicationRH&actionVal=checkLogin") {
             
              window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos}, success:false, error:null ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' , from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));
              setTimeout(function () {
                  document.querySelector('#a90000603 ul:nth-child(2) li a').click();
                }, 10000)
            
                setTimeout(function () {
                    document.getElementById('elogbookPrevious').checked = false;
                    document.getElementById('elbScheduledNonScheduled').checked = true;
                    document.getElementById('elbScheduledNonScheduled').onclick();
                    document.getElementById('elbCurrentEntry').checked = true;
                    document.getElementById('elbCurrentEntry').onclick();
                    document.getElementById('btnElbNext').click();
                }, 20000)
            
            
              setTimeout(function () {
                    var ftoToFind = '${this.state.egcaUploadedData[0].FtoOperator}'
                    var Fto = document.getElementById('ftoId');
                    for (var i = 0; i < Fto.options.length; i++) {
                        if (Fto.options[i].text === ftoToFind) {
                            Fto.selectedIndex = i;
                            document.getElementById('aircraftRegMstId').onchange();
                        }
                    }
                    var regToFind = '${airCraftReg}';
                    var Registration = document.getElementById('aircraftRegMstId');
                    for (var i = 0; i < Registration.options.length; i++) {
                        if (Registration.options[i].text === regToFind) {
                            Registration.selectedIndex = i;
                            document.getElementById('aircraftRegMstId').onchange();
                        }
                    }
              }, 25000)
            
            setTimeout(function () {
                if ('${this.state.egcaData[dataPos].instructional}' == "" && '${this.state.egcaData[dataPos].pic_day}' !== '' && '${this.state.egcaData[dataPos].pic_night}' !== '') {
                    document.querySelector('#pilotFuncPic').click();
                    var PicPilot = '${SiC}';
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').value = PicPilot;
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').onkeyup();
                    document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                    var pic = document.getElementById('pilotInCommandIdCurrentEntry');
                    for (var i = 0; i < pic.options.length; i++) {
                        let spl = pic.options[1].text.split("(");
                        let spl1 = spl[1].split(")")
                        if (spl1[0] === PicPilot) {
                            pic.selectedIndex = 1;
                            document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                            break;
                          }
                    }
                }
                else if ('${this.state.egcaData[dataPos].instructional}' !== '') {
                    document.querySelector('#pilotFuncInstructor').click();
                    var InsPilot = '${SiC}';
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').value = InsPilot;
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').onkeyup();
                    document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                    var instP = document.getElementById('pilotInCommandIdCurrentEntry');
                    for (var i = 0; i < instP.options.length; i++) {
                      let inst = instP.options[1].text.split("(");
                        let inst1 = inst[1].split(")")
                        if (inst1[0] === InsPilot) {
                            instP.selectedIndex = 1;
                            document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                            break;
                          }
                    }
                }
                        else if ('${this.state.egcaData[dataPos].sic_day}' !== null && '${this.state.egcaData[dataPos].sic_night}' !== null  ) {
                    let coPilot = '${PiC}';
                    document.querySelector('#pilotFuncCoPilot').click();
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').value = coPilot;
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').onkeyup();
                    document.querySelector('#pilotInCommandIdExaminer').onchange();
                    let coP = document.getElementById('pilotInCommandIdCurrentEntry');
                    for (var i = 0; i < coP.options.length; i++) {
                        let coPil = coP.options[1].text.split("(");
                        let coPil1 = coPil[1].split(")")
                        if (coPil1[0] === coPilot) {
                            coP.selectedIndex = 1;
                            document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                            break;
                        }
                    }
                } 
                        else if ('${this.state.egcaData[dataPos].p1_ut_day}' !== null && '${this.state.egcaData[dataPos].p1_ut_night}' !== null) {
                          var Dual = '${PiC}';
                          document.querySelector('#pilotFuncDual').click();
                          document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').value = Dual;
                          document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').onkeyup();
                          document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                          var p1Ut = document.getElementById('pilotInCommandIdCurrentEntry');
                          for (var i = 0; i < p1Ut.options.length; i++) {
                            let p1UtP = p1Ut.options[1].text.split("(");
                            let p1UtP1 = p1UtP[1].split(")")
                              if (p1UtP1[0] === Dual) {
                                p1Ut.selectedIndex = 1;
                                  document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                                  break;
                              }
                          }
                }
                else if ('${this.state.egcaData[dataPos].p1_us_night} '!== null && '${this.state.egcaData[dataPos].p1_us_day}' !== null) {
                    var p1Pilot = '${PiC}';
                    document.querySelector('#pilotFuncP1Us').click();
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').value = p1Pilot;
                    document.querySelector('#pilotInCommandIdCurrentEntry_chosen #chosenSearchId').onkeyup();
                    document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                    var p1Us = document.getElementById('pilotInCommandIdCurrentEntry');
                    for (var i = 0; i < p1Us.options.length; i++) {
                          let p1UsP = p1Us.options[1].text.split("(");
                          let p1UsP1 = p1UsP[1].split(")")
                        if (p1UsP1[0] === p1Pilot) {
                            p1Us.selectedIndex = 1;
                            document.querySelector('#pilotInCommandIdCurrentEntry').onchange();
                            break;
                        }
                    }
                }
            }, 35000)
            
            
            setTimeout(function () {
              if('${this.state.egcaUploadedData[0].FlightType}' == 'Training'){
                document.querySelector('#flyTrainingTestNormalIdTraining').click();
              }
              else if('${this.state.egcaUploadedData[0].FlightType}' == 'Test'){
                document.querySelector('#flyTrainingTestNormalIdTest').click();
              }
              else if('${this.state.egcaUploadedData[0].FlightType}' == 'Commercial'){
                document.querySelector('#flyCommercialId').click();
              }
              else if('${this.state.egcaUploadedData[0].FlightType}' == 'Non_commercial'){
                document.querySelector('#flyNonCommercialId').click();
              }
                var pue = '${this.state.purpse}'
                var x = pue.split(",")
                var Purpose = document.getElementById('exerciseTypeId');
                for (var p = 0; p < '${this.state.purpse.length}'; p++) {
                                for (var i = 0; i < Purpose.options.length; i++) {
                                    if (Purpose.options[i].text === x[p] ) {
                                        Purpose[i].selected = true;
                                        document.getElementById('exerciseTypeId').onchange();
                                        break;
                                    }
                                }
                }
                document.querySelector('#exerciseTypeId').onchange();
            
                var from = '${this.state.egcaData[dataPos].from_nameICAO}'
                var From = document.getElementById('tkoffAerodrome');
                for (var i = 0; i < From.options.length; i++) {
                    if (From.options[i].text.substring(0, from.length) === from) {
                        From.selectedIndex = i;
                        document.getElementById('tkoffAerodrome').onchange();
                        break;
                    }
                }
                document.querySelector('#departuredate').value = '${depD}';
                document.querySelector('#departuretime').value = '${chocksOff}';
            
                var to = '${this.state.egcaData[dataPos].to_nameICAO}'
                var To = document.getElementById('lndgAerodrome');
                for (var i = 0; i < To.options.length; i++) {
                    if (To.options[i].text.substring(0, from.length) === to) {
                        To.selectedIndex = i;
                        document.getElementById('lndgAerodrome').onchange();
                        break;
                    }
                }
                document.querySelector('#arrivaldate').value = '${arrD}';
                document.querySelector('#arrivaltime').value = '${chocksOn}';
                document.querySelector('#numberOfLandings').value = ${this.state.egcaData[dataPos].nightLanding} + ${this.state.egcaData[dataPos].dayLanding};
                  var myElement = "#showHideCrsCountryDist";
                  if($(myElement).is(":hidden") == false ){
                      document.querySelector('#distance').value = '${this.state.egcaData[dataPos].landingCustom1}';
                  }
              }, 40000)
            
            setTimeout(function () {
                if ('${this.state.egcaData[dataPos].sim_instrument}' !== 'null'){
                document.querySelector('#farInstrumentSimulated').click();
                document.querySelector('#farInstrumentSimulatedTime').value = '${this.state.egcaData[dataPos].sim_instrument}';
            }
            else if ('${this.state.egcaData[dataPos].actual_Instrument}' !== "00:00") {
              document.querySelector('#farInstrumentActual').click();
              document.querySelector('#farInstrumentActualTime').value = '${this.state.egcaData[dataPos].actual_Instrument}';
          }
          else if ('${this.state.egcaData[dataPos].sim_instructional}' == 'null' && '${this.state.egcaData[dataPos].actual_Instrument}' == "") {
            document.querySelector('#farInstrumentActual').click();
            document.querySelector('#farInstrumentSimulated').click();
            document.querySelector('#farInstrumentSimulatedTime').value = '${this.state.egcaData[dataPos].sim_instrument}';
            document.querySelector('#farInstrumentActualTime').value = '${this.state.egcaData[dataPos].actual_Instrument}';
        }
                 
            }, 40000)
            
            setTimeout(function () {
                if ('${this.state.egcaData[dataPos].day}' !== "00:00" && '${this.state.egcaData[dataPos].night}' == "00:00") {
                document.querySelector('#flyTimeIdDay').click();
            }
                        else if ('${this.state.egcaData[dataPos].day}' == "00:00" && '${this.state.egcaData[dataPos].night}' !== "00:00") {
                document.querySelector('#flyTimeIdDay').checked = false;
                document.querySelector('#flyTimeIdNight').click();
            }
                        else if ('${this.state.egcaData[dataPos].day}' !== '00:00' && '${this.state.egcaData[dataPos].night}' !== "00:00" ) {
                document.querySelector('#flyTimeIdDay').checked = false;
                document.querySelector('#flyTimeIdBoth').click();
                document.querySelector('#flightTimeDay').value = '${this.state.egcaData[dataPos].day}';
                document.querySelector('#flightTimeNight').value = '${this.state.egcaData[dataPos].night}';
            }
            }, 50000)
            
            setTimeout(function () {
              document.querySelector('#btnAddAppTrnElbLndgTkOffDtl').click();
              var forVerification = '${this.state.egcaUploadedData[0].AuthVerifier}'
                    var authVerify = document.getElementById('verifiedById');
                    for (var i = 0; i < authVerify.options.length; i++) {
                        if (authVerify.options[i].text === forVerification) {
                          authVerify.selectedIndex = i;
                            document.getElementById('verifiedById').onchange();
                        }
                    }
              var personName = '${this.state.egcaUploadedData[0].NameOfAuthVerifier}'
                    var authPerson = document.getElementById('verifyPersonName');
                    for (var i = 0; i < authPerson.options.length; i++) {
                        if (authPerson.options[i].text === personName) {
                          authPerson.selectedIndex = i;
                        }
                    }
        }, 55000)

        setTimeout(function () {
          document.querySelector('#verificationStatus').click();
          window.confirm = function(){return true;};
          window.alert = function(){return true;};
          document.querySelector('#btnAddSubmit').click();
         
          }, 60000)
        
        setTimeout(function () {
          document.querySelector('#btn_Ok').clicked =true
            document.querySelector('#btn_Ok').onclick();
            if(document.querySelector('#btn_Ok').clicked == true){
              window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} , success:true, error:false ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' ,from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));    
            }
          }, 65000)

        setTimeout(function () {
          if('${err}' == "null"){
            if(${dataPos}+1 == ${this.state.egcaData.length}){
              document.querySelector('#Logout_btn').click();
              document.querySelector('#noFeedback').click();
            window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} +1, success:false, error:true ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' ,from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));
          }
          else{
            window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} +1, success:false, error:true ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' ,from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));
          }
          }
          else {
            if(${dataPos}+1 == ${this.state.egcaData.length}){
              document.querySelector('#Logout_btn').click();
              document.querySelector('#noFeedback').click();
            window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} +1, success:${this.state.success}, error:${this.state.error} ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' ,from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));
          }
          else{
            window.ReactNativeWebView.postMessage(JSON.stringify({index:${dataPos} +1, success:${this.state.success}, error:${this.state.error} ,  id:'${this.state.egcaData[dataPos].id}' , date:'${this.state.egcaData[dataPos].date}' ,from:'${this.state.egcaData[dataPos].to}' , to:'${this.state.egcaData[dataPos].date}' , takeoff: '${this.state.egcaData[dataPos].chocksOffTime}', landing:'${this.state.egcaData[dataPos].chocksOnTime}' ,visible: true}));
          }
          }
        }, 70000)

        setTimeout(function () {
          window.location.href=("https://www.dgca.gov.in/digigov-portal/web?requestType=ApplicationRH&actionVal=checkLogin")
        }, 75000)
       
      };`
    return injectData;
  }
  render() {
    return (

      <SafeAreaView style={{ flex: 1 }}>
        {this.state.loading ?
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" color="#00ff00" />

          </View>
          :
          <>
            <Modal
              animationType="slide"
              transparent={true}
              // visible={this.state.visible}
            visible={false}
            >
              <SafeAreaView>
                <View style={styles.header}>
                  <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => this.props.navigation.goBack()} />
                  <Text style={styles.aircrafts}>Exit</Text>
                </View>
                <View style={styles.modalView}>
                  <ActivityIndicator
                    color='#fff'
                    size="small"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={styles.modalText}>Please Wait</Text>
                  <Text style={styles.modalText}>{this.state.index} / {this.state.egcaData.length}</Text>
                  <ProgressBar progress={this.state.progress} color='#fff' style={{ width: 200, height: 10, borderRadius: 10 }} />
                </View>
              </SafeAreaView>

            </Modal>
            <WebView
              ignoreSslError={true}
              ref={webview => { this.webview = webview; }}
              source={{ uri: this.state.webViewUrl }}
              javaScriptEnabledAndroid={true}
              injectedJavaScript={this.injectJs(this.state.index, this.state.arrDate, this.state.depDate, this.state.airCraftReg, this.state.error , this.state.PIC ,this.state.SIC , this.state.chocksOffTime , this.state.chocksOnTime)}
              onError={() => this.webviewError(e)}
              startInLoadingState={true}
              scalesPageToFit={true}
              onMessage={event => this.onMessage(event.nativeEvent)}
              userAgent={
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2564.109 Safari/537.36"}
            />
          </>
        }
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => {
  const logData = docReducer(state, allreducers);
  const egcaDetail = EGCADetailsReducer(state, allreducers);
  return {
    logData: logData,
    egcaDetail: egcaDetail,
  }
};
const mapDispatchToProps = {
  LogListData,
}

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
  modalView: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    alignItems: "center",
    justifyContent: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#fff',
  },
  aircrafts: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'WorkSans-Regular',
    paddingTop: 5
  },
  header: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#256173'
  },
});

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(Sample);


// document.querySelector('#totalDistance').value = '';



// document.querySelector('#btnAddAppTrnElbLndgTkOffDtl').click();
// document.querySelector('#verificationStatus').click();
// document.querySelector('#btnAddSubmit').click();
// document.querySelector('#btn_Ok').click();
// setTimeout(function () {
//   if ( document.querySelector('#flyTimeIdNight').checked == true) {
//       window.ReactNativeWebView.postMessage(${dataPos} + 1);
//   }
//   else {
//      window.alert('error'); 
//   }
// }, 60000)
// document.querySelector('#totalDistance').value = '${depD}';

// document.querySelector('#btnAddAppTrnElbLndgTkOffDtl').click();
// document.querySelector('#verificationStatus').click();
// document.querySelector('#btnAddSubmit').click();
// document.querySelector('#btn_Ok').click();
// setTimeout(function () {
//   document.querySelector('#verificationStatus').click();
//   document.querySelector('#btnAddSubmit').click();
//   document.querySelector('#btn_Ok').click();
//    if ( document.querySelector('#btn_Ok').clicked()) {
//       window.ReactNativeWebView.postMessage(${dataPos} + 1);
//     }
//     else {
//      window.alert('error'); 
//     }
// }, 60000)