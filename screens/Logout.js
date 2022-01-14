import AsyncStorage from '@react-native-community/async-storage';

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// create a component
const Logout = ({navigation}) => {
    return (
        <View style={styles.container}>
        <TouchableOpacity onPress={()=>{ AsyncStorage.clear();
            navigation.replace('Auth');}}> 
            <Text>Logout</Text>
        </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

//make this component available to the app
export default Logout;
