import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider} from './theme-context';
import { ParamsProvider} from './params-context';
import { ConfigProvider } from './config-Context';
import {DisplayProvider} from './display-context';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import { rosterImportReducer } from './store/reducers/rosterImportReducer';
import { LogListReducer } from './store/reducers/loglistReducer';
import { EGCADetailsReducer } from './store/reducers/egcaDetailsReducer';
import {Provider, useSelector} from 'react-redux';
import thunk from "redux-thunk";
import reducerBuildlogBook from './store/reducers/ReducerBuildLogbook';
import {AircraftReducer} from './store/reducers/aircraftReducer';
import {CreateLogbookReducer} from './store/reducers/CLReducer';
import { DocListReducer } from './store/reducers/DocListReducer';
import { DisplayReducer } from './store/reducers/displayReducer';
import { PilotsReducer } from './store/reducers/pilotsReducer';
import {ApproachReducer} from './store/reducers/ApproachReducer';
import {ProgressReducer} from './store/reducers/progressReducer';
import { LoginReducer } from './store/reducers/loginReducer';
import { docReducer } from './store/reducers/docReducer';
import {FlyingReducer} from './store/reducers/FlyingReducer';
import {BackupReducer} from './store/reducers/backupReducer';
import {BuildLogbookReducer} from './store/reducers/BLReducer';
import {TotalTypeReducer} from './store/reducers/totalTypeReducer';
import SQLite from 'react-native-sqlite-storage';
import { ThemeContext } from './theme-context';


export const allreducers = combineReducers({
  buildLogBook: reducerBuildlogBook,
  aircrafts: AircraftReducer,
  rosterImport: rosterImportReducer,
  logList : LogListReducer,
  Egcadata : EGCADetailsReducer,
  cl : CreateLogbookReducer,
  docList : DocListReducer,
  display : DisplayReducer,
  pilotsList : PilotsReducer,
  approaches : ApproachReducer,
  progressBar : ProgressReducer,
  login: LoginReducer,
  docs: docReducer,
  FlyingTime: FlyingReducer,
  backup : BackupReducer,
  bl: BuildLogbookReducer,
  tt: TotalTypeReducer,
})
const store = createStore(
  allreducers, applyMiddleware(thunk)
  );


import Colors from './components/colors';

enableScreens(false);

import SplashScreen from './screens/splashScreen';
//Setting screens
import SettingScreen from './screens/SettingScreen';
import Register from './screens/Register';
import Login from './screens/login';
import Subscribe from './screens/subscribe';
import Display from './screens/display';
import Aircraft from './screens/Aircraft';
import SetAircraft from './screens/setAircraft';
import Profile from './screens/profile';
import EGCAUpload from './screens/egcaUpload';
import BuildLogbook from './screens/buildLogbook';
import Support from './screens/support';
import Gallery from './screens/gallery';
import Backup  from './screens/backup';
import BLAircraft from './screens/BLAircraft';

//logbookScreens
import CreateLogbook from './screens/logbook/createLogbook';
import Destination from './screens/logbook/destination';
import SetDestination from './screens/logbook/SetDestination';
import People from './screens/logbook/people';
import SetPeople from './screens/logbook/SetPeople';
import LogBookListing from './screens/logbook/logbookListing';
import Approach from './screens/logbook/Approach';
import Configuration from './screens/logbook/configuration';
import ApproachType from './screens/logbook/ApproachType';

//DocScreens
import Docs from './screens/docs/DocScreen';
import DgcaLogBook from './screens/docs/dgcaLogbook';
import PdfGenerator from './screens/docs/PdfGenerator';
import ShowPDF from './screens/docs/ShowPDF';
import webview from './screens/docs/webview';
import JUSA from './screens/docs/JUSA';
import JEU from './screens/docs/JEU';
import DGCA39 from './screens/docs/DGCA-39';
import LogSelection from './screens/docs/logSelection';

//export const ThemeContext = React.createContext();

import Logout from './screens/Logout';


