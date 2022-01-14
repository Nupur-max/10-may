//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput,Dimensions, FlatList ,TouchableOpacity ,ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../theme-context';
import {PeopleDummy} from '../../components/dummyLogBookListing';
import { ParamsContext } from '../../params-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';

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
const People = ({navigation,route}) => {

  const getReduxData = useSelector(state => state.display.AirlineDispatched);
  console.log ('peopleDispatcher', getReduxData.SelectedAirline)
 
  const [focused,setFocused] = React.useState(false);

 const onFocusChange = () => setFocused(true);
 const onFocusCancelled = () => setFocused(false);

 const { dark, theme, toggle } = React.useContext(ThemeContext);

 const [, setParamsPic ] = React.useContext(ParamsContext);
 const [, setParamsSic ] = React.useContext(ParamsContext);
 const [, setParamsInstructor ] = React.useContext(ParamsContext);
 const [, setParamsRc1 ] = React.useContext(ParamsContext);
 const [, setParamsRc2 ] = React.useContext(ParamsContext);
 const [, setParamsRc3 ] = React.useContext(ParamsContext);
 const [, setParamsRc4 ] = React.useContext(ParamsContext); 
 const [, setParamsStudent ] = React.useContext(ParamsContext);

 const [selectedId, setSelectedId] = React.useState('');

 const[data,setData] = React.useState([])
 const[filteredData, setFilteredData] = React.useState([])
 const[search, setSearch] = React.useState('')
 const[pilotsName, setPilotsName] = React.useState('')

 const [loading, setLoading] = React.useState(true);
 const [offset, setOffset] = React.useState(0);

 React.useEffect(() => {AllPeople(), getDataQuery()}, []);

 const AllPeople = async() => {
  let user = await AsyncStorage.getItem('userdetails');
  user = JSON.parse(user);

  await fetch(BaseUrl+'display_people',{
    method : 'POST',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      //"user_id": user.id,
      //"date_format": date,             
 })
}).then(res => res.json())
.then(resData => {
  //console.log('mesg==>', resData.message)
  //console.log('data---->', resData.data);
  //setData(resData.data);
  //setFilteredData(resData.data);
  // console.log('dfjgdhgf--->', df)
   for (var j = 0; j < resData.data.length; j++){
         //console.log(resData.data[j].id);
         //setIdent(resData.data[j].ident)
         //setId(resData.data[j].id)
         //console.log('data---->', data)
  //       setDf(resData.data[j].date_format);
  //       console.log('df-->', df);
  //       console.log ('name-->',resData.data[j].aircraft_type)
       }
});
};

