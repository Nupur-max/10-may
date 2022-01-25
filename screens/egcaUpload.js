//import liraries
import React, { Component } from 'react';
import { View, Text,SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, TextInput, ScrollView, Platform} from 'react-native';
import { RadioButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {BaseUrl} from '../components/url.json';
import DgcaLogbookStyles from '../styles/dgcaLogbookStyles';
import { EGCADetailsData } from '../store/actions/egcaDetailsAction';
import { useDispatch, useSelector } from 'react-redux';
import {FTOData,Elog_verifiers} from '../components/dummydropdown'
import { ThemeContext } from '../theme-context';
import SearchableDropdown from 'react-native-searchable-dropdown';

import SQLite from 'react-native-sqlite-storage';

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
const EGCAUpload = ({navigation}) => {

  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const dataDispatcher = useDispatch();

    const [egca_user,setEGCAUSER] = React.useState('IPLTM2020023010');
    const [egca_pwd,setEGCAPWD] = React.useState('Fighters12!');
    const [arrow,setArrow] = React.useState(true);
    const [arrowSettings, setArrowSettings] = React.useState(false)
    const [FTOopen, setFTOOpen] = React.useState(false);
    const [FTOvalue, setFTOValue] = React.useState('');
    const [FTOitems, setFTOItems] = React.useState(FTOData);

    const [AuthOpen, setAuthOpen] = React.useState(false);
    const [Authvalue, setAuthValue] = React.useState('')
    const [Authitems, setAuthItems] = React.useState([
      {label: 'eLog Book Verifier', value: 'eLog Book Verifier'},
      {label: 'CFI', value: 'CFI'},
      {label: 'Deputy CFI', value: 'Deputy CFI'}
    ]);

    const [AuthPersonOpen, setAuthPersonOpen] = React.useState(false);
    const [AuthPersonvalue, setAuthPersonValue] = React.useState('');
    const [AuthPersonitems, setAuthPersonItems] = React.useState(Elog_verifiers);

    const [egca, setEgca] = React.useState('');
    const [choice, setChoice] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState('');
    const [trainingValue, setTrainingValue] = React.useState([
    {label: 'Select', value : 'Select'},
    {label: '300 NM Cross-Country (for CPL)', value: '300 NM Cross-Country (for CPL)'},
    {label: 'Abnormal Emergency Procedures', value: 'Abnormal Emergency Procedures'},
    {label: 'Aircraft familiarization', value: 'Aircraft familiarization'},
    {label: 'Air Experience', value: 'Air Experience'},
    {label: 'Approach and landing', value: 'Approach and landing'},
    {label: 'Asymmetric Handling', value: 'Asymmetric Handling'},
    {label: 'Asymmetric Handling and Landing', value: 'Asymmetric Handling and Landing'},
    {label: 'Ccts, App, Ldgs', value: 'Ccts, App, Ldgs'},
    {label: 'Circuit pattern', value: 'Circuit pattern'},
    {label: 'Climbing Descending & Gliding', value: 'Climbing Descending & Gliding'},
    {label: 'Communication Failure Procedure', value: 'Communication Failure Procedure'},
    {label: 'Consolidation of above items with additional dual or solo', value: 'Consolidation of above items with additional dual or solo'},
    {label: 'Cross-country flight (day)', value: 'Cross-country flight (day)'},  
    {label: 'Cross-country flight (night)', value: 'Cross-country flight (night)'},  
    {label: 'Cross-wind take-offs and landings', value: 'Cross-wind take-offs and landings'}, 
    {label: 'EOC + FEOC', value: 'EOC + FEOC'},
    {label: 'Emergency procedures', value: 'Emergency procedures'},
    {label: 'Examiner Competency Check', value: 'Examiner Competency Check'},
    {label: 'Ferry Flight', value: 'Ferry Flight'},
    {label: 'First solo', value: 'First solo'},
    {label: 'Flair Path Demonstartion', value: 'Flair Path Demonstartion'},
    {label: 'General/Line Flying', value: 'General/Line Flying'},
    {label: 'Holding and Instrument Procedures', value: 'Holding and Instrument Procedures'},
    {label: 'Instrument flying', value: 'Instrument flying'},
    {label: 'Local lost Procedure', value: 'Local lost Procedure'},
    {label: 'Low flying (Dual only)', value: 'Low flying (Dual only)'},
    {label: 'Night Flying', value: 'Night Flying'},
    {label: '2 hours LOFT session as PF', value: '2 hours LOFT session as PF'},
    {label: '100 NM Cross-Country (for PPL-H)', value: '100 NM Cross-Country (for PPL-H)'},
    {label: '150 NM Cross-Country (for PPL-A)', value: '150 NM Cross-Country (for PPL-A)'},
    {label: 'Supervised line flying', value: 'Supervised line flying'},
    {label: 'Supervised take-off and landing', value: 'Supervised take-off and landing'},
    {label: 'Route check', value: 'Route check'},
    {label: 'IR/PPC', value: 'IR/PPC'},
    {label: 'Base Training', value: 'Base Training'},
    {label: '50 NM Cross-country (for LSA)', value: '50 NM Cross-country (for LSA)'},
    {label: '100 NM Cross-Country (for Gyroplane)', value: '100 NM Cross-Country (for Gyroplane)'},
    {label: 'Auto-rotations', value: 'Auto-rotations'},
    {label: 'Hovering', value: 'Hovering'},
    {label: 'Hover taxing', value: 'Hover taxing'},
    {label: 'Transitions', value: 'Transitions'},
    {label: 'Ground Exercises', value: 'Ground Exercises'},
    {label: 'Circuit and Rotor Emergencies', value: 'Circuit and Rotor Emergencies'},
    {label: 'Spot Turns', value: 'Spot Turns'},
    {label: 'Vortex ring', value: 'Vortex ring'},
    {label: 'Advanced Auto-rotations', value: 'Advanced Auto-rotations'},
    {label: 'Sloping ground', value: 'Sloping ground'},
    {label: 'Limited power', value: 'Limited power'},
    {label: 'Confined area', value: 'Confined area'},
    {label: 'Slow flight', value: 'Slow flight'},
    {label: 'Steep Turns', value: 'Steep Turns'},
    {label: 'Others', value: 'Others'},
    {label: 'Overshoot and wave-off', value: 'Overshoot and wave-off'},
    {label: 'Pilot Navigation Dual (Day and night)', value: 'Pilot Navigation Dual (Day and night)'},
    {label: 'Practice Force landing', value: 'Practice Force landing'},
    {label: 'Practice Precautionary landing', value: 'Practice Precautionary landing'},
    {label: 'Precautionary landing', value: 'Precautionary landing'},
    {label: 'Flight Preparation', value: 'Flight Preparation'},
    {label: 'Progress Check', value: 'Progress Check'},
    {label: 'Recovery from abnormal altitude', value: 'Recovery from abnormal altitude '},
    {label: 'Sector familiarization', value: 'Sector familiarization'},
    {label: 'Short take-offs and landings', value: 'Short take-offs and landings'},
    {label: 'Simulated forced-landing without power', value: 'Simulated forced-landing without power'},
    {label: 'Simulated forced-landing with power', value: 'Simulated forced-landing with power'},
    {label: 'Side/ Forward slip', value: 'Side/ Forward slip'},
    {label: 'Stalls and recovery', value: 'Stalls and recovery'},
    {label: 'Stalls with and without power, accidental stalls', value: 'Stalls with and without power, accidental stalls'},
    {label: 'Standardization Check', value: 'Standardization Check'},
    {label: 'Standardization Competency Check', value: 'Standardization Competency Check'},
    {label: 'Straight and level fight', value: 'Straight and level fight'},
    {label: 'Take off', value: 'Take off'},
    {label: 'Taxying', value: 'Taxying'},
    {label: 'Test Flight', value: 'Test Flight'},
    {label: 'Turns', value: 'Turns'},
    {label: 'Patter Flying - Aircraft Familiarisation', value: 'Patter Flying - Aircraft Familiarisation'},
    {label: 'Patter Flying - Flight Preparation', value: 'Patter Flying - Flight Preparation'},
    {label: 'Patter Flying - Air Experience', value: 'Patter Flying - Air Experience'},
    {label: 'Patter Flying - Taxiing', value: 'Patter Flying - Taxiing'},
    {label: 'Patter Flying - EOC + FEOC', value: 'Patter Flying - EOC + FEOC'},
    {label: 'Patter Flying - Straight and level flight', value: 'Patter Flying - Straight and level flight'},
    {label: 'Patter Flying - Climbing Descending & Gliding', value: 'Patter Flying - Climbing Descending & Gliding'},
    {label: 'Patter Flying - Stalls and recovery', value: 'Patter Flying - Stalls and recovery'},
    {label: 'Patter Flying - Turns', value: 'Patter Flying - Turns'},
    {label: 'Patter Flying - Steep Turns', value: 'Patter Flying - Steep Turns'},
    {label: 'Patter Flying - Take off and climb', value: 'Patter Flying - Take off and climb'},
    {label: 'Patter Flying - Ccts, App, Ldgs', value: 'Patter Flying - Ccts, App, Ldgs'},
    {label: 'Patter Flying - Approach and landing', value: 'Patter Flying - Approach and landing'},
    {label: 'Patter Flying - Low flying (Dual only)', value: 'Patter Flying - Low flying (Dual only)'},
    {label: 'Patter Flying - Side/ Forward slip', value: 'Patter Flying - Side/ Forward slip'},
    {label: 'Patter Flying - Cross-wind take-offs and landings', value: 'Patter Flying - Cross-wind take-offs and landings'},
    {label: 'Patter Flying - Precautionary landing', value: 'Patter Flying - Precautionary landing'},
    {label: 'Patter Flying - Practice Force landing', value: 'Patter Flying - Practice Force landing'},
    {label: 'Patter Flying - Instrument flying', value: 'Patter Flying - Instrument flying'},
    {label: 'Patter Flying - Night flying', value: 'Patter Flying - Night flying'},
    {label: 'Patter Flying - Flair Path Demonstartion', value: 'Patter Flying - Flair Path Demonstartion'},
    {label: 'Patter Flying - Emergency procedures', value: 'Patter Flying - Emergency procedures'},
    {label: 'Patter Flying - Pilot Navigation Dual (Day and night)', value: 'Patter Flying - Pilot Navigation Dual (Day and night)'},
    {label: 'Patter Flying - Slow flight', value: 'Patter Flying - Slow flight'},
    {label: 'Patter Flying - Take off and Flight', value: 'Patter Flying - Take off and Flight'},
    {label: 'Patter Flying - First Solo', value: 'Patter Flying - First Solo'},
    {label: 'Patter Flying - Radio navigation and instrument flying', value: 'Patter Flying - Radio navigation and instrument flying'},
    // {label: 'Patter Flying - Night flying', value: 'Patter Flying - Night flying'},
    {label: 'Patter Flying - Circuit and Rotor Emergencies', value: 'Patter Flying - Circuit and Rotor Emergencies'},
    {label: 'Patter Flying - Auto-rotations', value: 'Patter Flying - Auto-rotations'},
    {label: 'Patter Flying - Hovering', value: 'Patter Flying - Hovering'},
    {label: 'Patter Flying - Hover taxiing', value: 'Patter Flying - Hover taxiing'},
    {label: 'Patter Flying - Transitions', value: 'Patter Flying - Transitions'},
    {label: 'Patter Flying - Ground Exercises', value: 'Patter Flying - Ground Exercises'},
    {label: 'Patter Flying - Vortex ring', value: 'Patter Flying - Vortex ring'},
    {label: 'Patter Flying - Advanced auto-rotations', value: 'Patter Flying - Advanced auto-rotations'},
    {label: 'Patter Flying - Sloping ground', value: 'Patter Flying - Sloping ground'},
    {label: 'Patter Flying - Limited power', value: 'Patter Flying - Limited power'},
    {label: 'Patter Flying - Confined areas', value: 'Patter Flying - Confined areas'},
    {label: 'Patter Flying - Spot turns', value: 'Patter Flying - Spot turns'},
    {label: 'Patter Flying - Circuit and Rotor Emergencies', value: 'Patter Flying - Circuit and Rotor Emergencies'},
]);
    const [test, setTest] = React.useState('');
    const [testValue, setTestValue] = React.useState([
    {label: 'Select', value : 'Select'},
    {label: '120 NM Cross-country (for CPL)', value: '120 NM Cross-country (for CPL)'},
    {label: '250 NM Cross-Country (for CPL)', value: '250 NM Cross-Country (for CPL)'},
    {label: 'AFIR Issue Test', value: 'AFIR Issue Test'},
    {label: 'FIR Issue Test', value: 'FIR Issue Test'},
    {label: 'GFT by Day', value: 'GFT by Day'},
    {label: 'GFT by Night', value: 'GFT by Night'},
    {label: 'Instrument Rating Test', value: 'Instrument Rating Test'},
    {label: 'Pilot Proficiency Check (PPC)', value: 'Pilot Proficiency Check (PPC)'},
    {label: 'Skill Test by Day', value: 'Skill Test by Day'},
    {label: 'Skill Test by Night', value: 'Skill Test by Night'},
    ]);
    const [commercial, setCommercial] = React.useState(''); 
    const [commercialValue, setCommercialValue] = React.useState([
    {label: 'Select', value : 'Select'},
    {label: 'Cross-country flight (day)', value: 'Cross-country flight (day)'},
    {label: 'Cross-country flight (night)', value: 'Cross-country flight (night)'},
    {label: 'General/Line Flying', value: 'General/Line Flying'},
    {label: 'Supervised line flying', value: 'Supervised line flying'},
    {label: 'Supervised take-off and landing', value: 'Supervised take-off and landing'},
    {label: 'Route check', value: 'Route check'},
    {label: 'Pilot Proficiency Check (PPC)', value: 'Pilot Proficiency Check (PPC)'},
    {label: 'IR/PPC', value: 'IR/PPC'},
    {label: 'Base Training', value: 'Base Training'},
    {label: 'SLF release check', value: 'SLF release check'},
    {label: 'Co-pilot Release Check', value: 'Co-pilot Release Check'},
    {label: 'PIC Release Check', value: 'PIC Release Check'},
    {label: 'Line Release Check', value: 'Line Release Check'},
    {label: 'Line Check', value: 'Line Check'},
    ]);

    const egca_upload = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
      
        await fetch(BaseUrl+'update_egca_upload',{
          method : 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "user_id": user.id,
            "egca_upload": egca,                
       })
      }).then(res => res.json())
      .then(resData => {
         console.log(resData);
         Alert.alert(resData.message);
      });
      }


      //Sql starts
      const SelectQuery = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let selectedData = []; 
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * from EGCADetails WHERE user_id = "'+user.id+'"', [], (tx, result) => {
                    for (let i = 0; i <= result.rows.length; i++) {
                    selectedData.push({
                      egcaId :  result.rows.item(i).egcaId , 
                      egcaPwd :  result.rows.item(i).egcaPwd,
                      FtoOperator :  result.rows.item(i).FtoOperator,
                      FlightType :  result.rows.item(i).FlightType,
                      Purpose :  result.rows.item(i).Purpose,
                      AuthVerifier :  result.rows.item(i).AuthVerifier,
                      NameOfAuthVerifier :  result.rows.item(i).NameOfAuthVerifier,

                     });
                     console.log('setRosterAId', selectedData)
                     setEGCAUSER(result.rows.item(i).egcaId)
                     setEGCAPWD(result.rows.item(i).egcaPwd)
                     setFTOValue(result.rows.item(i).FtoOperator)
                     setEgca(result.rows.item(i).FlightType)

                     egca === "Training" ?
                     setTraining(result.rows.item(i).Purpose):
                     egca === "Test" ?
                     setTest(result.rows.item(i).Purpose): 
                     egca === "Commercial" ?
                     setCommercial(result.rows.item(i).Purpose):
                     []
                     setAuthValue(result.rows.item(i).AuthVerifier)
                     setAuthPersonValue(result.rows.item(i).NameOfAuthVerifier)
                    }
                }
            );
        });
    }
    React.useEffect(() => {SelectQuery()}, []);

    const PurposeData = egca==='Training'? training : egca==='Test'? test : egca==='Commercial'?commercial:''

      const UpdateQuery = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let temData = [];
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM EGCADetails Where user_id = "'+user.id+'"', [], (tx, result) => {
            //setOffset(offset + 10);
            if (result.rows.length > 0) {
              tx.executeSql('UPDATE EGCADetails set egcaId="'+egca_user+'", egcaPwd="'+egca_pwd+'" , FtoOperator="'+FTOvalue+'", FlightType="'+egca+'", Purpose="'+PurposeData+'", AuthVerifier="'+Authvalue+'", NameOfAuthVerifier="'+AuthPersonvalue+'" where user_id="'+user.id+'"')

              alert('Saved successfully')
            }
            else{
              tx.executeSql( 'INSERT INTO EGCADetails (user_id, egcaId, egcaPwd, FtoOperator, FlightType, Purpose, AuthVerifier, NameOfAuthVerifier ) VALUES ("'+user.id+'","'+egca_user+'", "'+egca_pwd+'", "'+FTOvalue+'", "'+egca+'", "'+PurposeData+'", "'+Authvalue+'", "'+AuthPersonvalue+'")')

              alert('Saved successfully')
            }
          });
        });
      }

      const getReduxData = useSelector(state => state.Egcadata.data);
      console.log('From EGCADATA', getReduxData);

      //Sql ends

    return (
      <SafeAreaView style={[styles.container,{ backgroundColor: theme.backgroundColor }]}>
        <ScrollView nestedScrollEnabled={true} >

        <View style={styles.mainHeader}>
            <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
            <Text style={styles.aircrafts}>EGCA Upload</Text>
        </View>

        <TouchableOpacity onPress={()=>setArrow(!arrow)}>
        <View style={dark?styles.darkHeadline:styles.headline}>
          {arrow === true ? <MaterialCommunityIcons name="chevron-up" color={dark?'#fff':'#000'} size={20} style={{}} onPress={()=>setArrow(!arrow)} /> : <MaterialCommunityIcons name="chevron-down" color={dark?'#fff':'#000'} size={20} style={{}} onPress={()=>setArrow(!arrow)} /> }
          <Text style={dark?styles.darkHeadlineText:styles.HeadlineText}> EGCA Login details</Text>
        </View>
        </TouchableOpacity>

       { arrow === true ?<View>
       <View style={DgcaLogbookStyles.mainTagLine}>
            <Text style={DgcaLogbookStyles.pageDetailText}>eGCA Id</Text>
        </View>
        <View style={{paddingHorizontal:10}}>
        <View>
            <TextInput
            placeholder='Enter eGCA Id'
            placeholderTextColor={'#636363'}
            value={egca_user}
            style={dark?DgcaLogbookStyles.DarkTextInputView:DgcaLogbookStyles.TextInputView}
            onChangeText={(inputText)=>setEGCAUSER(inputText)}
            />
        </View>
        </View>

        <View style={DgcaLogbookStyles.mainTagLine}>
            <Text style={DgcaLogbookStyles.pageDetailText}>Password</Text>
        </View>
        <View style={{paddingHorizontal:10}}>
        <View >
            <TextInput
            placeholder='Enter eGCA password'
            placeholderTextColor={'#636363'}
            value = {egca_pwd}
            onChangeText= {(inputText)=>setEGCAPWD(inputText)}
            style={dark?DgcaLogbookStyles.DarkTextInputView:DgcaLogbookStyles.TextInputView}
            />
        </View>
        </View>
        </View> : null}

        <TouchableOpacity onPress={()=>setArrowSettings(!arrowSettings)}>
        <View style={dark?styles.darkHeadline:styles.headline}>
            {arrowSettings === true ? <MaterialCommunityIcons name="chevron-up" color={dark?'#fff':'#000'} size={20} style={{}}    onPress={()=>setArrowSettings(!arrowSettings)} /> : <MaterialCommunityIcons name="chevron-down" color={dark?'#fff':'#000'} size={20} style={{}} onPress={()=>setArrowSettings(!arrowSettings)} /> }
            <Text style={dark?styles.darkHeadlineText:styles.HeadlineText}> EGCA Settings</Text>
        </View>
        </TouchableOpacity>

      {/* Egca upload */}
      { arrowSettings === true ? <View>
        <View>
        <Text style = {dark?styles.DarkInnnerHeadings:styles.InnnerHeadings}>Name of FTO/OPERATOR</Text>
        </View>
        <View style={Platform.OS==='ios'?{padding: 20,zIndex:99}:{padding: 20}}>
        <DropDownPicker
          searchable={true}
          open={FTOopen}
          value={FTOvalue}
          items={FTOitems}
          setOpen={setFTOOpen}
          setValue={setFTOValue}
          setItems={setFTOItems}
          style = {{width: '100%',}}
          dropDownContainerStyle={{
            width: '100%',
            //zIndex:-1,
            height:150
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        </View>

        <View>
        <Text style = {dark?styles.DarkInnnerHeadings:styles.InnnerHeadings}>Flight Type</Text>
        </View>
        <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row'}}> 
        <RadioButton.Android
            value="Training"
            status={ egca === 'Training' ? 'checked' : 'unchecked' }
            onPress={() => setEgca('Training')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Training</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:78,}}>
        <RadioButton.Android
            value="Test"
            status={ egca === 'Test' ? 'checked' : 'unchecked' }
            onPress={() => setEgca('Test')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Test</Text>
        </View>
      </View>
      <View style={styles.fieldWithoutBottom}>
        <View style={{flexDirection:'row',}}> 
         <RadioButton.Android
            value="Commercial"
            status={ egca === 'Commercial' ? 'checked' : 'unchecked' }
            onPress={() => setEgca('Commercial')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Commercial</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:50}}>
        <RadioButton.Android
            value="Non-commercial"
            status={ egca === 'Non-commercial' ? 'checked' : 'unchecked' }
            onPress={() => setEgca('Non-commercial')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Non-commercial</Text>
        </View>
      </View>

        {egca !== "Non-commercial" ?<View>
        <Text style = {dark?styles.DarkInnnerHeadings:styles.InnnerHeadings}>Purpose</Text>
        </View>: null}
        {egca !== "Non-commercial" ? <View style={Platform.OS==='ios'?{padding: 20,zIndex:888}:{padding:20,}}>
          <DropDownPicker
            searchable={true}
            open={open}
            value={egca === "Training" ? training : egca === "Test" ? test : egca === "Commercial" ? commercial : ''}
            items={egca === "Training" ? trainingValue : egca === "Test" ? testValue : egca === "Commercial" ? commercialValue : []}
            setOpen={setOpen}
            setValue={ egca === "Training" ? setTraining : egca === "Test" ? setTest : egca === "Commercial" ? setCommercial : ''}
            setItems={ egca === "Training" ? setTrainingValue : egca === "Test" ? setTestValue : egca === "Commercial" ? setCommercialValue : []}
            placeholder="Select *"
            style = {{width: '100%',}}
            dropDownContainerStyle={{
            width: '100%',
            //zIndex:99,
            elevation: 15,
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        </View> : null}

        <View>
        <Text style = {dark?{...styles.DarkInnnerHeadings}:{...styles.InnnerHeadings,}}>Authorised Person For Verification</Text>
        </View>

        <View style={Platform.OS==='ios'?{padding: 20,zIndex:777}:{padding: 20, elevation:10}}>
        <DropDownPicker
          open={AuthOpen}
          value={Authvalue}
          items={Authitems}
          setOpen={setAuthOpen}
          setValue={setAuthValue}
          setItems={setAuthItems}
          style = {{width: '100%',}}
          dropDownContainerStyle={{
            width: '100%',
            //zIndex: 100,
            //elevation:10,
          }}
          // listMode="SCROLLVIEW"
          // scrollViewProps={{
          //   nestedScrollEnabled: true,
          // }}
        />
        </View>

        <View>
        <Text style = {dark?styles.DarkInnnerHeadings:{...styles.InnnerHeadings}}>Name of Authorised Person For Verification</Text>
        </View>

        <View style={Platform.OS==='ios'?{padding: 20,zIndex:999}:{padding: 20,}}>
        <DropDownPicker
          searchable={true}
          open={AuthPersonOpen}
          value={AuthPersonvalue}
          items={AuthPersonitems}
          setOpen={setAuthPersonOpen}
          setValue={setAuthPersonValue}
          setItems={setAuthPersonItems}
          style = {{width: '100%',}}
          dropDownContainerStyle={{
            width: '100%',
            //zIndex:99,
            elevation:10
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        </View>

        <View>
        <Text onPress={{}} style = {dark?styles.DarkInnnerHeadings:{...styles.InnnerHeadings, ...{zIndex:-5}}}>Upload Remarks Stored in ______ </Text>
        </View>

        <View style={{...styles.fieldWithoutBottom, ...{zIndex:-5}}}>
        <View style={{flexDirection:'row'}}> 
        <RadioButton.Android
            value="yes"
            status={ choice === 'yes' ? 'checked' : 'unchecked' }
            onPress={() => setChoice('yes')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>Yes</Text>
        </View>
        <View style={{flexDirection:'row', paddingLeft:78,}}>
        <RadioButton.Android
            value="no"
            status={ choice === 'no' ? 'checked' : 'unchecked' }
            onPress={() => setChoice('no')}
            color = '#256173'
            uncheckedColor = '#256173'
            labelStyle={{marginRight: 20}}
          />
          <Text style={styles.fieldTextRadio}>No</Text>
        </View>
      </View>

      </View> : null }

      <TouchableOpacity style={{alignItems:'center',zIndex:-1}} onPress={UpdateQuery}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
                </View>
      </TouchableOpacity>
      
      </ScrollView>
      </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'flex-start',
        //alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    mainHeader:{
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
      headline: {
        padding: 5,
        backgroundColor:'#F3F3F3',
        width: '100%',
        //justifyContent:'space-between',
        marginTop:10,
        flexDirection: 'row'
    },
      darkHeadline: {
        padding: 5,
        backgroundColor:'#000',
        width: '100%',
        //justifyContent:'space-between',
        marginTop:10,
        flexDirection: 'row'
      },
      HeadlineText:{
          color:'#000',
          fontSize: 14,
          fontFamily: 'WorkSans-Bold',
      },
      darkHeadlineText:{
        color:'#fff',
        fontSize: 14,
        fontFamily: 'WorkSans-Bold',
    },
      fieldWithoutBottom: {
          paddingHorizontal:15, 
          paddingVertical:10, 
          width:'100%',
          flexDirection:'row',
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
        button: {
            backgroundColor: Colors.primary,
            padding: 15,
            marginTop: 20,
            width: Dimensions.get('window').width*0.5,
            borderRadius:10,
            alignItems:'center'
        },
        buttonText:{
            fontWeight: 'bold',
            color: '#fff',
          },
          InnnerHeadings:{
            paddingHorizontal: 20,
            fontWeight: '600',
            fontFamily: 'WorkSans-Regular',
          },
          DarkInnnerHeadings:{
            paddingHorizontal: 20,
            fontWeight: '600',
            fontFamily: 'WorkSans-Regular',
            color:'#fff'
          }
});

//make this component available to the app
export default EGCAUpload;
