//import liraries
import React, { useState } from 'react';
import { View, Text, Dimensions, Modal, Image, TouchableOpacity, Platform, Linking, TextInput, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../components/colors';
import { ThemeContext } from '../theme-context';
import SsStyle from '../styles/settingScreenStyle';
// create a component
const SettingScreen = ({navigation}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [BuildmodalVisible, setBuildModalVisible] = useState(false);
    const [DisplaymodalVisible, setDisplayModalVisible] = useState(false);
    const [BackupmodalVisible, setBackupModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false)

    const { dark, theme, toggle } = React.useContext(ThemeContext);

    return (
        <ScrollView style={{backgroundColor:dark?'#000':'#fff'}}>
        <View style={modalVisible || inviteModalVisible || BuildmodalVisible || DisplaymodalVisible || BackupmodalVisible? [SsStyle.container , {backgroundColor: 'rgba(0,0,0,0.5)'}] : [SsStyle.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons  
            name="cog-outline" color='#256173' size={50} style={Platform.OS === 'ios' ? {lineHeight:80,}: {lineHeight:57,} } />
            <Text style={Platform.OS === 'android' ? SsStyle.settings : SsStyle.settingsIos}>Settings</Text>
            </View>
            {/* <Text style={SsStyle.mainLine}>Lorem Ipsum</Text> */}

            {/* modal for Pilot details */}
            <View style={SsStyle.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={SsStyle.centeredView}>
                <View style={SsStyle.modalView1}>
                    <View style={{width:'100%', backgroundColor:'#EFEFEF', padding:5, flexDirection:'row', justifyContent:'space-between',borderRadius:10}}>
                    <Text style={SsStyle.modalText}>Pilot Details</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#256173' size={25} style={{padding: 5,}} onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                    <View>
                        <Text style={SsStyle.mainText}>
                        Enter Your User Id and Password to import 
                        your logbook / roster. AIMS users can view
                        the video at <Text style={{color: '#256173'}}
                        onPress={() => Linking.openURL('https://www.youtube.com/watch?v=RrJ33MT1Q21')}>https://www.youtube.com/watch?v=RrJ33MT1Q21
                        </Text>.ARMS users at {"\n"}
                        <Text style={{color: '#256173'}}
                        onPress={() => Linking.openURL('https://www.youtube.com/watch?v=uhnRoBNJB64')}>https://www.youtube.com/watch?v=uhnRoBNJB64
                        </Text>
                        </Text>
                    </View>
                </View>
                </View>
            </Modal>
            </View>

            {/* modal for build logbook */}

            <View style={SsStyle.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={BuildmodalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setBuildModalVisible(!BuildmodalVisible);
                }}
            >
                <View style={SsStyle.centeredView}>
                <View style={SsStyle.modalView}>
                    <View style={{width:'100%', backgroundColor:'#EFEFEF', padding:5, flexDirection:'row', justifyContent:'space-between',borderRadius:10}}>
                    <Text style={SsStyle.modalText}>Build Logbook</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#256173' size={25} style={{padding: 5,}} onPress={() => setBuildModalVisible(!BuildmodalVisible)} />
                    </View>
                    <View>
                        <Text style={SsStyle.mainText}>
                        Enter aircraft wise flight Data of your 
                        previous flying in the designated fields.
                        This will bring your logbook upto date like
                        you do when you open a new logbook. You 
                        can edit the data, if required. we will import your data from excel sheet 
                        or other logbook apps too. we also digitize your logbooks for a small fee. contact {'\n'} 
                        <Text style={{color: '#256173'}}
                        onPress={() => Linking.openURL('mailto:techsupport@autoflightlog.com')}>techsupport@autoflightlog.com
                        </Text>.You can Edit{"\n"}
                        OR delete the data by selecting an
                        aircraft type by pressing Edit {'\n'}<Text style={{color: '#256173'}}
                        onPress={() => Linking.openURL('https://youtu.be/vbPBBWI7Yx0')}>https://youtu.be/vbPBBWI7Yx0
                        </Text>
                        </Text>
                    </View>
                </View>
                </View>
            </Modal>
            </View>

            {/* Modal for Display */}
            <View style={SsStyle.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={DisplaymodalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setDisplayModalVisible(!DisplaymodalVisible);
                }}
            >
                <View style={SsStyle.centeredView}>
                <View style={SsStyle.modalView1}>
                    <View style={{width:'100%', backgroundColor:'#EFEFEF', padding:5, flexDirection:'row', justifyContent:'space-between',borderRadius:10}}>
                    <Text style={SsStyle.modalText}>Display</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#256173' size={25} style={{padding: 5,}} onPress={() => setDisplayModalVisible(!DisplaymodalVisible)} />
                    </View>
                    <View>
                        <Text style={SsStyle.mainText}>
                        Choose your Default role. The selection
                        of Default settings for instructor. Cross Country and Actual Instrument will
                        automatically add the block time in relevant logbook fields. Approach 1 
                        Default settings selection will fill ILS approah at Destination.
                        </Text>
                    </View>
                </View>
                </View>
            </Modal>
            </View>

            {/* Modal for backup */}

            <View style={SsStyle.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={BackupmodalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setBackupModalVisible(!BackupmodalVisible);
                }}
            >
                <View style={SsStyle.centeredView}>
                <View style={SsStyle.modalView1}>
                    <View style={{width:'100%', backgroundColor:'#EFEFEF', padding:5, flexDirection:'row', justifyContent:'space-between',borderRadius:10}}>
                    <Text style={SsStyle.modalText}>Backup</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#256173' size={25} style={{padding: 5,}} onPress={() => setBackupModalVisible(!BackupmodalVisible)} />
                    </View>
                    <View>
                        <Text style={SsStyle.mainText}>
                        Backup your data on company server with 
                        a good wifi connection
                        </Text>
                    </View>
                </View>
                </View>
            </Modal>
            </View>

            
            <View style={SsStyle.fields} >
                <MaterialCommunityIcons  
                name="shield-star" color='#256173' size={20} style={{lineHeight:23}} />
                <Text style={SsStyle.text} onPress={()=> navigation.navigate('Profile')}> Pilot Details</Text>
                
                <MaterialCommunityIcons  
                name="help-circle-outline" color='#256173' size={25} onPress={() => setModalVisible(true)} style={{lineHeight:23, position:'absolute', left: 310 }} />
            </View>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('EGCAUpload')}>
                <MaterialCommunityIcons  
                name="upload-outline" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}>EGCA upload</Text>
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('BuildLogbook')}>
                <MaterialCommunityIcons  
                name="book-open-page-variant" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Build log Book</Text>
                <MaterialCommunityIcons  
                name="help-circle-outline" color='#256173' size={25} onPress={() => setBuildModalVisible(true)} style={{lineHeight:23, position:'absolute', left: 310 }} />
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('Display')}>
                <MaterialCommunityIcons  
                name="border-style" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Display</Text>
                <MaterialCommunityIcons  
                name="help-circle-outline" color='#256173' size={25} onPress={() =>  setDisplayModalVisible(true)} style={{lineHeight:23, position:'absolute', left: 310 }} />
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('Gallery')}>
                <MaterialCommunityIcons  
                name="image-multiple" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('Support')}>
                <MaterialCommunityIcons  
                name="headset" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> navigation.navigate('Backup')}>
                <MaterialCommunityIcons  
                name="cloud-sync" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Backup</Text>
                <MaterialCommunityIcons  
                name="help-circle-outline" color='#256173' size={25} onPress={() => setBackupModalVisible(true)} style={{lineHeight:23, position:'absolute', left: 310 }} />
            </TouchableOpacity>

            <TouchableOpacity style={SsStyle.fields} onPress={() => {
                     Linking.openURL( 'https://www.youtube.com/results?search_query=narain+aviation' );
                    }}>
                <MaterialCommunityIcons  
                name="video-plus" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Help Videos</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={inviteModalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setInviteModalVisible(!inviteModalVisible);
                }}
            >
                <View style={SsStyle.centeredView1}>
                <View style={SsStyle.modalView1}>
                    <View style={{width:'100%', backgroundColor:'#256173', padding:5, flexDirection:'row', justifyContent:'space-between', borderTopLeftRadius: 10,borderTopRightRadius:10}}>
                    <Text style={SsStyle.modalText1}>Refer & Earn</Text>
                    <MaterialCommunityIcons  
                    name="close" color='#fff' size={25} style={{padding: 5,}} onPress={() => setInviteModalVisible(!inviteModalVisible)} />
                    </View>
                    <View style={SsStyle.imageView}>
                    <Image style={SsStyle.NetworkImage}
                        source={require('../images/network.png')}/>
                    </View>
                    <View style={SsStyle.bottomView}>
                    <Text style={SsStyle.BottomText}>Invite your friends and {'\n'} get rewarded</Text>
                    </View>
                    <View style = {SsStyle.buttonView}>
                    <TouchableOpacity onPress={()=>{}}>
                        <View style= {{alignItems:'center'}}>
                        <View style={SsStyle.button}>
                        <View style={{flexDirection:'row'}}>
                        <MaterialCommunityIcons  
                        name="whatsapp" color='#fff' size={20} style={{lineHeight:23,paddingRight:5,}} />
                        <Text style={SsStyle.buttonText}>Invite via WhatsApp</Text>
                        </View>
                        </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{}}>
                        <View style= {{alignItems:'center', paddingTop:10,}}>
                        <View style={SsStyle.button}>
                        <Text style={SsStyle.buttonText}>More invite option</Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>

            <TouchableOpacity style={SsStyle.fields} onPress={()=> setInviteModalVisible(true)}>
                <MaterialCommunityIcons  
                name="currency-usd" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Invite & Earn</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={SsStyle.fields} onPress={()=>{ AsyncStorage.clear();
                navigation.replace('Auth');}}>
                <MaterialCommunityIcons  
                name="logout" color='#256173' size={20} style={{lineHeight:23,}} />
                <Text style={SsStyle.text}> Logout</Text>
            </TouchableOpacity> */}

            <View>
            </View>
        </View>
        </ScrollView>
    );
};

// define your SsStyle

//make this component available to the app
export default SettingScreen 