const App1 = () =>  {
const Tab = createBottomTabNavigator();

const { dark, theme, toggle } = React.useContext(ThemeContext);
console.log('dark mode',toggle)

const HomeTabs = () => {
    return (
      <Tab.Navigator initialRouteName="LogBook"
      tabBarOptions={{
        activeTintColor: Colors.primary,
        //activeBackgroundColor: Colors.accent,
        style: {
          backgroundColor:'#000',//color you want to change
        }
      }}>
        <Tab.Screen name="SettingScreen" component={SettingStackScreen} 
        options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
            ),
          }} />
          <Tab.Screen name="LogBook" component={LogBookStackScreen} options={{
          tabBarLabel: 'LogBook',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="notebook-multiple" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Docs" component={DocStackScreen} options={{
          tabBarLabel: 'Docs',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-account-outline" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    );
  }

  const AuthStack = createStackNavigator();
    const AuthStackScreen = () => {
    return (
    <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <AuthStack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <AuthStack.Screen name="subscribe" component={Subscribe} options={{headerShown: false}} />
    </AuthStack.Navigator>
    );
    }

    const SettingStack = createStackNavigator();
    const SettingStackScreen =({navigation}) => {
    return (
    <SettingStack.Navigator initialRouteName='SettingScreen'
     navigationOptions ={{
        tintColor: '#e91e63',
    }}>
        <SettingStack.Screen name="SettingScreen" component={SettingScreen} options={{headerShown: false}} />
        <SettingStack.Screen name="Display" component={Display} options={{headerShown: false}} />
        <SettingStack.Screen name="Aircraft"
          component={Aircraft}
          options={{headerShown:false}} />
        <SettingStack.Screen name="SetAircraft"
        component={SetAircraft}
        options={{headerShown: false}} />
        <SettingStack.Screen name="BLAircraft"
          component={BLAircraft}
          options={{headerShown:false}} />
        <SettingStack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <SettingStack.Screen name="EGCAUpload" component={EGCAUpload} options={{headerShown:false}} />
        <SettingStack.Screen name="BuildLogbook" component={BuildLogbook} options={{headerShown:false}} />
        <SettingStack.Screen name="Gallery" component={Gallery} options={{headerShown:false}} />
        <SettingStack.Screen name="Support" component={Support} options={{headerShown:false}} />
        <SettingStack.Screen name="Backup" component={Backup} options={{headerShown:false}} />
        <SettingStack.Screen name="subscribe" component={Subscribe} options={{headerShown: false}} />
    
    </SettingStack.Navigator>
    );
    }

  const LogBookStack = createStackNavigator();
  function LogBookStackScreen({navigation}){
  return (
  <LogBookStack.Navigator initialRouteName='LogBookListing'
  navigationOptions ={{
    tintColor: '#e91e63',
  }}>
    <LogBookStack.Screen name="Aircraft"
        component={Aircraft}
        options={{headerShown:false}} />
        <LogBookStack.Screen name="SetAircraft"
        component={SetAircraft}
        options={{headerShown: false}} />
        <LogBookStack.Screen name="CreateLogbook" component={CreateLogbook} options={{headerShown:false}} />
        <LogBookStack.Screen name="CreateEgcaUpload" component={EGCAUpload} options={{headerShown:false}} />
        <LogBookStack.Screen name="Configuration" component={Configuration} options={{headerShown:false}} />
        <LogBookStack.Screen name="Destination"
        component={Destination}
        options={{headerShown: false}} />
        <LogBookStack.Screen name="SetDestination"
        component={SetDestination}
        options={{headerShown: false}} />
        <LogBookStack.Screen name="People"
        component={People}
        options={{headerShown: false}} />
        <LogBookStack.Screen name="SetPeople"
        component={SetPeople}
        options={{headerShown: false}} />
        <LogBookStack.Screen name="Approach"
        component={Approach}
        options={{
        title: 'Approach',
        headerTitleStyle: { alignSelf: 'center' },
        headerLeft: () => (
            <TouchableOpacity onPress={()=> {navigation.navigate('CreateLogbook')}}>
            <Text style={{color: 'blue', marginLeft: 10}}>Dismiss</Text>
            </TouchableOpacity>
        ),
        // headerRight: () => (
        //     <TouchableOpacity onPress={()=> navigation.navigate('CreateLogbook')}>
        //     <Text style={{color:'blue'}}>Save</Text>
        //     </TouchableOpacity>
        // ),
        }} />
        <LogBookStack.Screen name="LogBookListing" component={LogBookListing} options={{headerShown:false}} />
        <LogBookStack.Screen name="ApproachType" component={ApproachType} options={{headerShown:false}} />
  </LogBookStack.Navigator>
  );
  }

  const DocStack = createStackNavigator();
  function DocStackScreen({navigation}){
  return (
  <DocStack.Navigator initialRouteName='Docs'
    navigationOptions ={{
    tintColor: '#e91e63',
  }}>
  <DocStack.Screen name="Docs"
    component={Docs}
    options={{headerShown:false}} />
    <DocStack.Screen name="DgcaLogBook"
    component={DgcaLogBook}
    options={{headerShown:false}} />
    <DocStack.Screen name="PdfGenerator"
    component={PdfGenerator}
    options={{headerShown:false}} />
    <DocStack.Screen name="DocEgcaUpload"
    component={EGCAUpload}
    options={{headerShown:false}} />
    <DocStack.Screen name="ShowPDF"
    component={ShowPDF}
    options={{headerShown:false}} />
    <DocStack.Screen name="webview"
    component={webview}
    options={{headerShown:false}} />
    <DocStack.Screen name="JUSA"
    component={JUSA}
    options={{headerShown:false}} />
    <DocStack.Screen name="JEU"
    component={JEU}
    options={{headerShown:false}} />
    <DocStack.Screen name="DGCA39"
    component={DGCA39}
    options={{headerShown:false}} />
    <DocStack.Screen name="LogSelection"
    component={LogSelection}
    options={{headerShown:false}} />
  </DocStack.Navigator>
  );
  }
  
  const Stack = createStackNavigator(); 
  return (
    <Provider store={store} >
    <DisplayProvider>
    <ConfigProvider>
    <ParamsProvider>
    <ThemeProvider>
    <NavigationContainer>
      <StatusBar hidden/>
      <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        <Stack.Screen name="SettingScreen" component={HomeTabs} options={{headerShown:false}}/>
        <Stack.Screen name="Auth" component={AuthStackScreen} options={{headerShown:false}} />
        {/* <Stack.Screen name="CreateLogbook" component={HomeTabs} options={{headerShown:false}} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
    </ParamsProvider>
    </ConfigProvider>
    </DisplayProvider>
    </Provider>
  );
}

export default App1;