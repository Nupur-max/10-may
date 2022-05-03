import React, { createContext, useState } from 'react';
import { ConfigContext } from './config-Context';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseUrl} from './components/url.json';
import {BaseUrlAndroid} from './components/urlAndroid.json';

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

const Dateforms = {
    ddmm: {
        ddmm : 'DDMM'
    },
    mmdd: {
        mmdd : 'MMDD'
    }
}

const initialState = {
    datee: 'DDMM',
    Dateform: Dateforms.ddmm,
    DateFormat: () => {},
    role: '',
    roleChecked : () => {},
    config: false,
    configCheck : () => {},
    egcaModalOpen : false,
}
const DisplayContext = createContext(initialState);

function DisplayProvider({ children }) {

    const [datee, setDatee] = useState('DDMM') 
    const [role, setRole] = useState('')
    const [roleavail, setRoleAvail] = useState('') 
    const [dataLength, setDataLength] = useState('')
    const [config, setConfig] = useState(false)
    const [egcaModalOpen,setEgcaModalOpen] = useState(false)

    React.useEffect(() => {
        //if(isFocused){
        SelectQuery()
        //}
      },[]);

    const SelectQuery = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let selectedData = []; 
        prePopulateddb.transaction(tx => {
            tx.executeSql(
                'SELECT * from displayDetails WHERE user_id = "'+user.id+'"', [], (tx, result) => {
                    for (let i = 0; i <= result.rows.length; i++) {
                    selectedData.push({
                      role :  result.rows.item(i).role,
                    });
                     console.log('selected Data', selectedData)
                     setRoleAvail(result.rows.item(i).role)
                     setDataLength(result.rows.length)
                    }
                }
            );
        });
    }

    const GetDisplayDetails = async() => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
  
        await fetch(Platform.OS==='ios'?BaseUrl + 'get_display_details':BaseUrlAndroid + 'get_display_details', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user.id,
              })
        }).then(res => res.json())
            .then(resData => {
              for (let i = 0; i < resData.data.length; i++) {
                setRole(resData.data[i].role)
              }
            });
      }
  
     React. useEffect(()=>{
      GetDisplayDetails()
     },[])

    
    const { 
        // flight 1
        flightToggle,
    } = React.useContext(ConfigContext);
    
    const DateFormat = (newValue) => {
        setDatee(newValue)
        
    }
    const roleChecked = (newValue) => {
        setRole(newValue)
    }
    const configCheck = () => {
        setConfig(!config)
    }

    // Filter the styles based on the theme selected
    const Dateform = datee ? Dateforms.ddmm : Dateforms.mmdd

    return (
        <DisplayContext.Provider value={{ datee, Dateform, DateFormat, role, roleChecked, config, configCheck,egcaModalOpen,setEgcaModalOpen }}>
            {children}
        </DisplayContext.Provider>
    )
}

export { DisplayProvider, DisplayContext }