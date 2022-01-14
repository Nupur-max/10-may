import React, { createContext, useState } from 'react';
import { ConfigContext } from './config-Context';

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

}
const DisplayContext = createContext(initialState);

function DisplayProvider({ children }) {
    const [datee, setDatee] = useState('DDMM') 
    const [role, setRole] = useState('') 
    const { 
        // flight 1
        flightToggle,
    } = React.useContext(ConfigContext);
    
    const DateFormat = (newValue) => {
        setDatee(newValue)
        
    }
    const roleChecked = (newValue) => {
        setRole(newValue)
        // if(newValue === 'AirlineCaptain'){
        //     !flightToggle
        //     console.log ('check===>', !flightToggle)
        // }
    }

    // Filter the styles based on the theme selected
    const Dateform = datee ? Dateforms.ddmm : Dateforms.mmdd

    return (
        <DisplayContext.Provider value={{ datee, Dateform, DateFormat, role, roleChecked }}>
            {children}
        </DisplayContext.Provider>
    )
}

export { DisplayProvider, DisplayContext }