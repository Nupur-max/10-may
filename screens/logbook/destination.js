//import liraries
import React, { Component } from 'react';
import { View, Text,SafeAreaView, StyleSheet, TextInput, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../theme-context';
import {Places} from '../../components/dummyLogBookListing';
import { ParamsContext } from '../../params-context';
import AsyncStorage from '@react-native-community/async-storage';
import {Filter} from '../../styles/styles'
import SegmentedControlTab from "react-native-segmented-control-tab";

import {BaseUrl} from '../../components/url.json';

import SQLite from 'react-native-sqlite-storage';

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
const Destination = ({navigation,route}) => {
 const [focused,setFocused] = React.useState(false);

 const onFocusChange = () => setFocused(true);
 const onFocusCancelled = () => setFocused(false);

 const { dark, theme, toggle } = React.useContext(ThemeContext);
 const [, setParamsFrom ] = React.useContext(ParamsContext);
 const [, setParamsTo ] = React.useContext(ParamsContext);
 const [, setParamsApproaches ] = React.useContext(ParamsContext);

 const [selectedId, setSelectedId] = React.useState('');

 const[data, setData] = React.useState([]) 
 const[filteredData, setFilteredData] = React.useState([])
 const[search, setSearch] = React.useState('')
 const[iata, setIata] = React.useState('')
 const [icao, setIcao] = React.useState('')
 //const [id,setId] = React.useState('')
 //const [ident, setIdent] = React.useState('');
 const [dataFetched , setDataFetched ] = React.useState(false)

const [loading, setLoading] = React.useState(false);
const [offset, setOffset] = React.useState(0);
const [isListEnd, setIsListEnd] = React.useState(false);

const [selectedIndex, setSelectedIndex] = React.useState(0)

 React.useEffect(() => {getPrepopulatedDataQuery()}, []);

const searchQuery = (dataToSearch) => {
  let SearchedData = [];
  let SingleResult = '';
  setSearch(dataToSearch)
  console.log('Searching for ', dataToSearch);
  prePopulateddb.transaction(tx => {
    tx.executeSql('SELECT * FROM Airport_table WHERE ident  LIKE "%'+dataToSearch+'%" OR name  LIKE "%'+dataToSearch+'%" OR city1 LIKE "%'+dataToSearch+'%" OR city2 LIKE "%'+dataToSearch+'%" OR ICAO_code LIKE "%'+dataToSearch+'%" OR IATA_code LIKE "%'+dataToSearch+'%" limit 10', [], (tx, result1) => {
      if (result1.rows.length > 0) {
        //alert('data available ');
        console.log('Searched result raw: ', result1)
        for (let i = 0; i <= result1.rows.length; i++) {
          SingleResult = {
            id : result1.rows.item(i).airportID,
            ident: result1.rows.item(i).ident,
            Airport_name: result1.rows.item(i).name,
            type: result1.rows.item(i).type,
            city: result1.rows.item(i).city1,
            city2: result1.rows.item(i).city2,
            country: result1.rows.item(i).country,
            lat: result1.rows.item(i).latitude,
            long:result1.rows.item(i).longitude,
            elevation: result1.rows.item(i).elevation,
            timezone : result1.rows.item(i).timezone,
            dst : result1.rows.item(i).DST,
            dst_status : result1.rows.item(i).DST_Status,
            dst_startDate : result1.rows.item(i).DST_StartDate,
            dst_endDate : result1.rows.item(i).DST_EndDate,
            icao_code : result1.rows.item(i).ICAO_code,
            iata_code : result1.rows.item(i).IATA_code,
            source : result1.rows.item(i).source,
          }
          SearchedData.push(SingleResult);
          console.log('single', SingleResult)
          console.log(' Searched data', SearchedData);
          setFilteredData(SearchedData);
        }
        //setFilteredData(SearchedData);
        console.log('Searched Result array: ', SearchedData)
      }else{
        setFilteredData([]);
        console.log('No Data found')
      }
    });
  });
}

const getPrepopulatedDataQuery = () => {
  let data = [];
  //console.log('testing');
  prePopulateddb.transaction(tx => {
    tx.executeSql('SELECT * from Airport_table LIMIT 20', [], (tx, result1) => {
      // if (result.rows.length > 0) {
      //   setOffset(offset + 1);
      //   // After the response increasing the offset
      //   setLoading(false);
      // } else {
      //   setIsListEnd(true);
      //   setLoading(false);
      // }
      //alert('consoling');
      console.log(result1);
      for (let i = 0 ; i <= result1.rows.length ; i++) {
        data.push({
            id : result1.rows.item(i).airportID,
            ident: result1.rows.item(i).ident,
            Airport_name: result1.rows.item(i).name,
            type: result1.rows.item(i).type,
            city: result1.rows.item(i).city1,
            city2: result1.rows.item(i).city2,
            country: result1.rows.item(i).country,
            lat: result1.rows.item(i).latitude,
            long:result1.rows.item(i).longitude,
            elevation: result1.rows.item(i).elevation,
            timezone : result1.rows.item(i).timezone,
            dst : result1.rows.item(i).DST,
            dst_status : result1.rows.item(i).DST_Status,
            dst_startDate : result1.rows.item(i).DST_StartDate,
            dst_endDate : result1.rows.item(i).DST_EndDate,
            icao_code : result1.rows.item(i).ICAO_code,
            iata_code : result1.rows.item(i).IATA_code,
            source : result1.rows.item(i).source,
        });
        console.log('places data',data);
        setDataFetched(false)
      
      // setData(data);
      setFilteredData(data);
      }
      });
  });
};

const renderFooter = () => {
  return (
    // Footer View with Loader
    <View style={styles.footer}>
      {loading ? (
        <ActivityIndicator
          color="black"
          style={{margin: 15}} />
      ) : null}
    </View>
  );
};

const handleIndexChange = (index) => {
  setSelectedIndex(index);
};
// }

 const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
    <View style= {{flexDirection:'column', width:'40%'}}>
      <Text style={[styles.ident, textColor]}>{item.ident}</Text>
      <Text style={[styles.city, textColor]}>{item.city}</Text>
    </View>
    <View style={{width:'60%'}}>
    <Text style={[styles.airportName, textColor]}>{item.Airport_name}</Text>
    </View>
    </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    //console.log('typeeeee---->',item.name);
    const backgroundColor = item.id === selectedId ? dark?"#000":"#fff" : dark?"#000":"#fff";
    const color = dark?'#fff':'#000';
    // const fetchToBuildLogBook = item.id === selectedId ? navigation.navigate('BuildLogbook',{
    //   itemId: item.id,
    //   itemName: item.aircraft_name,
    // }) : '';

    const selectParams = () =>{ 
    if(route.params.from === 'From')
    {
      setParamsFrom(previousParams => ({
        ...(previousParams || {}),
        childParam: 'value',
        FromItemId : item.id,
        FromItemCode : item.ident,
        FromItemName : item.Airport_name,
        Fromitemtype: item.type,
        FromCity1 : item.city,
        FromCity2 : item.city2,
        FromCountry : item.country,
        RoasterFrom_lat : item.lat,
        RoasterFrom_long : item.long,
        FromElevation : item.elevation,
        FromTimeZone : item.timezone,
        FromDst : item.dst,
        FromDstStatus : item.dst_status,
        FromDst_startDate : item.dst_startDate,
        FromDst_endDate : item.dst_endDate,
        RoasterFrom : item.icao_code,
        FromItemiata : item.iata_code,
        FromSource : item.source,
       
      }));
      navigation.goBack();
    }
    else if( route.params.from === 'to')//item.id === selectedId &&
    {
        setParamsTo(previousParams => ({
        ...(previousParams || {}),
        childParam1 : 'value1',
        ToItemId : item.id,
        ToItemCode : item.ident,
        ToItemName : item.Airport_name,
        Toitemtype: item.type,
        ToCity1 : item.city,
        ToCity2 : item.city2,
        ToCountry : item.country,
        RoasterTo_lat : item.lat,
        RoasterTo_long : item.long,
        ToElevation : item.elevation,
        ToTimeZone : item.timezone,
        ToDst : item.dst,
        ToDstStatus : item.dst_status,
        ToDst_startDate : item.dst_startDate,
        ToDst_endDate : item.dst_endDate,
        RoasterTo : item.icao_code,
        ToItemiata : item.iata_code,
        ToSource : item.source,
      }));
      navigation.goBack(); 
    }
    else if(route.params.from === 'Approaches')
    {
      setParamsApproaches(previousParams => ({
        ...(previousParams || {}),
        childParam2 : 'value2',
        ApproachItemCode : item.ident,
      }));
      navigation.goBack();
    }
  }

    return (
      <Item
        item={item}
        onPress={() => {setSelectedId(item.id); selectParams()}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
}

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <View style={styles.header}>
            <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
            <Text style={styles.aircrafts}>Places</Text>
            </View>
            <View style={{backgroundColor:dark?'#000':'#F3F3F3', padding:10, flexDirection:'row'}}>
               <View style={(focused) ? styles.searchbar2 : styles.searchbar}>
                 <MaterialCommunityIcons name="magnify" color={'#000'} size={25} style={{padding:6}} />
                 <TextInput 
                 onFocus={onFocusChange}
                 placeholder='Search For Places'
                 value={search}
                 onChangeText={(inputText)=>searchQuery(inputText)} 
                 placeholderTextColor = "#D0D0D0"
                 style={{marginTop: -7, fontSize:15, width:'100%', lineHeight:25}}
                 />
               </View>
               {focused ? <Text style={dark?styles.DarkcancelButton:styles.cancelButton} onPress={onFocusCancelled}>Cancel</Text> : null}
            </View>
            <View style={{backgroundColor:dark?'#000':'#fff',}}>
              {focused?<SegmentedControlTab
                  values={["IATA/ICAO", "ALL", "MINE"]}
                  selectedIndex={selectedIndex}
                  onTabPress={(index) => handleIndexChange(index)}
                  tabsContainerStyle={{padding:10}}
                  tabStyle={{borderColor:'#256173'}}
                  tabTextStyle={{color:'#256173'}}
                  activeTabStyle={{backgroundColor:'#256173'}}
                />
              :null}
            </View>
            <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={1}
            // ListFooterComponent={renderFooter}
            // onEndReached={getPrepopulatedDataQuery}
            // onEndReachedThreshold={2}
            extraData={selectedId}
            />
           <View style={styles.footer}>
            <TouchableOpacity onPress={()=> navigation.navigate('SetDestination')}>
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
        //padding: 10,
        width: '80%',
        //borderRadius: 10,
        flexDirection: 'row',
        //paddingVertical: 10,
      },
      cancelButton: {
          fontSize: 15,
          marginLeft: 10,
          marginTop: 5,
      },
      DarkcancelButton: {
        fontSize: 15,
        marginLeft: 10,
        marginTop: 5,
        color:'#fff',
      },
      item: {
        padding: 10,
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
      },
      ident: {
        fontFamily:'WorkSans-Regular',
        fontSize: 16
      },
      airportName: {
        fontFamily:'WorkSans-Regular',
        fontSize: 12,
        paddingVertical : 15,
      },
      city: {
        fontFamily:'WorkSans-Regular',
        fontSize: 13,
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
    }
});

//make this component available to the app
export default Destination;
