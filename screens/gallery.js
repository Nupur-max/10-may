//import liraries
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import { ThemeContext } from '../theme-context';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseUrl} from '../components/url.json';
import { ActivityIndicator } from 'react-native-paper';


// create a component
const Gallery = ({navigation}) => {
    const [modalVisible1 , setModalVisible1] = React.useState(true)
    const [modalVisible2 , setModalVisible2] = React.useState(true)
    const [modalVisible3 , setModalVisible3] = React.useState(true)
    const [modalVisible4 , setModalVisible4] = React.useState(true)
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const [profileImage, setProfileImage] = React.useState(null)
    const [data, setData] = React.useState([]);
    const [aircraftData, setAircraftData] = React.useState([]);
    const [airportData, setAirportData] = React.useState([]);
    const [nullImages, setNullImages] = React.useState('')
    const [Profilearrow, setProfileArrow] = React.useState(true)
    const [Peoplearrow, setPeopleArrow] = React.useState(false)
    const [Aircraftarrow, setAircraftArrow] = React.useState(false)
    const [Airportarrow, setAirportArrow] = React.useState(false)

    React.useEffect(() => {GetProfileImage();GetPeopleImage();GetAircraftImage();GetAirportImage();}, []);

    const GetProfileImage = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);

        await fetch(BaseUrl+'display_profile',{
         method : 'POST',
         headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user.id,
            })
        }).then(res => res.json())
        .then(resData => {
            //console.log(resData);
            console.log('profile_pic ---->', resData.message.profile_pic)
            setProfileImage(resData.message.profile_pic)
            setModalVisible1(false)
        })
    }

    const GetPeopleImage = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);

        await fetch(BaseUrl+'display_people',{
         method : 'POST',
         headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user.id,
            })
        }).then(res => res.json())
        .then(resData => {
            //console.log(resData);
            
            setData(resData.message)
            setModalVisible2(false)
            //console.log('People  ---->', data)
            let temp_img = [];
            for(let i=0; i<resData.message.length; i++) 
            {
                const images = resData.message[i].img
                //console.log('images---->', images)
                setNullImages(images)
                //setData(images)
                //images === "" ? null : images
                temp_img.push(images)
                //console.log('image array', temp_img)
                //setData(temp_img)
            }
            //temp_img.push(data)
           
        })
    }

    const GetAircraftImage = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);

        await fetch(BaseUrl+'display_aircraftImage',{
         method : 'POST',
         headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user.id,
            })
        }).then(res => res.json())
        .then(resData => {
            //console.log(resData);
            setAircraftData(resData.message)
            setModalVisible3(false)
        })
    }
   
    const GetAirportImage = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);

        await fetch(BaseUrl+'display_aircraftImage',{
         method : 'POST',
         headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user.id,
            })
        }).then(res => res.json())
        .then(resData => {
            //console.log(resData);
            setAirportData(resData.message)
            setModalVisible4(false)
        })
    }   
  

    return (
        <ScrollView style={{backgroundColor:dark?'#000':'#fff'}}>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons  
                name="arrow-left" color={dark ? theme.icon : '#000'} size={30} style={Platform.OS === 'android' ? {padding: 15,}: 
                {padding: 15, paddingTop: 40}}
                />
            </TouchableOpacity>
            <Text style={Platform.OS=== 'android' ? styles.header: styles.headerIos}>Gallery</Text>
            </View>
            <Text style={styles.photos}>Photos</Text>
        
        {/* Profile pictures */}
        <View style={dark?styles.Darkheadline:styles.headline}>
          {Profilearrow === true ? <MaterialCommunityIcons name="chevron-up" color={Colors.primary} size={20} style={{}} onPress={()=>setProfileArrow(!Profilearrow)} /> : <MaterialCommunityIcons name="chevron-down" color={Colors.primary} size={20} style={{}} onPress={()=>setProfileArrow(!Profilearrow)} /> }
          <Text style={styles.HeadlineText} >Profile</Text>
        </View>
        {Profilearrow === true ?
        <View>
            {modalVisible1 === true ? 
             <View style={{flex:1 , alignItems:"center" , justifyContent:"center"}}>
             <ActivityIndicator size="small" color={Colors.primary} /> 
             </View>
            :
                <Image
                    source={{ uri: profileImage }}
                    style={{ width: 60, height: 60, margin: 10 }}
                />
            }
        </View> : null
        }
        {/* People pictures */}
        <View style={dark?styles.Darkheadline:styles.headline}>
          {Peoplearrow === true ? <MaterialCommunityIcons name="chevron-up" color={Colors.primary} size={20} style={{}} onPress={()=>setPeopleArrow(!Peoplearrow)} /> : <MaterialCommunityIcons name="chevron-down" color={Colors.primary} size={20} style={{}} onPress={()=>setPeopleArrow(!Peoplearrow)} /> }
          <Text style={styles.HeadlineText} >People</Text>
        </View>
        {Peoplearrow === true ?
          modalVisible2 === true ? 
          <View style={{flex:1 , alignItems:"center" , justifyContent:"center"}}>
          <ActivityIndicator size="small" color={Colors.primary} /> 
          </View>
            : 
        <FlatList
        data = {data}
        numColumns={4}
        renderItem={(item) =>
        <View style={{flexDirection: 'row'}}>
            <Image
                   source={{ uri: item.item.img }}
                  style={{ width: 60, height: 60, margin: 10}}
           />
        </View>}
        />: <Text style={{marginTop:5}}></Text>}

        {/* Aircraft pictures */}
        <View style={dark?styles.Darkheadline:styles.headline}>
          {Aircraftarrow === true ? <MaterialCommunityIcons name="chevron-up" color={Colors.primary} size={20} style={{}} onPress={()=>setAircraftArrow(!Aircraftarrow)} /> : <MaterialCommunityIcons name="chevron-down" color={Colors.primary} size={20} style={{}} onPress={()=>setAircraftArrow(!Aircraftarrow)} /> }
            <Text style={styles.HeadlineText}>Aircraft</Text>
        </View>

        {Aircraftarrow === true ?
          modalVisible3 === true ? 
          <View style={{flex:1 , alignItems:"center" , justifyContent:"center"}}>
            <ActivityIndicator size="small" color={Colors.primary} /> 
            </View>
          : 
        <FlatList
        data = {aircraftData}
        numColumns={4}
        renderItem={(item) =>
        <View style={{flexDirection: 'row'}}>
                <Image
                source={{ uri: item.item.aircraftPhoto }}
                style={{ width: 60, height: 60, margin: 10}}
           />
        </View>}
        />:<Text style={{marginTop:5}}></Text>}

        {/* Airport pictures */}
        <View style={dark?styles.Darkheadline:styles.headline}>
          {Airportarrow === true ? <MaterialCommunityIcons name="chevron-up" color={Colors.primary} size={20} style={{}} onPress={()=>setAirportArrow(!Airportarrow)} /> : <MaterialCommunityIcons name="chevron-down" color={Colors.primary} size={20} style={{}} onPress={()=>setAirportArrow(!Airportarrow)} /> }
          <Text style={styles.HeadlineText}>Airport</Text>
        </View>

        {Airportarrow === true ?
         modalVisible4 === true ? 
         <View style={{flex:1 , alignItems:"center" , justifyContent:"center"}}>
            <ActivityIndicator size="small" color={Colors.primary} /> 
            </View>
            :
        <FlatList
        data = {airportData}
        numColumns={4}
        renderItem={(item) =>
        <View style={{flexDirection: 'row'}}>
            <Image
                source={{ uri: item.item.aircraftPhoto }}
                style={{ width: 60, height: 60, margin: 10}}
           />
        </View>}
        />:<Text style={{marginTop:5}}></Text>}
        </View>
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    photos:{
        fontSize: 28,
        //marginTop:10,
        //fontWeight: 'bold',
        marginHorizontal:15,
        color: Colors.primary,
        fontFamily: 'WorkSans-ExtraBold',
    },
    headline: {
        padding: 20,
        backgroundColor: '#F3F3F3',
        width: '100%',
        //justifyContent:'center',
        flexDirection: 'row',
    },
    Darkheadline: {
        padding: 20,
        backgroundColor: '#000',
        width: '100%',
        //justifyContent:'center',
        flexDirection: 'row',
    },
    HeadlineText:{
        color:Colors.primary,
        fontSize: 15,
        fontFamily: 'WorkSans-Bold',
    },
    photoSection:{
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    header:{
        padding:15, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary,
    },
    headerIos: {
        padding:15, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary, 
        paddingTop: 42,
    },
});

//make this component available to the app
export default Gallery;
