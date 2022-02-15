//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import { ParamsContext } from '../params-context';
import { useSelector, useDispatch } from "react-redux";
import SQLite from 'react-native-sqlite-storage';
import {BuildLogbookData} from '../store/actions/BLAction'

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
const BLAircraft = ({navigation, route}) => {

const dataDispatcher = useDispatch();

 //const {fromScreen} = route.params;
 const [focused,setFocused] = React.useState(false);

 const onFocusChange = () => setFocused(true);
 const onFocusCancelled = () => setFocused(false);
 const [search,setSearch] = React.useState('')
 const [selectedId, setSelectedId] = React.useState(null);
 const [selectedIndex, setSelectedIndex] = React.useState(null);
 const { dark, theme, toggle } = React.useContext(ThemeContext);
 const [, setParams] = React.useContext(ParamsContext);

React.useEffect(() => {getAircrafts()}, [])

const searchQuery = async(dataToSearch) => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
  //dataDispatcher(BuildLogbookData({data: []}))
  let SearchedData = [];
  let SingleResult = '';
  setSearch(dataToSearch)
  //console.log('Searching for ', dataToSearch);
  db.transaction(tx => {
    tx.executeSql('SELECT id,user_id,aircraft_type FROM buildLogbook WHERE aircraft_type  LIKE "%'+dataToSearch+'%" AND user_id = "'+user.id+'"', [], (tx, result) => {
      if (result.rows.length > 0) {
        //alert('data available ');
       //console.log('Searched result raw: ', result1)
        for (let i = 0; i <= result.rows.length; i++) {
          SingleResult = {
          id: result.rows.item(i).id,
          user_id: result.rows.item(i).user_id,
          aircraft_type : result.rows.item(i).aircraft_type,
          }
          SearchedData.push(SingleResult);
          //console.log('single', SingleResult)
          //console.log(' Searched data', SearchedData);
          setFilteredData(SearchedData);
          dataDispatcher(BuildLogbookData({data: SearchedData}))
        }
        //setFilteredData(SearchedData);
        //console.log('Searched Result array: ', SearchedData)
      }else{
        setFilteredData([]);
        dataDispatcher(BuildLogbookData({data: []}))
        //console.log('No Data found')
      }
    });
  });
}

const getAircrafts = async() => {
    let user = await AsyncStorage.getItem('userdetails');
    user = JSON.parse(user);
  dataDispatcher(BuildLogbookData({data: []}))
  let data = [];
  db.transaction(tx => {
    tx.executeSql('SELECT id,user_id,aircraft_type from buildLogbook WHERE user_id="'+user.id+'" limit 20', [], (tx, result) => {
      //console.log(result);
      for (let i = 0 ; i <= result.rows.length ; i++) {
        data.push({
          id: result.rows.item(i).id,
          user_id: result.rows.item(i).user_id,
          aircraft_type : result.rows.item(i).aircraft_type,
        });
        //console.log('Aircrafts',data);
      
      // setData(data);
      setFilteredData(data);
      dataDispatcher(BuildLogbookData({data: data}))
      }
      });
  });
}

const getReduxData = useSelector(state => state.bl.data);
//console.log('from BLAircrafts list details', getReduxData.data);

//from sqlite

const Item = ({item, onPress, backgroundColor, textColor, indexPress}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.aircraft_type}</Text>
    </TouchableOpacity>
);

const renderItem = ({item, index}) => {
const backgroundColor = item.id === selectedId ? "#E8E8E8" : dark ? '#000' : "#fff";
const color = dark?'#fff':'#000';

const selectParams = () =>{ 
    if(route.params.fromScreen) //item.id === selectedId &&
    {
      setParams(previousParams => ({
        ...(previousParams || {}),
        childParam: 'value',
        itemId: item.id,
        itemName: item.aircraft_type,
        
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
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
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
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        justifyContent: 'space-around'
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
export default BLAircraft;