//Sqlite
const getDataQuery = async() => {
  let user = await AsyncStorage.getItem('userdetails');
  user = JSON.parse(user);
  let temData = [];
  prePopulateddb.transaction(tx => {
    tx.executeSql('SELECT * from pilots WHERE Airline = "'+getReduxData.SelectedAirline+'" lIMIT 10', [], (tx, result) => {
      //setOffset(offset + 10);
      if (result.rows.length > 0) {
        //alert('data available ');
        console.log('result', result)
      }
      for (let i = 0; i < result.rows.length; i++) {
        //console.log('name: ', result.rows.item(i).airline_name, 'loginlink: ', result.rows.item(i).loginUrl)
        temData.push({
          id : result.rows.item(i).id,
          Airline: result.rows.item(i).Airline,
          Egca_reg_no: result.rows.item(i).Egca_reg_no,
          Name: result.rows.item(i).Name,
          pilotId: result.rows.item(i).pilotId,
        });
      //console.log('people data',temData);
      //setData(temData);
      setFilteredData(temData);
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

//React.useEffect(() => {getDataQuery()}, []);


// const renderFooter = () => {
//   return (
//     //Footer View with Load More button
//     <View style={styles.footer}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={getDataQuery}
//         //On Click of button load more data
//         style={styles.loadMoreBtn}>
//         <Text style={styles.btnText}>Load More</Text>
//         {loading ? (
//           <ActivityIndicator
//             color="white"
//             style={{marginLeft: 8}} />
//         ) : null}
//       </TouchableOpacity>
//     </View>
//   );
// };
//sqlite Ends

const searchQuery = (dataToSearch) => {
  let SearchedData = [];
  let SingleResult = '';
  setSearch(dataToSearch)
  console.log('Searching for ', dataToSearch);
  prePopulateddb.transaction(tx => {
    tx.executeSql('SELECT * FROM pilots WHERE Name  LIKE "%'+dataToSearch+'%" limit 10', [], (tx, result1) => {
      if (result1.rows.length > 0) {
        //alert('data available ');
        console.log('Searched result raw: ', result1)
        for (let i = 0; i <= result1.rows.length; i++) {
          SingleResult = {
            id : result1.rows.item(i).id,
            Airline: result1.rows.item(i).Airline,
            Egca_reg_no: result1.rows.item(i).Egca_reg_no,
            Name: result1.rows.item(i).Name,
            pilotId: result1.rows.item(i).pilotId,
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

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {item.Egca_reg_no === 'self' ?
    <Text style={[styles.Name, textColor]}>{item.Name}</Text> : <Text style={[styles.Name, textColor]}>{item.Name}({item.Egca_reg_no})</Text> }
      {/* <View>
          <Text style={[styles.title, textColor]}> Airline Code : {item.code}</Text>
      </View> */}
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    //setPilotsName(item.Name)
    //console.log('typeeeee---->',item.Airline_code);
    const backgroundColor = item.id === selectedId ? "#E8E8E8" : "#fff";
    const color = 'black';
    // const fetchToBuildLogBook = item.id === selectedId ? navigation.navigate('BuildLogbook',{
    //   itemId: item.id,
    //   itemName: item.aircraft_name,
    // }) : '';

    const selectParams = () =>{ 
    setSelectedId(item.id);
    if(selectedId && route.params.from === 'pic')
    {
      setParamsPic(previousParams => ({
        ...(previousParams || {}),
        childParam: 'value',
        RoasterP1 :  item.Name,
       
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'sic')
    {
      setParamsSic(previousParams => ({
        ...(previousParams || {}),
        childParam : 'value',
        RoasterP2 : item.Name,
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'instructor')
    {
      setParamsInstructor(previousParams => ({
        ...(previousParams || {}),
        childParam2 : 'value2',
        RoasterInstructor : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'rc1')
    {
      setParamsRc1(previousParams => ({
        ...(previousParams || {}),
        childParam3 : 'value3',
        RoasterRC1 : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'rc2')
    {
      setParamsRc2(previousParams => ({
        ...(previousParams || {}),
        childParam4 : 'value4',
        RoasterRC2 : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'rc3')
    {
      setParamsRc3(previousParams => ({
        ...(previousParams || {}),
        childParam5 : 'value5',
        RoasterRC3 : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'rc4')
    {
      setParamsRc4(previousParams => ({
        ...(previousParams || {}),
        childParam6 : 'value6',
        RoasterRC4 : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
    else if(item.id === selectedId && route.params.from === 'student')
    {
      setParamsStudent(previousParams => ({
        ...(previousParams || {}),
        childParam7 : 'value7',
        RoasterStudent : item.Egca_reg_no === 'self' ? item.Name : item.Name+'('+item.Egca_reg_no+')',
      }));
      navigation.goBack();
    }
  }

    return (
      <Item
        item={item}
        onPress={() => {selectParams()}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
}

    return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <View style={styles.header}>
            <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{padding:6}} onPress={()=>navigation.goBack()} />
            <Text style={styles.aircrafts}>People</Text>
            </View>
            <View style={{backgroundColor:'#F3F3F3', padding:10, flexDirection:'row'}}>
               <View style={(focused) ? styles.searchbar2 : styles.searchbar}>
                 <MaterialCommunityIcons name="magnify" color={'#000'} size={25} style={{padding:6}} />
                 <TextInput 
                 onFocus={onFocusChange}
                 placeholder='Search' 
                 placeholderTextColor = "#D0D0D0"
                 value={search}
                 onChangeText={(inputText)=>searchQuery(inputText)}
                 style={{marginTop: -7, fontSize:15, width:100, lineHeight:25}}
                 />
               </View>
               {focused ? <Text style={styles.cancelButton} onPress={onFocusCancelled}>Cancel</Text> : null}
            </View>
            <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={1}
            extraData={selectedId}
            onEndReachedThreshold={1} 
            //ListFooterComponent={renderFooter}
            />
            <View style={styles.footer}>
            <TouchableOpacity onPress={()=> navigation.navigate('SetPeople')}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>ADD</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
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
          //paddingHorizontal:150,
      },
      item: {
        padding: 10,
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
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
      Name: {
        fontFamily:'WorkSans-Regular',
        fontSize : 16,
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
export default People;