//import liraries
import React, { Component } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text,SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, TextInput, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import { RadioButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {BaseUrl} from '../components/url.json';
import {BaseUrlAndroid} from '../components/urlAndroid.json';
import DgcaLogbookStyles from '../styles/dgcaLogbookStyles';
import { useDispatch, useSelector } from 'react-redux';
import {FTOData,Elog_verifiers,trainingV,testV,commercialV} from '../components/dummydropdown'
import { ThemeContext } from '../theme-context';

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

  const isFocused = useIsFocused();

  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const dataDispatcher = useDispatch();

    const [egca_user,setEGCAUSER] = React.useState('IPLTM2020023010'); //IPLTM2020023010
    const [egca_pwd,setEGCAPWD] = React.useState('Fighters12!');//Fighters12!
    const [arrow,setArrow] = React.useState(true);
    const [arrowSettings, setArrowSettings] = React.useState(true)
    const [FTOopen, setFTOOpen] = React.useState(false);
    const [FTOvalue, setFTOValue] = React.useState('');
    const [FTOitems, setFTOItems] = React.useState(FTOData);
    const [selectedPurpose, setSelectedPurpose] = React.useState([]);

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

    const [egca, setEgca] = React.useState('Commercial');
    const [choice, setChoice] = React.useState('no');
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState([]);
    const [trainingValue, setTrainingValue] = React.useState(trainingV);
    const [test, setTest] = React.useState([]);
    const [testValue, setTestValue] = React.useState(testV);
    const [commercial, setCommercial] = React.useState([]); 
    const [commercialValue, setCommercialValue] = React.useState(commercialV);

    //console.log('egca',egca)
    const egca_upload = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
      
        await fetch(Platform.OS==='ios'?BaseUrl+'update_egca_upload':BaseUrlAndroid+'update_egca_upload',{
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
         //console.log(resData);
         Alert.alert(resData.message);
      });
      }

      React.useEffect(() => {
        if(isFocused){
        SelectQuery()
        }
      },[isFocused]);
      
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
                     //console.log('setRosterAId', selectedPurpose)
                     setSelectedPurpose(selectedData)
                     setEGCAUSER(result.rows.item(i).egcaId)
                     setEGCAPWD(result.rows.item(i).egcaPwd)
                     setFTOValue(result.rows.item(i).FtoOperator)
                     setEgca(result.rows.item(i).FlightType)

                      // setTraining(result.rows.item(i).Purpose)
                      // setTest(result.rows.item(i).Purpose)
                      // setCommercial(result.rows.item(i).Purpose)

                      setAuthValue(result.rows.item(i).AuthVerifier)
                      setAuthPersonValue(result.rows.item(i).NameOfAuthVerifier)
                    }
                }
            );
        });
    }

    const PurposeData = egca==='Training'? training : egca==='Test'? test : egca==='Commercial'?commercial:[]
    console.log('purposeData',PurposeData)
    //setSelectedPurpose(PurposeData)

    const UpdateQuery = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let temData = [];

        if (!egca_user) {
          alert('Please fill EGCA ID');
          return;
        }
        if (!egca_pwd) {
          alert('Please fill EGCA Password');
          return;
        }
        if (!FTOvalue) {
          alert('Please select Fto operator');
          return;
        }
        if (!egca) {
          alert('Please select FlightType');
          return;
        }
        if (!PurposeData) {
          alert('Please select Purpose');
          return;
        }
        if (!Authvalue) {
          alert('Please select Authorised Person for verification');
          return;
        }
        if (!AuthPersonvalue) {
          alert('Please select Name of Authorised Person for verification');
          return;
        }
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
      //console.log('From EGCADATA', getReduxData);

      //Sql ends

    return (
      
      <SafeAreaView style={[styles.container,{ backgroundColor: theme.backgroundColor }]}>
        <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? "padding" : null}>
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={{paddingBottom: 60}} >

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
        <View style={Platform.OS==='ios'?{padding: 20,zIndex:666}:{padding: 20}}>
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

      

      {/* {selectedPurpose!==[]?<View style={{paddingLeft:20,paddingBottom: 5}}>
        <Text>{selectedPurpose.Purpose}</Text>
       </View>:null} */}

        {/* {egca !== "Non-commercial" ?<View>
        <Text style = {dark?styles.DarkInnnerHeadings:styles.InnnerHeadings}>Purpose</Text>
        </View>: null}
        {egca !== "Non-commercial" ? <View style={Platform.OS==='ios'?{padding: 20,zIndex:888}:{padding:20,}}>
          <DropDownPicker
            zIndex={3000}
            zIndexInverse={1000}
            searchable={true}
            multiple={true}
            min={0}
            max={5}
            open={open}
            value={PurposeData}
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
          //onChangeItem={(value)=> setSelectedPurpose(value)}
        />
        </View> : null}

        {PurposeData!==[]?<View style={{paddingLeft:20,paddingBottom: 5}}>
        <Text style={{color:dark?'#fff':'#000'}}>{PurposeData[0]}</Text>
        <Text style={{color:dark?'#fff':'#000'}}>{PurposeData[1]}</Text>
        <Text style={{color:dark?'#fff':'#000'}}>{PurposeData[2]}</Text>
        <Text style={{color:dark?'#fff':'#000'}}>{PurposeData[3]}</Text>
        <Text style={{color:dark?'#fff':'#000'}}>{PurposeData[4]}</Text>
      </View>: null} */}

        <View>
        <Text style = {dark?{...styles.DarkInnnerHeadings}:{...styles.InnnerHeadings,}}>Authorised Person For Verification</Text>
        </View>

        <View style={Platform.OS==='ios'?{padding: 20,zIndex:777}:{padding: 20, elevation:10}}>
        <DropDownPicker
          zIndex={2000}
          zIndexInverse={2000}
          open={AuthOpen}
          value={Authvalue}
          items={Authitems}
          setOpen={setAuthOpen}
          setValue={setAuthValue}
          setItems={setAuthItems}
          style = {{width: '100%',}}
          dropDownContainerStyle={{
            width: '100%',
            //height: 50
            //zIndex: 999,
            //elevation:10,
          }}
           listMode="SCROLLVIEW"
          // scrollViewProps={{
          //   nestedScrollEnabled: true,
          // }}
        />
        </View>

        <View>
        <Text style = {dark?styles.DarkInnnerHeadings:{...styles.InnnerHeadings}}>Name of Authorised Person For Verification</Text>
        </View>

        <View style={Platform.OS==='ios'?{padding: 20,zIndex:666}:{padding: 20,}}>
        <DropDownPicker
          zIndex={1000}
          zIndexInverse={3000}
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
      </KeyboardAvoidingView>
      </SafeAreaView>
      
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginTop:10,
        flexDirection: 'row'
    },
      darkHeadline: {
        padding: 5,
        backgroundColor:'#000',
        width: '100%',
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
      },
      fieldTextRadio: {
        fontSize: 14,
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
