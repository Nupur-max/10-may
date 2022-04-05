import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/colors';
import { ThemeContext } from '../theme-context';

// create a component
const Support = ({navigation}) => {

    const { dark, theme, toggle } = React.useContext(ThemeContext);

    return (
        <ScrollView style={{backgroundColor:dark?'#000':'#fff'}}>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>

        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <MaterialCommunityIcons  
            name="arrow-left" color={dark ? theme.icon : '#000'} size={30} style={Platform.OS === 'android' ? {padding: 0,}: 
            {padding: 15, paddingTop: 40}}/>
            </TouchableOpacity>
            <Text style={Platform.OS === 'android' ? styles.header: styles.headerIos}>Support</Text>
        </View>
            <Text style={styles.Email}>Email Us</Text>
            
            <Text style={styles.mainLine}>Version 3.6.1 Build 1.2</Text>

            <Text style={styles.mainText}>Thank You for Downloading the Autoflight App. We Look forward to hearing from you . We will reply to your queries within 48 hours . Kindly choose the most pertinent email for speedy support.  
            </Text>
            
            {/* supports */}
            <View style={{flexDirection: 'row', marginTop:30,justifyContent:'space-between'}}>
                <Text style={styles.supportText}>Techsupport:</Text>
                <Text style={{color: 'blue',}}
                      onPress={() => Linking.openURL('mailto:techsupport@autoflightlog.com')}>techsupport@autoflightlog.com
                </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop:30,}}>
                <Text style={styles.supportText}>Subscriptions:</Text>
                <Text style={{color: 'blue',}}
                      onPress={() => Linking.openURL('mailto:subscriptions@autoflightlog.com')}>subscriptions@autoflightlog.com
                </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop:30, }}>
                <Text style={styles.supportText }>Youtube Tutorials:</Text>
                <Text style={{color: 'blue',}}
                      onPress={() => Linking.openURL('https://m.youtube.com/channel/UCEC6vnb1_C1Dyw7ncqpQRCQ')}>https://m.youtube.com/channel/{
                        '\n'}UCEC6vnb1_C1Dyw7ncqpQRCQ
                </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop:30,}}>
                <Text style={styles.supportText}>Whatsapp Tech Support:</Text>
                <Text style={{color: 'blue',}}
                      onPress={() => Linking.openURL('tel:+91-6366403020')}>+91-6366403020
                </Text>
            </View>

            <Text style={{...styles.supportText , ...{marginTop:50}}}>
            Please Help us improve the app with your valuable Feedback
            </Text>
            <View style={{flexDirection: 'row', marginTop:20,}}>
                <Text style={styles.supportText}>Feedback:</Text>
                <Text style={{color: 'blue',}}
                      onPress={() => Linking.openURL('mailto:feedback@autoflightlog.com')}>feedback@autoflightlog.com
                </Text>
            </View>

            <TouchableOpacity>
                <View style={{padding:10,}}>
                <View style={styles.button}>
                <Text style={styles.buttonText}>Annual Subscription</Text>
                </View>
                </View>
            </TouchableOpacity>
        
        </View>
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap:'wrap',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 15,
        width:'100%'
    },
    Email:{
        fontSize: 28,
        marginTop:10,
        marginHorizontal:15,
        color: Colors.primary,
        fontFamily: 'WorkSans-ExtraBold',
    },
    mainLine:{
        color: '#c0c0c0',
        marginHorizontal:15,
        marginTop:5,
        fontSize: 15,
        fontFamily: 'WorkSans-Regular',
    },
    mainText: {
        color: Colors.primary,
        paddingHorizontal:5,
        marginTop:30,
        fontSize: 15,
        fontFamily: 'WorkSans-Regular', 
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        marginTop: 20,
        width: Dimensions.get('window').width* 0.9,
        borderRadius:10,
        alignItems:'center'
    },
    buttonText:{
      fontWeight: 'bold',
      color: '#fff',
    },
    supportText:{
        fontWeight: Platform.OS == 'android' ? '700' : '600',
        fontFamily: 'WorkSans-Regular',
        color: Colors.primary,
    },
    header:{
        paddingHorizontal:15, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary,
    },
    headerIos: {
        padding:5, 
        fontFamily:'WorkSans-Regular', 
        fontSize: 20, 
        color: Colors.primary, 
        paddingTop: 42,
    },
});

//make this component available to the app
export default Support;
