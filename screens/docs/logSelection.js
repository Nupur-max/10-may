import React from 'react';
import {View, StyleSheet, Text, FlatList, Switch, SafeAreaView, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { Checkbox } from 'react-native-paper';

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

export default (props) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(false)
  const [item,setItem] = React.useState(true);
  const [data, setData] = React.useState([
    // { label: 'temperature', selected:false },
    // { label: 'humidity', },
    // { label: 'light', },
    // { label: 'move', },
    // { label: 'sound', },
    // { label: 'carbon dioxide', },
    // { label: 'air pollution', }
  ])

    //Sqlite starts
    React.useEffect(() => { getLogbookData() }, []);

    const getLogbookData = async () => {
      let user = await AsyncStorage.getItem('userdetails');
      user = JSON.parse(user);
      let temData = [];
      //dataDispatcher(LogListData({data: []}))
      prePopulateddb.transaction(tx => {
          tx.executeSql('SELECT * from logbook WHERE user_id = "'+user.id+'"', [], (tx, result) => {
              //setOffset(offset + 10);
              if (result.rows.length > 0) {
                  //alert('data available ');
                  console.log('result', result)
              }
              for (let i = 0; i <= result.rows.length; i++) {
                  temData.push({
                      id : result.rows.item(i).id,
                      tag : result.rows.item(i).tag,
                      user_id: result.rows.item(i).user_id,
                      flight_no : result.rows.item(i).flight_no,
                      date: result.rows.item(i).date,
                      day : result.rows.item(i).day,
                      actual_Instrument : result.rows.item(i).actual_Instrument,
                      aircraftReg :  result.rows.item(i).aircraftReg,
                      aircraftType : result.rows.item(i).aircraftType,
                      approach1 : result.rows.item(i).approach1,
                      approach2 : result.rows.item(i).approach2,
                      dayLanding : result.rows.item(i).dayLanding,
                      dayTO : result.rows.item(i).dayTO,
                      dual_day : result.rows.item(i).dual_day,
                      dual_night : result.rows.item(i).dual_night,
                      flight : result.rows.item(i).flight,
                      from_airportID : result.rows.item(i).from_airportID,
                      from_altitude : result.rows.item(i).from_altitude,
                      from_city : result.rows.item(i).from_city, 
                      from_country : result.rows.item(i).from_country, 
                      from_dayLightSaving : result.rows.item(i).from_dayLightSaving,
                      from_source : result.rows.item(i).from_source, 
                      from_lat : result.rows.item(i).from_lat,
                      from_long : result.rows.item(i).from_long,
                      from_name : result.rows.item(i).from_name,
                      from_nameIATA : result.rows.item(i).from_nameIATA,
                      from : result.rows.item(i).from_nameICAO, 
                      from_timeZone : result.rows.item(i).from_timeZone, 
                      from_type : result.rows.item(i).from_type,
                      fullStop : result.rows.item(i).fullStop,
                      ifr_vfr : result.rows.item(i).ifr_vfr,
                      instructional: result.rows.item(i).instructional,
                      instructor : result.rows.item(i).instructor,
                      landing : result.rows.item(i).inTime,
                      night : result.rows.item(i).inTime,
                      nightLanding : result.rows.item(i).nightLanding,
                      nightTO : result.rows.item(i).nightTO,
                      chocksOffTime : result.rows.item(i).offTime, 
                      chocksOnTime : result.rows.item(i).onTime,
                      takeOff : result.rows.item(i).outTime,
                      p1 : result.rows.item(i).p1,
                      p1_us_day : result.rows.item(i).p1_us_day,
                      p1_us_night : result.rows.item(i).p1_us_night, 
                      p2 : result.rows.item(i).p2,
                      pic_day : result.rows.item(i).pic_day,
                      pic_night : result.rows.item(i).pic_night,
                      stl : result.rows.item(i).stl,
                      RC1 : result.rows.item(i).reliefCrew1,
                      RC2 : result.rows.item(i).reliefCrew2,
                      RC3 : result.rows.item(i).reliefCrew3,
                      RC4 : result.rows.item(i).reliefCrew4,
                      route : result.rows.item(i).route,
                      sic_day : result.rows.item(i).sic_day,
                      sic_night : result.rows.item(i).sic_night,
                      sim_instructional : result.rows.item(i).sim_instructional,
                      sim_instrument : result.rows.item(i).sim_instrument,
                      selected_role : result.rows.item(i).selected_role,
                      student : result.rows.item(i).student,
                      to : result.rows.item(i).to_nameICAO,
                      to_lat :  result.rows.item(i).to_lat,
                      to_long : result.rows.item(i).to_long,
                      totalTime : result.rows.item(i).totalTime,
                      touch_n_gos : result.rows.item(i).touch_n_gos,
                      waterLanding : result.rows.item(i).waterLanding,
                      waterTO : result.rows.item(i).waterTO,
                      x_country_day : result.rows.item(i).x_country_day,
                      x_country_night : result.rows.item(i).x_country_night,
                      x_country_day_leg : result.rows.item(i).x_country_day_leg,
                      x_country_night_leg : result.rows.item(i).x_country_night_leg,
                      sim_type : result.rows.item(i).sim_type,
                      sim_exercise : result.rows.item(i).sim_exercise, 
                      pf_time: result.rows.item(i).pf_time,
                      pm_time : result.rows.item(i).pm_time,
                      sfi_sfe : result.rows.item(i).sfi_sfe,
                      simLocation : result.rows.item(i).simLocation,
                      p1_ut_day: result.rows.item(i).p1_ut_day,
                      p1_ut_night : result.rows.item(i).p1_ut_night,
                      remark : result.rows.item(i).remark,
                      autolanding : result.rows.item(i).autolanding,
                     
                    });
                   //console.log('logbook data', temData);
                   setData(temData);
                   //dataDispatcher(LogListData({data: temData}))
              }
          });
      });
  };

  const openList = () => setOpen(true)
  const closeList = () => setOpen(false)
  const onUpdateValue = (index, value) => { data[index].selected = value; return setData([...data]);}
  const fn_uncheckBox = () => setSelected(false)
  const renderItem = ({ item, index }) => <ItemRenderer key={index} index={index} selected={item.selected} label={item.id} onUpdateValue={onUpdateValue} uncheckBox={fn_uncheckBox} />
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: '#FFF', padding: 16 }}>
        <TouchableOpacity onPress={openList}>
          <View style={{ padding: 16, borderWidth: 1, borderColor: '#000' }}>
            <Text>Select Items</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text>Selected Items</Text>
          {data.filter(item => item.selected).map(item => <Text key={item.id}>{item.id}</Text>)}
        </View>
      </View>
      <Modal animationType='slide' transparent={true} visible={open === true}>
        <TouchableOpacity activeOpacity={1} onPress={closeList} style={{ flex: 1 }}>
          <View style={{ flex: 1, marginTop: 250 }}>
            <View style={styles.listWrapper}>
              <View style={styles.listContainer}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.label}
                  //extraData = {selected}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const ItemRenderer = ({ index,selected, label, onUpdateValue, uncheckBox }) => {
    console.log('selectedd==', selected);
    return(
<View style={styles.item}>
  <Text style={styles.title}>{label}</Text>
  <Checkbox
    color = '#256173'
    status={selected ? 'checked' : 'unchecked'}
    onPress={(value) => {onUpdateValue(index, value)}}
    />
</View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listWrapper: {
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: .5,
    elevation: 10,
    shadowRadius: 5
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC55'
  },
  tabHeading: {
    padding: 20,
    flexDirection: 'row',
  },
  title: {
    textTransform: 'capitalize',
    color: '#000'
  }
});