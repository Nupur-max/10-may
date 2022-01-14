//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, Dimensions } from 'react-native';
import {Logbook,ModalView} from '../../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ParamsContext } from '../../params-context';
import Colors from '../../components/colors'
import { useSelector, useDispatch } from "react-redux";
import { ApproachData } from '../../store/actions/ApproachAction';

// create a component
const Approach = ({navigation}) => {
    const dataDispatcher = useDispatch();

    const [params] = React.useContext(ParamsContext);
    const [Destparams] = React.useContext(ParamsContext);
    const [, setParams ] = React.useContext(ParamsContext);

    const [apType, setAPType] = React.useState('');
    const [airport, setAirport] = React.useState('')
    //const [npType, setNpType] = React.useState('');
    const[approaches, setApproaches] = React.useState('1')
    const[runway, setRunway] = React.useState('')

    console.log('Destparams',Destparams.ApproachItemCode)
    const getReduxData = useSelector(state => state.cl.AircraftType);
    console.log ('hehhh11111', getReduxData.toICAO)

    React.useEffect(() => {
        if(params.childParam === 'value1'){
            console.log('app Type', params.PrecisionItemName);
             setAPType(params.PrecisionItemName)
        }
        else  {
            console.log('app Type', params.NonPrecisionItemName);
            setAPType(params.NonPrecisionItemName)
        }

    },[params]);

    React.useEffect(() => {
        if(Destparams.childParam2){
            console.log('Child param is', Destparams.childParam2);
            setAirport (Destparams.ApproachItemCode)
        }
       },[Destparams]);

    const mixture = approaches+';'+apType+';'+runway+';'+airport
    console.log('mixture ----->', mixture); 

    const selectParams = () =>{ 
        setParams(previousParams => ({
            ...(previousParams || {}),
            childParam: 'value1',
            ApproachMixture : mixture,
           
          }));
          navigation.goBack();
        
    }

    const conditionalApType = params.PrecisionItemName===undefined?'ILS':apType
    const conditionalAirport = Destparams.ApproachItemCode === undefined ? getReduxData.toICAO :airport
    
    const dataDispatched = () => {
    dataDispatcher(ApproachData({ApproachNo: approaches, ApproachType: conditionalApType, Runway: runway, Airport: conditionalAirport})) // to dispatch data to createlogbook
    }

    return (
        <View style={Logbook.container}>
            
            <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:20, paddingBottom: Platform.OS === 'ios' ? 10 : null}}}>
                {/* <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Flight</Text> */}
                <TextInput 
                    placeholder='Number of Approaches'
                    placeholderTextColor='#393F45'
                    value = {approaches}
                    onChangeText = {(approaches) => setApproaches(approaches)}
                    style={{marginTop: -5}} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={Logbook.fields}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Approach Type</Text>
                <View style={{justifyContent: 'flex-end',flexDirection:'row'}}>
                <Text style={{paddingTop:9, color:'#256173'}}>{conditionalApType}</Text>
                <TouchableOpacity onPress={()=> navigation.navigate('ApproachType',{fromPrecision:'precision', fromNonPrecision:'nonPrecision'})}>
                <MaterialCommunityIcons  
                name="chevron-right" color={'#256173'} size={25} style={{lineHeight:35}}/>
                </TouchableOpacity>
                </View>
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:Platform.OS === 'ios' ? 15 : null , paddingBottom: Platform.OS === 'ios' ? 10 : null}}}>
                {/* <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Flight</Text> */}
                <TextInput 
                    placeholder='Runway'
                    placeholderTextColor='#393F45'
                    value = {runway}
                    onChangeText = {(runway) => setRunway(runway)}
                    style={{marginTop: -5}} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={Logbook.fields}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Airport</Text>
                <View style={{justifyContent: 'flex-end',flexDirection:'row'}}>
                <Text style={{paddingTop:9, color:'#256173'}}>{conditionalAirport}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Destination', {from: 'Approaches'})}>
                <MaterialCommunityIcons  
                name="chevron-right" color={'#256173'} size={25} style={{lineHeight:35}}/>
                </TouchableOpacity>
                </View>
                </View>
                </View>

            <TouchableOpacity onPress={dataDispatched}>
                <View style= {{paddingHorizontal: '25%'}}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
                </View>
                </View>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
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
});

//make this component available to the app
export default Approach;
