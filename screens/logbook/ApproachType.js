//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {Approach,Logbook} from '../../styles/styles';
import {Precision,NonPrecision} from '../../components/dummyLogBookListing';
import { ParamsContext } from '../../params-context';

// create a component
const ApproachType = ({navigation,route}) => {

    const [, setParamsPrecision ] = React.useContext(ParamsContext); 
    const [, setParamsNonPrecision ] = React.useContext(ParamsContext);

    const[pselectedId, psetSelectedId] = React.useState('')
    const[npselectedId, npsetSelectedId] = React.useState('')

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}> {item.PrecisionItem}</Text>
        </TouchableOpacity>
      );
    
      const renderItem = ({item}) => {
        //console.log('typeeeee---->',item.Airline_code);
        const backgroundColor = item.id === pselectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === pselectedId ? 'white' : 'black';
        // const fetchToBuildLogBook = item.id === selectedId ? navigation.navigate('BuildLogbook',{
        //   itemId: item.id,
        //   itemName: item.aircraft_name,
        // }) : '';
    
        const selectParams = () =>{ 
        if(item.id === pselectedId && route.params.fromPrecision)
        {
            setParamsPrecision(previousParams => ({
            ...(previousParams || {}),
            childParam: 'value1',
            PrecisionItemName : item.PrecisionItem,
           
          }));
          navigation.goBack();
        }
    }
    return (
          <Item
            item={item}
            onPress={() => {psetSelectedId(item.id); selectParams()}}
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
          />
        );
    }


    const NonPrecisionItem = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}> {item.nonPrecisionItem}</Text>
        </TouchableOpacity>
      );
    
      const nonPrecisionRenderItem = ({item}) => {
        //console.log('typeeeee---->',item.Airline_code);
        const backgroundColor = item.id === npselectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === npselectedId ? 'white' : 'black';
        // const fetchToBuildLogBook = item.id === selectedId ? navigation.navigate('BuildLogbook',{
        //   itemId: item.id,
        //   itemName: item.aircraft_name,
        // }) : '';
    
        const npselectParams = () =>{ 
        if(item.id === npselectedId && route.params.fromNonPrecision)
        {
          setParamsNonPrecision(previousParams => ({
            ...(previousParams || {}),
            childParam: 'value2',
            NonPrecisionItemName : item.nonPrecisionItem,
           
          }));
          navigation.goBack();
        }
        
      }
    
      return (
          <NonPrecisionItem
            item={item}
            onPress={() => {npsetSelectedId(item.id); npselectParams()}}
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
          />
        );
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            <Text style={Approach.header} onPress={()=>navigation.goBack()}>Back</Text>

            <View style={Logbook.headline}>
                    <Text style={Logbook.HeadlineText}>Precision</Text>
            </View>
            <FlatList
            style={{width:'100%'}}
            data = {Precision}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            numColumns={1}
            extraData={pselectedId}
            />

            <View style={Logbook.headline}>
                    <Text style={Logbook.HeadlineText}>Non-Precision</Text>
            </View>
            <FlatList
            style={{width:'100%'}}
            data = {NonPrecision}
            renderItem={nonPrecisionRenderItem}
            keyExtractor={(item) => item.key}
            numColumns={1}
            extraData={npselectedId}
            />
        </View>
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    item: {
        padding: 10,
        borderBottomWidth: 0.5,
       },
});

//make this component available to the app
export default ApproachType;
