//import liraries
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet,KeyboardAvoidingView, TouchableOpacity, Image, TextInput, Dimensions, Platform, Alert, Modal, Pressable, DrawerLayoutAndroidComponent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from '../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { LogListData } from '../store/actions/loglistAction';
import { PilotData } from '../store/actions/pilotsAction';
import { ProfileData } from '../store/actions/displayAction';
import { ProgressBar } from 'react-native-paper';

import { BaseUrl } from '../components/url.json';
import { useSelector, useDispatch } from 'react-redux';

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
const P1 = ({ navigation }) => {

  const getLoginReduxData = useSelector(state => state.login);
  //console.log('from Login', getLoginReduxData.airlineType);

  const dataDispatcher = useDispatch();
  const scrollViewRef = React.useRef();
  const [name, setName] = React.useState('')
  const [lt, setLt] = React.useState('');
  const [ln, setLn] = React.useState('');
  const [date, setDate] = React.useState('');
  const [code, setCode] = React.useState('');
  const [mn, setMn] = React.useState('')

  const [op, setOp] = React.useState('');
  const [np, setNp] = React.useState('');
  const [cp, setCp] = React.useState('');


  const [egca, setEgca] = React.useState('Commercial');

  const [open, setOpen] = React.useState(false);
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [countryName, setCountryName] = React.useState('');
  const [items, setItems] = React.useState([
    { label: 'India', value: 'india' },
    { label: 'Afghanistan', value: 'afg' },
    { label: 'Aland islands', value: 'islands' },
  ]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [eId, setEId] = React.useState('') //anant mathur details 16614 pwd:124 //other one 32715
  const [ePwd, setEPwd] = React.useState('')/// 7325211
  const [airlineValue, setAirlineValue] = React.useState('');
  const [airline, setAirline] = React.useState([
    { label: 'Spicejet', value: 'Spicejet' },
    { label: 'indigo', value: 'indigo' },
  ]);

  //Modal fields
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')

  const [roasterData, setRoasterData] = React.useState([])
  const [dataFetched, setDataFetched] = React.useState(false)
  const [pilotsFetched, setPilotsFetched] = React.useState(false)

  const [profileDetails, setProfileDetails] = React.useState(true)
  const [changePassword, setChangePassword] = React.useState(false)
  const [ecrewLogin, setEcrewLogin] = React.useState(false)
  const [offset, setOffset] = React.useState(1)

  const [pilotListProgress, setPilotListProgress] = React.useState('');
  const [progressValue, setProgressValue] = React.useState('')
  const [showProgress, setShowProgress] = React.useState(true)
  const [showPilotsProgress, setShowPilotsProgress] = React.useState(true)

  const [showAlert, setShowAlert] = React.useState(true)

  //console.log('dhfshgfghghdjg', airlineValue)

  const checkEcrewFields = () => {
    if (eId !== '' && ePwd !== '' && airlineValue !== null) {
      setModalVisible(true)
    }
    else {
      Alert.alert('Please fill the required details')
    }
  }

  React.useEffect(() => { GetUserDetails()}, []);

  const GetUserDetails = async () => {
    //console.log('hello')
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = [];
    db.transaction(tx => {
      tx.executeSql('SELECT user_id,name,email,Contact,roster_id,roster_pwd,airline_type,LicenceNumber,LicenceType,validity ,Country, profile_pic FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available '); 
          //console.log('result', result)
        }
        else {
          //console.log('error')
        }
        for (let i = 0; i <= result.rows.length; i++) {
          //console.log('name: ', result.rows.item(i).airline_name, 'loginlink: ', result.rows.item(i).loginUrl)
          temData.push({
            user_id: result.rows.item(i).user_id,
            name: result.rows.item(i).name,
            email: result.rows.item(i).email,
            Contact: result.rows.item(i).Contact,
            roster_id: result.rows.item(i).roster_id,
            roster_pwd: result.rows.item(i).roster_pwd,
            airline_type: result.rows.item(i).airline_type,
            Lt: result.rows.item(i).LicenceType,
            Ln: result.rows.item(i).LicenceNumber,
            validity: result.rows.item(i).validity,
            country: result.rows.item(i).Country,
            profile_pic : result.rows.item(i).profile_pic,
          });
          //console.log('user Data', temData);
          setDate(result.rows.item(i).validity)
          setLt(result.rows.item(i).LicenceType)
          setLn(result.rows.item(i).LicenceNumber)
          setName(result.rows.item(i).name);
          setMn(result.rows.item(i).Contact);
          setEId(result.rows.item(i).roster_id);
          setEPwd(result.rows.item(i).roster_pwd);
          setAirlineValue(result.rows.item(i).airline_type)
          setCountryName(result.rows.item(i).Country)
          setImage({uri:result.rows.item(i).profile_pic})
        }
      });
    });
  }

  const [image, setImage] = React.useState(null);
  const [imageData, setImageData] = React.useState('');
  const [imageFilename, setImageFilename] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');

  const profile = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    //console.log('user id=>', user.id);
    //setName(user.name);

    await fetch(BaseUrl + 'edit_profile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_id": user.id,
        "name": name,
        "licance_type": lt,
        "licance_number": ln,
        "validity": date,
        "country": countryName,
        "country_code": code,
        "mobile": mn,
        "profile_pic": imagePath,

      })
    }).then(res => res.json())
      .then(resData => {
        //console.log(resData);
        GetUserDetails()
        Alert.alert(resData.message);
      });
  }

  const Roaster = async () => {
    setShowProgress(true)
    setProgressValue(0.3)
    dataDispatcher(LogListData({ data: [], inProgress: false }))
    setDataFetched(true)
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);

    await fetch(BaseUrl + 'roasterImport', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_id": user.id,
        "user": eId, //ned to be dynamic
        "pass": ePwd, //ned to be dynamic
        "airline_type": airlineValue, //ned to be dynamic
        "from": fromDate,
        "to": toDate,
      })
    }).then(res => res.json())
      .then(resData => {
        //console.log(resData);
        //console.log('data ---->', resData.data)
        //console.log('roaster data--->', roasterData)
        //setError(resData.data)

        // fetch(BaseUrl + 'edit_profile', {
        //   method: 'POST',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     "user_id": user.id,
        //     "rosterLength" : resData.data.length,
    
        //   })
        // }).then(res => res.json())
        //   .then(resData => {
        //     console.log(resData);
        //     GetUserDetails()
        //     Alert.alert(resData.message);
        //   });

        if(resData.msg!==false){
        for (let i = 0; i < resData.data.length; i++) {

          //console.log('Aircraft id', resData.data[i] )
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
          const Pilot_Instructor = resData.data[i].Pilot_function_Instructor

          const RealAircraftType = AircraftType === '320' || AircraftType === '321' ? 'A-' + AircraftType : AircraftType;

         console.log('Pilot_Copilot', Pilot_Copilot)

          let text = date;
          const myArray = text.split("-");
          const day = myArray[2] + myArray[1] + myArray[0]

      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * from logbook WHERE user_id="'+user.id+'" AND tag="roster" AND onTime="'+chocksOn+'"', [], (tx, result1) => {
          // console.log('impResult',result1.rows.length, resData.data.length,i + 1);

            if(result1.rows.length>0){
              if ((i + 1) == resData.data.length) {
              Alert.alert(
                "This data is already fetched",
                "Do you want to skip?",
                [
                  {
                    text: "Skip",
                    onPress: () => console.log('cancel pressed')
                  },
                  //{ text: "Cancel", onPress: () => console.log('cancel pressed') }
                ]
              )
              }
              if (Pilot_Pic !== '') {
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              else if (Pilot_Copilot === '' && Pilot_Pic === ''){
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              else if (Pilot_Instructor !== ''){
                tx.executeSql(
                  'UPDATE logbook set tag="roster",aircraftReg="'+AircraftReg+'",aircraftType="'+RealAircraftType+'",to_nameICAO="'+toCity+'",onTime="'+chocksOn+'",date="'+date+'",from_nameICAO="'+fromCity+'",offTime="'+chocksOff+'",dayLanding="'+dayland+'",nightLanding="'+nightLand+'",p1="'+SelfField+'",p2="",dayTO="'+dayTO+'",nightTO="'+nightTO+'",from_lat="'+RosterFromLat+'",from_long="'+RosterFromLong+'",to_lat="'+RosterToLat+'",to_long="'+RosterToLong+'",orderedDate="'+day+'" WHERE tag = "roster" AND user_id="'+user.id+'" AND date="'+date+'" AND onTime="'+chocksOn+'"'
                );
              }
              setProgressValue(1)
              setShowProgress(false)
              setModalVisible(false)
            }
            else{
            db.transaction((tx) => {
            if (Pilot_Pic !== '') {
              //Alert.alert('Pilot_Pic')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '")',
              );
            }
            else if (Pilot_Copilot === '' && Pilot_Pic === '') {
              //Alert.alert ('Pilot_Copilot')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '")',
              );
            }
            else if (Pilot_Instructor !== '') {
              //Alert.alert ('Pilot_Instructor')
              tx.executeSql(
                'INSERT INTO logbook (tag,user_id,aircraftReg,aircraftType,to_nameICAO,onTime,date,from_nameICAO,offTime,dayLanding,nightLanding,p1,p2,dayTO,nightTO,from_lat,from_long,to_lat,to_long,orderedDate) VALUES ("roster","' + user.id + '","' + AircraftReg + '","' + RealAircraftType + '","' + toCity + '","' + chocksOn + '","' + date + '","' + fromCity + '","' + chocksOff + '","' + dayland + '","' + nightLand + '","' + SelfField + '","","' + dayTO + '","' + nightTO + '","' + RosterFromLat + '","' + RosterFromLong + '","' + RosterToLat + '","' + RosterToLong + '","' + day + '")',
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
              db.transaction(tx => {
                tx.executeSql('SELECT id,tag,aircraftType,aircraftReg,user_id,date,from_nameICAO,to_nameICAO,offTime,onTime,from_lat,from_long,to_lat,to_long,p1,p2,dayLanding,nightLanding,dayTO,nightTO from logbook WHERE user_id = "' + user.id + '" AND tag ="roster" AND from_nameICAO != "null" ORDER BY orderedDate DESC, onTime DESC', [], (tx, result) => {
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
                    });
                    console.log('Entry fetched ' + j + ' out of :' + result.rows.length);
                    //console.log('id', result.rows.item(j).id)
                    setProgressValue(1)
                    dataDispatcher(LogListData({ data: temData, inProgress: false }))
                    let jPos = j + 1
                    //console.log('data fetched pos', jPos, result.rows.length)
                    if (jPos == result.rows.length) {
                        fetch(BaseUrl + 'edit_profile', {
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
                      setModalVisible(false)
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
        //console.log(error)
        setShowProgress(false)
        setModalVisible(false)
        alert('Something Went wrong')
      });
  }

  const validation = () => {
    if (fromDate === '') {
      alert('Please fill From Date')
    }
    else if (toDate === '') {
      alert('Please fill To Date')
    }
    else {
      Roaster();
    }
  }
  const getDataQuery = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let temData = [];
    db.transaction(tx => {
      tx.executeSql('SELECT * from logbook', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available '); 
          //console.log('result', result)
        }
        for (let i = 0; i <= result.rows.length; i++) {
          //console.log('name: ', result.rows.item(i).airline_name, 'loginlink: ', result.rows.item(i).loginUrl)
          temData.push({
            Aircraftid: result.rows.item(i).user_id,
          });
          //console.log('roster data', temData);
          //setData(temData);
          //setFilteredData(temData);
        }
        //console.log(result);
        //console.log(result.rows.item(0).airline_name)
        // result.rows.item.map((index, content) => {
        //   data.push({name:content.airline_name, loginlink: content.loginUrl})
        // });
        // );
      });
    });
  };

  const change_pwd = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);

    await fetch(BaseUrl + 'change_password', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_id": user.id,
        "old_password": op,
        "new_password": np,
        "confirm_password": cp,
      })
    }).then(res => res.json())
      .then(resData => {
        //console.log(resData);
        Alert.alert(resData.message);
      });
  }




  const selectingImage = () => {
    ImagePicker.showImagePicker({quality: 0.3}, responseGet => {
      // console.log('Response = ', responseGet);
      if (responseGet.didCancel) {
        console.log('User cancelled image picker');
      } else if (responseGet.error) {
        console.log('ImagePicker Error: ', responseGet.error);
      } else {
        const source = { uri: responseGet.uri }
        console.log(responseGet)
        setImage(source)
        setImagePath(responseGet.fileName)
        setImageData("image/jpg;base64" + responseGet.data)
      }
    });
  };

  const uploadImageToServer = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    let formData = new FormData();
    formData.append('user_id', user.id); 
    formData.append('name', name);
    formData.append('licance_type', lt);
    formData.append('licance_number', ln);
    formData.append('validity', date);
    formData.append('country', countryName);
    formData.append('country_code', code);
    formData.append('mobile', mn);
    //formData.append('licance_number', ln);
    const splittedBase64 = imageData.split(';base64');
    formData.append('profile_pic', splittedBase64[1]);
    // console.log('form data' , data._parts[0][1].uri)
    //console.log('form data', formData)
    var Url = BaseUrl + 'edit_profile'
    fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    }).then(response => response.json())
      .then(response => {
        //console.log('On task Creation: ', response);
        if(response.success === true){
          alert('Updated Successfully')
        }
      })
      .catch(error => {
        console.log('You can not proceed', error);
        Alert.alert('Something Went wrong');
      });
  };

  const { dark, theme, toggle } = React.useContext(ThemeContext);

  //dataDispatcher(rosterImportdata({data: roasterData}))

  const getReduxData = useSelector(state => state.rosterImport.data);
  //console.log('from pilot details', getReduxData);

  //console.log('item', getReduxData.data.length)

  //SQlite starts

  // React.useEffect(() => {createTable()}, []);

 const InsertInUserProfileData = async () => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
    //  Alert.alert('Hello')
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO userProfileData (user_id, name, LicenceType, LicenceNumber, validity, Country, CountryCode, Contact,roster_id,roster_pwd,airline_type)  VALUES ("' + user.id + '", "' + name + '", "' + lt + '", "' + ln + '", "' + date + '", "' + countryName + '", "' + code + '", "' + mn + '","'+eId+'","'+ePwd+'","'+airlineValue+'")',
        // console.log('INSERT INTO userProfileData (user_id, name, LicenceType, LicenceNumber, validity, Country, CountryCode, Contact)  VALUES ("'+user.id+'", "'+name+'", "'+lt+'", "'+ln+'", "'+date+'", "'+value+'", "'+code+'", "'+mn+'")')
        //Alert.alert('InSERTED Successfully')
      );
      tx.executeSql('SELECT * from userProfileData WHERE user_id = "' + user.id + '"', [], (tx, result) => {
        //setOffset(offset + 10);
        if (result.rows.length > 0) {
          //alert('data available ');
          //console.log('result', result)
        }
        for (let i = 0; i <= result.rows.length; i++) {
          //console.log('inserted items', result.rows.item(i).country)
          temData.push({
            id: result.rows.item(i).id,
            user_id: result.rows.item(i).user_id,
            name: result.rows.item(i).name,
            Lt: result.rows.item(i).LicenceType,
            Ln: result.rows.item(i).LicenceNumber,
            validity: result.rows.item(i).validity,
            country: result.rows.item(i).Country,
            CountryCode: result.rows.item(i).CountryCode,
            Contact: result.rows.item(i).Contact,
            //image : result.rows.item(i).profile_pic,
            roster_id: result.rows.item(i).roster_id,
            roster_pwd: result.rows.item(i).roster_pwd,
            airline_type: result.rows.item(i).airline_type,
          });
          // console.log('logbook data', result.rows.item(i).profile_pic);
          //setLocalLogbookData(temData);
          //dataDispatcher(LogListData({data: temData}))
          setName(result.rows.item(i).name)
          setLt(result.rows.item(i).LicenceType)
          setLn(result.rows.item(i).LicenceNumber)
          setMn(result.rows.item(i).Contact)
          setDate(result.rows.item(i).validity)
          setCountryName(result.rows.item(i).country)
          //console.log(require(result.rows.item(i).profile_pic))
          setEId(result.rows.item(i).roster_id)
          setEPwd(result.rows.item(i).roster_pwd)
          setAirlineValue(result.rows.item(i).airline_type)
        }
      });
    });
  }

  //sqlite ends

  //console.log('imageeē', image);

  const importPilotList = async () => {
    setShowPilotsProgress(true)
    if(airlineValue!==null){
    setPilotListProgress(0.3)
    setPilotsFetched(true)
    await fetch(BaseUrl + 'fetch_pilots', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "airline": airlineValue,
      })
    }).then(res => res.json())
      .then(resData => {
        //console.log('Pilot List',resData.data);

        if (resData.data.length > 100) {
          setPilotListProgress(0.5)
        }
        if (resData.data.length > 1000) {
          setPilotListProgress(0.7)
        }

        for (let k = 0; k < resData.data.length; k++) {
          //const Airline = resData.data[i].Airline
          const Airline = resData.data[k].Airline
          const EGCA_Registration_No = resData.data[k].EGCA_Registration_No
          const Name = resData.data[k].Name
          const Pilotid = resData.data[k].id

          //console.log('getting people', Pilotid)
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO pilots (Airline,Egca_reg_no,Name,pilotId,selectedAirline)VALUES("' + Airline + '","' + EGCA_Registration_No + '","' + Name + '","' + Pilotid + '","' + airlineValue + '")',
              // console.log('INSERT INTO pilots (Airline, Egca_reg_no, Name, pilotId)  VALUES ("'+Airline+'","'+EGCA_Registration_No+'", "'+Name+'" ,"'+Pilotid+'")')
            );
            console.log('K1', k + 1);
            console.log('K', resData.data.length);
            if ((k + 1) == resData.data.length) {
              //selection from table pilots
              let PilotData1 = [];
              db.transaction(tx => {
                tx.executeSql('SELECT * from pilots WHERE Airline = "' + airlineValue + '" limit 10 ', [], (tx, pilotresult) => {
                  //setOffset(offset + 10);
                  if (pilotresult.rows.length > 0) {
                    //alert('data available ');
                    //console.log('result', pilotresult)
                  }
                  for (let l = 0; l < pilotresult.rows.length; l++) {

                    PilotData1.push({
                      id: pilotresult.rows.item(l).id,
                      Airline: pilotresult.rows.item(l).Airline,
                      Egca_reg_no: pilotresult.rows.item(l).Egca_reg_no,
                      Name: pilotresult.rows.item(l).Name,
                      pilotId: pilotresult.rows.item(l).pilotId,

                    });
                    console.log('Entry fetched ' + l + ' out of :' + pilotresult.rows.length);
                    //console.log('date', result.rows.item(j).date)
                    //setLocalLogbookData(temData);
                    //console.log('peopleee', result.rows.item(j).dayLanding+result.rows.item(j).nightLanding+result.rows.item(j).dayTO+result.rows.item(j).nightTO);
                    //console.log('icao code test : ' ,temData)
                    dataDispatcher(PilotData({ data: PilotData1 }))
                    let lPos = l + 1
                    //console.log('data fetched pos', jPos, result.rows.length)
                    if (lPos == pilotresult.rows.length) {
                      setPilotListProgress(1)
                      Alert.alert("Message", 'Pilot List imported successfully');
                      setPilotsFetched(false)
                      setShowPilotsProgress(false)
                      //setModalVisible(false)
                      return false;
                    }
                  }
                });
              });
            }

          })

        }
        //alert('Pilots imported successfully')
      }).catch((error) => {
        //console.log(error)
        alert(error);
        setPilotsFetched(true);
        setShowPilotsProgress(false)
      });
  }
  else {
    alert('Please Select Airline before')
  }
}

  const AirlineDispatch = () => {
    dataDispatcher(ProfileData({ SelectedAirline: airlineValue }))
    console.log('dispatched airline', airlineValue)
  }
  React.useEffect(() => {
    if (airlineValue !== '') {
      AirlineDispatch()
    }
  }, [airlineValue]);

  return (
    <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? "padding" : null}>
    <ScrollView
      style={modalVisible === true ? { backgroundColor: 'rgba(0,0,0,0)' } : { backgroundColor: dark ? '#000' : '#fff' }}
      ref={scrollViewRef}
      onContentSizeChange={(contentWidth, contentHeight) => { scrollViewRef.current.scrollToEnd({ animated: true }) }}
    >
      <SafeAreaView style={modalVisible === false ? [{ flex: 1, backgroundColor: '#fff', }, { flex: 1, backgroundColor: theme.backgroundColor }] : [dark ? { backgroundColor: '#000' } : { backgroundColor: 'rgba(0,0,0,0.3)' }]}>

        <View style={styles.mainHeader}>
          <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.goBack()} />
          <Text style={styles.aircrafts}>Pilot details</Text>
        </View>


        {/* headline for personal details */}

        <TouchableOpacity onPress={() => setProfileDetails(!profileDetails)}>
          <View style={dark ? styles.DarkHeadline : styles.headline}>
            {profileDetails === true ? <MaterialCommunityIcons name="chevron-up" color={dark ? '#fff' : '#000'} size={20} style={{}} /> : <MaterialCommunityIcons name="chevron-down" color={dark ? '#fff' : '#000'} size={20} style={{}} />}
            <Text style={dark ? styles.DarkHeadlineText : styles.HeadlineText}>Personal details</Text>
          </View>
        </TouchableOpacity>

        {/* Personal details */}
        {profileDetails === true ? <View style={styles.centerComponents}>
          <TouchableOpacity onPress={() => selectingImage()}>
            {dark ? <Image source={
              image === null
                ? require('../images/userWhite.png')
                : image
            }
              style={{ height: 70, width: 70, borderColor:'#000',borderWidth:1 }} />
              : <Image source={
                image === null
                  ? require('../images/user.png')
                  : image
              }
                style={{ height: 70, width: 70, borderColor:'#000',borderWidth:1 }} />}
          </TouchableOpacity>

          <View style={styles.fields}>
            <TextInput
              placeholder='Name'
              placeholderTextColor="#266173"
              value={name===null?'':name.toUpperCase()}
              onChangeText={(inputText) => { setName(inputText) }}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>

          <View style={{ ...styles.fields, ...styles.fields1 }}>
            <Text style={styles.fieldText}> Licence Type </Text>
            <TextInput
              autoCapitalize="characters"
              placeholder='Licence Type'
              placeholderTextColor="#393F45"
              value={lt}
              onChangeText={inputText => setLt(inputText)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>

          <View style={{ ...styles.fields, ...styles.fields1 }}>
            <Text style={styles.fieldText}> Licence Number </Text>
            <TextInput
              placeholder='Licence Number'
              placeholderTextColor="#393F45"
              value={ln}
              onChangeText={inputText => setLn(inputText)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>

          <DatePicker
            style={styles.datePickerStyle}
            date={date} // Initial date from state
            mode="date" // The enum of date, datetime and time
            placeholder="validity"
            placeholderTextColor="#266173"
            format="DD-MM-YYYY"
            //minDate="01-01-2016"
            //maxDate="01-01-2019"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 4,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderWidth: 0.2,
                borderRadius: 5,
                borderColor: '393F45',
                width: '100%',
                //padding:20,
              },
            }}
            onDateChange={(date) => {
              setDate(date);
            }}
          />

          <DropDownPicker
            open={countryOpen}
            value={countryName}
            items={items}
            setOpen={setCountryOpen}
            setValue={setCountryName}
            setItems={setItems}
            placeholder="Select Country"
            style={modalVisible===true?[{backgroundColor:'rgba(0,0,0,0)',borderWidth: 0.2,borderColor: "#393F45",marginTop: 10}]:
            [{
              borderWidth: 0.2,
              borderColor: "#393F45",
              marginTop: 10
            }, { backgroundColor: theme.backgroundColor }]}
            textStyle={{
              fontSize: 14,
              color: "#266173",
            }}
            dropDownContainerStyle={{ backgroundColor: theme.backgroundColor, borderColor: "#266173" }}
            arrowIconStyle={{
              width: 20,
              height: 20,
              tintColor: dark ? '#fff' : '#000',
            }}
            tickIconStyle={{
              width: 20,
              height: 20,
              tintColor: dark ? '#fff' : '#000',
            }}
          />

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <View style={styles.mobileCode}>
              <TextInput
                placeholder='Country-Code'
                placeholderTextColor="#266173"
                value={countryName==='india'?'+91':countryName==='afg'?'+93':'+358' }
                //onChangeText={code => setCode(code)}
                style={{ paddingLeft: 8 }}
              />
            </View>
            <View style={styles.mobile}>
              <TextInput
                placeholder='Mobile No.'
                placeholderTextColor="#266173"
                keyboardType="numeric"
                value={mn}
                onChangeText={mn => setMn(mn)}
                style={{ color: dark ? '#fff' : '#000' }}
              />
            </View>
          </View>

          <TouchableOpacity onPress={() => {InsertInUserProfileData(); uploadImageToServer()}}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableOpacity>

        </View> : null}

        {/* headline for change password */}
        <TouchableOpacity onPress={() => setChangePassword(!changePassword)}>
          <View style={dark ? styles.DarkHeadline : modalVisible=== true?{...styles.headline,...{backgroundColor:'rgba(0,0,0,0)'}}:styles.headline}>
            {changePassword === true ? <MaterialCommunityIcons name="chevron-up" color={dark ? '#fff' : '#000'} size={20} style={{}} /> : <MaterialCommunityIcons name="chevron-down" color={dark ? '#fff' : '#000'} size={20} style={{}} />}
            <Text style={dark ? styles.DarkHeadlineText : styles.HeadlineText}> Change Password</Text>
          </View>
        </TouchableOpacity>

        {/* password details */}
        {changePassword === true ? <View style={styles.centerComponents}>
          <View style={styles.fields}>
            <TextInput
              placeholder='Old Password'
              placeholderTextColor="#266173"
              value={op}
              onChangeText={op => setOp(op)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>
          <View style={styles.fields}>
            <TextInput
              placeholder='New Password'
              placeholderTextColor="#266173"
              value={np}
              onChangeText={np => setNp(np)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>
          <View style={styles.fields}>
            <TextInput
              placeholder='Confirm Password'
              placeholderTextColor="#266173"
              value={cp}
              onChangeText={cp => setCp(cp)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>
          <TouchableOpacity onPress={change_pwd}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableOpacity>
        </View> : null}

        {/* heading of Ecrew login  */}
        <TouchableOpacity onPress={() => setEcrewLogin(!ecrewLogin)}>
          <View style={dark ? styles.DarkHeadline : modalVisible=== true?{...styles.headline,...{backgroundColor:'rgba(0,0,0,0)'}}: styles.headline}>
            {ecrewLogin === true ? <MaterialCommunityIcons name="chevron-up" color={dark ? '#fff' : '#000'} size={20} style={{}} /> : <MaterialCommunityIcons name="chevron-down" color={dark ? '#fff' : '#000'} size={20} style={{}} />}
            <Text style={dark ? styles.DarkHeadlineText : styles.HeadlineText}> Ecrew-Login</Text>
          </View>
        </TouchableOpacity>

        {/* Ecrew login */}
        {ecrewLogin === true ? <View style={styles.centerComponents}>
          <View style={styles.fields}>
            <TextInput
              placeholder='Ecrew Id *'
              placeholderTextColor="#266173"
              value={eId}  //need to be dynamic
              onChangeText={(inputText) => setEId(inputText)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>
          <View style={styles.fields}>
            <TextInput
              placeholder='Ecrew Password *'
              placeholderTextColor="#266173"
              value={ePwd}
              onChangeText={(inputText) => setEPwd(inputText)}
              style={{ color: dark ? '#fff' : '#000' }}
            />
          </View>
          <DropDownPicker
            open={open}
            value={airlineValue}
            items={airline}
            setOpen={setOpen}
            setValue={setAirlineValue}
            setItems={setAirline}
            placeholder="Select Airline *"
            style={modalVisible === false ? [{
              borderColor: "#266173",
              borderRadius: 5,
              marginTop: 10,
              borderWidth: 0.2,
            }, { backgroundColor: theme.backgroundColor }] : [{
              borderColor: "#266173",
              borderRadius: 5,
              marginTop: 10,
              borderWidth: 0.2,
            }, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
            textStyle={{
              fontSize: 14,
              color: "#266173",
            }}
            dropDownContainerStyle={{ backgroundColor: theme.backgroundColor, borderColor: "#266173" }}
            arrowIconStyle={{
              width: 20,
              height: 20,
              tintColor: dark ? '#fff' : '#000',
            }}
            tickIconStyle={{
              width: 20,
              height: 20,
              tintColor: dark ? '#fff' : '#000',
            }}

          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <View style={{backgroundColor:'#fff',width:'100%',borderRadius: 10}}>
                <View style={{paddingVertical:10, alignItems: 'center'}}>
                    <MaterialCommunityIcons name="close-circle" color={'#000'} size={20} style={{paddingLeft:300}} onPress={()=>setModalVisible(false)}/>
                    <MaterialCommunityIcons name="check-circle-outline" color={'#000'} size={50} style={{}}/>
                    <Text style={styles.modalText}>Set Title</Text>
                </View>
              </View>
                <View style={{flexDirection:'row',paddingTop:10}}>
                <Text style={{paddingRight:120}}>From</Text>
                <Text>To</Text>
                </View>
              <View style={{flexDirection:'row',padding:10}}>
                <DatePicker
                  //style={styles.datePickerStyle}
                  date={fromDate} // Initial date from state
                  mode="date" // The enum of date, datetime and time
                  placeholder="From"
                  placeholderTextColor="#266173"
                  format="DD-MM-YYYY"
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
                      width: 0,
                      height: 0,
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
                  placeholderTextColor="#266173"
                  format="DD-MM-YYYY"
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
                      width: 0,
                      height: 0,
                    },
                  }}
                  onDateChange={(toDate) => {
                    setToDate(toDate);
                  }}
                />
                </View>
                {dataFetched === true ?
                  <View>
                    <ProgressBar progress={progressValue} color={'#256173'} style={{ width: 200, marginTop: 15 }} visible={showProgress}/>
                  </View> :
                  null}

                <View style={{ flexDirection: 'row', padding:10 }}>
                  <TouchableOpacity
                    style={[styles.Modalbutton, styles.buttonClose]}
                    onPress={validation}
                  >
                    <Text style={{ color: '#fff' }}>Import Log Data</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

          {pilotsFetched === true ?
            <View>
              <Text style={{ color: dark ? '#fff' : '#000' }}>Pilot list is uploading....</Text>
              <ProgressBar progress={pilotListProgress} color={'#256173'} style={{ width: 200, marginTop: 15 }} visible={showPilotsProgress}/>
            </View> : null}


          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={checkEcrewFields}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Roster Import</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={importPilotList}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Import Pilot List</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View> : null}

      </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  centerComponents: {
    //flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    //marginTop:10,
    padding: 30,
    //backgroundColor: '#fff',
  },
  headline: {
    padding: 20,
    backgroundColor: '#F3F3F3',
    width: '100%',
    //justifyContent:'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  HeadlineText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'WorkSans-Bold',
  },
  fields: {
    borderWidth: 0.2,
    borderRadius: 5,
    borderColor: Colors.accent,
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : null,
  },
  fieldText: {
    fontSize: 14,
    //marginTop: 5,
    fontWeight: '600',
    fontFamily: 'WorkSans-Regular',
    lineHeight: Platform.OS === 'ios' ? null : 45,
    color: Colors.primary,
  },
  fields1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerStyle: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: Colors.accent,
    marginTop: 10,
    //padding: 3,
  },
  mobileCode: {
    borderWidth: 0.2,
    borderRadius: 5,
    borderColor: Colors.accent,
    width: '35%',
    marginTop: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : null,
  },
  mobile: {
    borderWidth: 0.2,
    borderRadius: 5,
    borderColor: Colors.accent,
    width: '60%',
    marginTop: 10,
    paddingLeft: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : null,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 5,
    marginTop: 20,
    width: Dimensions.get('window').width * 0.4,
    borderRadius: 10,
    alignItems: 'center',
    margin: 5
  },
  Modalbutton: {
    backgroundColor: Colors.primary,
    padding: 5,
    marginTop: 20,
    width: Dimensions.get('window').width * 0.3,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
    fontSize:14,
  },
  fieldWithoutBottom: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
  },
  fieldTextRadio: {
    fontSize: 14,
    //marginTop: 5,
    fontWeight: '600',
    fontFamily: 'WorkSans-Regular',
    lineHeight: 30,
    color: Colors.primary,
  },
  header: {
    padding: 15,
    fontFamily: 'WorkSans-Regular',
    fontSize: 20,
    color: Colors.primary,
  },
  headerIos: {
    padding: 15,
    fontFamily: 'WorkSans-Regular',
    fontSize: 20,
    color: Colors.primary,
    paddingTop: 42,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22
  },
  modalView: {
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
        //bottom: '1%',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  mainHeader: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#256173'
  },
  aircrafts: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'WorkSans-Regular',
    paddingTop: 5
  },
  // dark 
  DarkHeadline: {
    padding: 20,
    backgroundColor: '#000',
    width: '100%',
    //justifyContent:'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  DarkHeadlineText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'WorkSans-Bold',
  },
});

//make this component available to the app
export default P1;