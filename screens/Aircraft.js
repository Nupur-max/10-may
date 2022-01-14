//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../params-context';

import {BaseUrl} from '../components/url.json';
import {Logbook} from '../styles/styles';
import { set } from 'react-native-reanimated';

import { useSelector, useDispatch } from "react-redux";
import {fetchAircrafts} from '../store/actions/aircraftAction';
import {connect} from 'react-redux';
import {addUser} from '../store/actions/aircraftAction'
import {DummyAircrafts} from '../components/dummyAircraft'
import SQLite from 'react-native-sqlite-storage';
import Swipeout from 'react-native-swipeout';
import tr from 'date-fns/locale/tr';
import {AircraftData} from '../store/actions/aircraftAction'

const db = SQLite.openDatabase(
  {
    name: 'autoflightlogdb.db',
    createFromLocation: 1,
  },
  () => {
    //alert('successfully executed');
  },
  error => {
    alert('db error');
  },
);




// create a component
const Aircraft = ({navigation, route}) => {

const dataDispatcher = useDispatch();

 //const {fromScreen} = route.params;
 const [focused,setFocused] = React.useState(false);

 const onFocusChange = () => setFocused(true);
 const onFocusCancelled = () => setFocused(false);

 const [data,setData] = React.useState([]);
 const [filteredData,setFilteredData] = React.useState([]);
 const [search,setSearch] = React.useState('')
 const [selectedId, setSelectedId] = React.useState(null);
 const [selectedIndex, setSelectedIndex] = React.useState(null);
 const [selectedAtype, setSelectedAtype] = React.useState(null);
 const [An, setAn] = React.useState('')
 const [activeRowKey, setActiveRowKey] = React.useState(null)
 //const [GetIndex, setIndex] = React.useState('')

 const { dark, theme, toggle } = React.useContext(ThemeContext);

 const [, setParams] = React.useContext(ParamsContext);
 const [, setParamsDisplay] = React.useContext(ParamsContext)
 const [, setParamsLogbook] = React.useContext(ParamsContext) 
 const [, setParamsBuildLogbook] = React.useContext(ParamsContext)




React.useEffect(() => {getAircrafts()}, [])

const searchQuery = (dataToSearch) => {
  dataDispatcher(AircraftData({data: []}))
  let SearchedData = [];
  let SingleResult = '';
  setSearch(dataToSearch)
  console.log('Searching for ', dataToSearch);
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM Aircrafts WHERE AircraftType  LIKE "%'+dataToSearch+'%"', [], (tx, result1) => {
      if (result1.rows.length > 0) {
        //alert('data available ');
        console.log('Searched result raw: ', result1)
        for (let i = 0; i <= result1.rows.length; i++) {
          SingleResult = {
            id : result1.rows.item(i).id,
            type : result1.rows.item(i).AircraftType,
            aircraft_id : result1.rows.item(i).aircraft_id,
            category : result1.rows.item(i).Category,
            engine : result1.rows.item(i).Engine,
            engineName : result1.rows.item(i).EngineName,
            class : result1.rows.item(i).Class,
            crew : result1.rows.item(i).Crew,
          }
          SearchedData.push(SingleResult);
          console.log('single', SingleResult)
          console.log(' Searched data', SearchedData);
          setFilteredData(SearchedData);
          dataDispatcher(AircraftData({data: SearchedData}))
        }
        //setFilteredData(SearchedData);
        console.log('Searched Result array: ', SearchedData)
      }else{
        setFilteredData([]);
        dataDispatcher(AircraftData({data: []}))
        console.log('No Data found')
      }
    });
  });
}

const getAircrafts = () => {
  dataDispatcher(AircraftData({data: []}))
  let data = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * from Aircrafts limit 20', [], (tx, result) => {
      console.log(result);
      for (let i = 0 ; i <= result.rows.length ; i++) {
        data.push({
          id:     result.rows.item(i).id,
          type :  result.rows.item(i).AircraftType,
          aircraft_id : result.rows.item(i).aircraft_id,
          category : result.rows.item(i).Category,
          engine : result.rows.item(i).Engine,
          EngineName : result.rows.item(i).EngineName,
          class : result.rows.item(i).Class,
          crew : result.rows.item(i).Crew,
        });
        //console.log('Aircrafts',data);
      
      // setData(data);
      setFilteredData(data);
      dataDispatcher(AircraftData({data: data}))
      }
      });
  });
}

const getReduxData = useSelector(state => state.aircrafts.data);
//console.log('from Aircrfats list details', getReduxData.data);

//from sqlite
//console.log('dfdfh',filteredData.indexOf(selectedId))
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
        Alert.alert(
          'Alert',
          'Are you sure you want to delete ?',
          [
            {text : 'No', onPress : () => console.log('Cancel Pressed'), style:'cancel'},
            {text : 'Yes', onPress: () => {
              getReduxData.data.splice(getReduxData.data, 1);
              
            }},
          ],
        )
      },
      text: 'Delete', type: 'delete'
    }
  ],
  rowId: selectedId,
  sectionId: 1
}

const Item = ({item, onPress, backgroundColor, textColor, indexPress}) => (
   <Swipeout {...swipeSettings}>
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.type}</Text>
    </TouchableOpacity>
    </Swipeout>
 );

const renderItem = ({item, index}) => {
   //console.log('Index---->', index);
   //setIndex(item.index)
    const backgroundColor = item.id === selectedId ? "#E8E8E8" : dark ? '#000' : "#fff";
    const color = dark?'#fff':'#000';
    // const fetchToBuildLogBook = item.id === selectedId ? navigation.navigate('BuildLogbook',{
    //   itemId: item.id,
    //   itemName: item.aircraft_name,
    // }) : '';

    const selectParams = () =>{ 
    if(route.params.fromScreen) //item.id === selectedId &&
    {
      setParams(previousParams => ({
        ...(previousParams || {}),
        childParam: 'value',
        itemId: item.id,
        itemName: item.type,
        itemId : item.aircraft_id,
        itemCategory: item.category,
        itemEngine: item.engine,
        itemEngineName: item.EngineName,
        itemEngineClass: item.class,
        
      }));
      navigation.goBack();
    }
    else if(route.params.fromScreenDisplay)
    {
      setParamsDisplay(previousParams => ({
        ...(previousParams || {}),
        childParam1 : 'value1',
        displayAirType : item.type,
        displayAirId : item.aircraft_id,
      }));
      navigation.goBack();
    }
    else if( route.params.fromScreenLogbook)
    {
      setParamsLogbook(previousParams => ({
        ...(previousParams || {}),
        childParam2 : 'Aircraft',
        RoasterAType : item.type, 
        RoasterAId : item.aircraft_id,
      }));
      navigation.goBack();
    }
    else if(route.params.fromScreenBuildLogbbook)
    {
      setParamsBuildLogbook(previousParams => ({
        ...(previousParams || {}),
        childParam3 : 'value3',
        BuildlogBookAirType : item.type,
        BuildlogBookAirId : item.aircraft_id,
        BuildLogbookCategory : item.category,
        BuildLogbookEngine : item.engine,
        BuildLogbookEngineName : item.EngineName,
        BuildLogbookClass : item.class,
        BuildLogbookCrew : item.crew,
      }));
      navigation.goBack();
    }
  }

    return (
      <Item
        item={item}
        onPress={() => {setSelectedId(item);selectParams()}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
}

return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
          <View style={styles.header}>
          <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
          <Text style={styles.aircrafts}>Aircrafts</Text>
          </View>
            <View style={{backgroundColor:dark?'#000':'#F3F3F3', padding:10, flexDirection:'row'}}>
               <View style={(focused) ? styles.searchbar2 : styles.searchbar}>
                 <MaterialCommunityIcons name="magnify" color={'#000'} size={25} style={{padding:6}} />
                 <TextInput 
                 onFocus={onFocusChange}
                 placeholder='Type aircraft name here' 
                 placeholderTextColor = "#D0D0D0"
                 value={search}
                 onChangeText={(inputText)=>searchQuery(inputText)}
                 style={{marginTop: -7, fontSize:15, width:'100%',}}
                 />
               </View>
               {focused ? <Text style={dark?styles.DarkCancelButton:styles.cancelButton} onPress={onFocusCancelled}>Cancel</Text> : null}
            </View>
            <FlatList
            data={getReduxData.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => {item.type,index}}
            numColumns={1}
            extraData={selectedId, selectedIndex}
            />
            <View style={dark?styles.Darkfooter:styles.footer}>
            <TouchableOpacity onPress={()=> navigation.navigate('SetAircraft')}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>ADD New</Text>
                </View>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    header:{
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
    searchbar: {
      //paddingLeft: 10,
      backgroundColor: '#fff',
      //padding: 10,
      width: '100%',
      //borderRadius: 10,
      flexDirection: 'row',
      //paddingVertical: 10,
    },
    searchbar2: {
        //paddingLeft: 10,
        backgroundColor: '#fff',
        width: '80%',
        //borderRadius: 10,
        flexDirection: 'row',
        //paddingVertical: 10,
      },
      cancelButton: {
          fontSize: 15,
          marginLeft: 10,
          marginTop: 5,
          //paddingHorizontal:150,
          color: '#000',
      },
      item:{
        padding:20,
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
      },
      footer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F3F3F3'
      },
      Darkfooter: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#000'
      },
      button: {
        backgroundColor: '#256173',
        padding: 15,
        width: Dimensions.get('window').width*0.5,
        borderRadius:30,
        alignItems:'center'
    },
    buttonText:{
      fontWeight: 'bold',
      color: '#fff',
    },
    //dark
    DarkCancelButton: {
      fontSize: 15,
      marginLeft: 10,
      marginTop: 5,
      color: '#fff',
    },
});

//make this component available to the app
export default Aircraft;
