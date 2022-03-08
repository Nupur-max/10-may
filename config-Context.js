import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseUrl} from './components/url.json';
import { DisplayContext } from './display-context';

const initialState = {
    //Flight1
    roleCheck : '',
    flightToggle: true,
    routeToggle: true,
    fun_Flighttoggle: () => {},
    fun_routeToggle: () => {},
    takeOffToggle1: true,
    landingToggle1: true,
    fun_takeOffToggle1: () => {},
    fun_landingToggle1: () => {},
    //Flight 2
    instructorToggle: false,
    Pic_toggle: true,
    rc1Toggle : false,
    rc2Toggle : false,
    rc3Toggle : false,
    rc4Toggle : false,
    sic_toggle: true,
    studentToggle: false,
    fun_intructorToggle: () => {},
    fun_PicToggle: () => {},
    fun_Rc1: () => {},
    fun_Rc2: () => {},
    fun_Rc3: () => {},
    fun_Rc4: () => {},
    fun_SicToggle: () => {},
    fun_studentToggle: () => {},
    //Time
    totalTimeToggle: true,
    dayToggle: true,
    nightToggle: true,
    AiToggle: true,
    dualDayToggle: true,
    dualNightToggle: true,
    instructionalToggle: false,
    ifr_vfrToggle: true,
    p1_us_dayToggle: true,
    p1_us_nightToggle: true,
    p1_ut_dayToggle: true,
    p1_ut_nightToggle: true,
    Pic_dayToggle: true,
    Pic_nightToggle: true,
    stlToggle: true,
    siToggle: true,
    sic_dayToggle: true,
    sic_nightToggle: true,
    xc_dayToggle: true,
    xc_nightToggle: true,
    fun_ttToggle: () => {},
    fun_dayToggle: () => {},
    fun_nightToggle: () => {},
    fun_AIToggle: () => {},
    fun_dualDayToggle: () => {},
    fun_dualNightToggle: () => {},
    fun_InstructionalToggle: () => {},
    fun_IVToggle: () => {},
    fun_p1_us_dayToggle: () => {},
    fun_p1_us_nightToggle: () => {},
    fun_p1_ut_dayToggle: () => {},
    fun_p1_ut_nightToggle: () => {},
    fun_pic_dayToggle: () => {},
    fun_pic_nightToggle: () => {},
    fun_stlToggle: () => {},
    fun_siToggle: () => {},
    fun_sicDayToggle: () => {},
    fun_sicNightToggle: () => {},
    fun_xcDayToggle: () => {},
    fun_xcNightToggle: () => {},
    //Landing
    autoLandingToggle: false,
    dayLandingToggle: true,
    day_toToggle: true,
    fullStopToggle: false,
    nightLandingToggle: true,
    night_toToggle: true,
    touchGoToggle: false,
    waterLandingToggle: false,
    water_toToggle: false,
    fun_autoLandingToggle: () => {},
    fun_DayLandingToggle: () => {},
    fun_Day_toToggle: () => {},
    fun_fullStopToggle: () => {},
    fun_nightLandingToggle: () => {},
    fun_Night_toToggle: () => {},
    fun_touchGoToggle: () => {},
    fun_waterLandingToggle: () => {},
    fun_Water_toToggle: () => {},
    //Approach
    Approach2Toggle: false,
    fun_Approach2Toggle: () => {},
    //simu
    STToggle: true,
    takeOffToggle : false,
    landingToggle : false,
    TO_totalTimeToggle : false,
    PFToggle : true,
    PMToggle : true,
    SFToggle : true,
    fun_ST: () => {},
    fun_TakeOff: () => {},
    fun_Landing: () => {},
    fun_ToTotalTime: () => {},
    fun_Pf: () => {},
    fun_Pm: () => {},
    fun_Sf: () => {},

}

const ConfigContext = createContext(initialState);

function ConfigProvider({ children}) {
    //flight 1
    const [flightToggle,setFlightToggle] = React.useState(false)
    const [routeToggle,setRouteToggle] = React.useState(false)
    const [takeOffToggle1,setTakeOffToggle1] = React.useState(false)
    const [landingToggle1,setLandingToggle1] = React.useState(false)

    //flight 2
    const [instructorToggle, setInstructorToggle] = React.useState(false)
    const [Pic_toggle, setPic_toggle] = React.useState(true)
    const [rc1Toggle, setRc1Toggle] = React.useState(false)
    const [rc2Toggle, setRc2Toggle] = React.useState(false)
    const [rc3Toggle, setRc3Toggle] = React.useState(false)
    const [rc4Toggle, setRc4Toggle] = React.useState(false)
    const [sic_toggle, setSic_toggle] = React.useState(true)
    const [studentToggle, setStudentToggle] = React.useState(false) 
    // Time
    const [totalTimeToggle, setTotalTimeToggle] = React.useState(true)
    const [dayToggle, setDayToggle] = React.useState(true)
    const [nightToggle, setNightToggle] = React.useState(true)
    const [AiToggle, setAiToggle] = React.useState(true)
    const [dualDayToggle, setDualDayToggle] = React.useState(true)
    const [dualNightToggle, setDualNightToggle] = React.useState(true)
    const [instructionalToggle, setInstructionalToggle] = React.useState(false)
    const [ifr_vfrToggle, setIfr_VfrToggle] = React.useState(true)
    const [p1_us_dayToggle, setP1_usDayToggle] = React.useState(true)
    const [p1_us_nightToggle, setP1_usNightToggle] = React.useState(true)
    const [p1_ut_dayToggle, setP1_utDayToggle] = React.useState(true)
    const [p1_ut_nightToggle, setP1_utNightToggle] = React.useState(true)
    const [Pic_dayToggle, setPic_dayToggle] = React.useState(true)
    const [Pic_nightToggle, setPic_nightToggle] = React.useState(true)
    const [stlToggle, setStlToggle] = React.useState(true)
    const [siToggle, setSiToggle] = React.useState(true)
    const [sic_dayToggle, setSic_dayToggle] = React.useState(true)
    const [sic_nightToggle, setSic_nightToggle] = React.useState(true)
    const [xc_dayToggle, setXc_dayToggle] = React.useState(true)
    const [xc_nightToggle, setXc_nightToggle] = React.useState(true)
    //Landing
    const [autoLandingToggle, setAutoLandingToggle] = React.useState(false)
    const [dayLandingToggle, setDayLandingToggle] = React.useState(true)
    const [day_toToggle, setDay_toToggle] = React.useState(true)  
    const [fullStopToggle, setFullStopToggle] = React.useState(false)
    const [nightLandingToggle, setNightLandingToggle] = React.useState(true)
    const [night_toToggle, setNight_toToggle] = React.useState(true)
    const [touchGoToggle, setTouchGoToggle] = React.useState(false)
    const [waterLandingToggle, setWaterLandingToggle] = React.useState(false)
    const [water_toToggle, setWater_toToggle] = React.useState(false)
    //Approach
    const [Approach2Toggle , setApproach2Toggle] = React.useState(false)
    //Simu
    const [STToggle, setSTToggle] = React.useState(true)
    const [takeOffToggle, setTakeOffToggle] = React.useState(false)
    const [landingToggle, setLandingToggle] = React.useState(false)
    const [TO_totalTimeToggle, setTO_TotalTimeToggle] = React.useState(false)
    const [PFToggle, setPfToggle] = React.useState(true)
    const [PMToggle, setPmToggle] = React.useState(true)
    const [SFToggle, setSfToggle] = React.useState(true)

    const { datee, Dateform, DateFormat, role, roleChecked } = React.useContext(DisplayContext);

    //const roleCheck = role === 'AirlineCaptain' ? !flightToggle : flightToggle
    //role wise
    // React.useEffect(() => {
    //     setRoleWise
    //     },[]);

    // const [roleWise, setRoleWise] = React.useState('')

    // React.useEffect(() => {getDisplayValues()}, [roleWise]);

    // const getDisplayValues = async() => {
    //     let user = await AsyncStorage.getItem('userdetails');
    //     user = JSON.parse(user);
      
    //     await fetch(BaseUrl+'get_settings',{
    //       method : 'POST',
    //       headers:{
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         "user_id": user.id,
    //         //"date_format": date,             
    //    })
    //   }).then(res => res.json())
    //   .then(resData => {
    //     //setBuildLogBook(resData.message);
    //     console.log('data---->', resData.data);
    //     for (var j = 0; j < resData.data.length; j++){
    //           console.log(resData.data[j].role);
    //           setRoleWise (resData.data[j].role)
    //          }
    //     //setData(resData.message);
    //     //console.log('data--------->', data);
    //   });
    // };

    //flight 1
    const fun_Flighttoggle = () => {
        setFlightToggle(!flightToggle)
    }
    const fun_routeToggle = () => {
        setRouteToggle(!routeToggle)
        console.log('toggled');
    }
    const fun_takeOffToggle1 = () => {
        setTakeOffToggle1(!takeOffToggle1)
    }
    const fun_landingToggle1 = () => {
        setLandingToggle1(!landingToggle1)
        //console.log('toggled');
    }
    //Flight 2
    const fun_intructorToggle = () => {
        setInstructorToggle(!instructorToggle)
        console.log('toggled');
    }
    const fun_PicToggle = () => {
        setPic_toggle(!Pic_toggle)
        console.log('toggled');
    }
    const fun_Rc1 = () => {
        setRc1Toggle(!rc1Toggle)
        console.log('toggled');
    }
    const fun_Rc2 = () => {
        setRc2Toggle(!rc2Toggle)
        console.log('toggled');
    }
    const fun_Rc3 = () => {
        setRc3Toggle(!rc3Toggle)
        console.log('toggled');
    }
    const fun_Rc4 = () => {
        setRc4Toggle(!rc4Toggle)
        console.log('toggled');
    }
    const fun_SicToggle = () => {
        setSic_toggle(!sic_toggle)
        console.log('toggled');
    }
    const fun_studentToggle = () => {
        setStudentToggle(!studentToggle)
        console.log('toggled');
    }

    //TIME  
    const fun_ttToggle = () => {
        setTotalTimeToggle(!totalTimeToggle)
        console.log('toggled');
    }
    const fun_dayToggle = () => {
        setDayToggle(!dayToggle)
        console.log('toggled');
    }
    const fun_nightToggle = () => {
        setNightToggle(!nightToggle)
        console.log('toggled');
    }
    const fun_AIToggle = () => {
        setAiToggle(!AiToggle)
        console.log('toggled');
    }
    const fun_dualDayToggle = () => {
        setDualDayToggle(!dualDayToggle)
        console.log('toggled');
    }
    const fun_dualNightToggle = () => {
        setDualNightToggle(!dualNightToggle)
        console.log('toggled');
    }
    const fun_InstructionalToggle = () => {
        setInstructionalToggle(!instructionalToggle)
        console.log('toggled');
    }
    const fun_IVToggle = () => {
        setIfr_VfrToggle(!ifr_vfrToggle)
        console.log('toggled');
    }
    const fun_p1_us_dayToggle = () => {
        setP1_usDayToggle(!p1_us_dayToggle)
        console.log('toggled');
    }
    const fun_p1_us_nightToggle = () => {
        setP1_usNightToggle(!p1_us_nightToggle)
        console.log('toggled');
    }
    const fun_p1_ut_dayToggle = () => {
        setP1_utDayToggle(!p1_ut_dayToggle)
        console.log('toggled');
    }
    const fun_p1_ut_nightToggle = () => {
        setP1_utNightToggle(!p1_ut_nightToggle)
        console.log('toggled');
    }
    const fun_pic_dayToggle = () => {
        setPic_dayToggle(!Pic_dayToggle)
        console.log('toggled');
    }
    const fun_pic_nightToggle = () => {
        setPic_nightToggle(!Pic_nightToggle)
        console.log('toggled');
    }
    const fun_stlToggle = () => {
        setStlToggle(!stlToggle)
        console.log('toggled');
    }
    const fun_siToggle = () => {
        setSiToggle(!siToggle)
        console.log('toggled');
    }
    const fun_sicDayToggle = () => {
        setSic_dayToggle(!sic_dayToggle)
        console.log('toggled');
    }
    const fun_sicNightToggle = () => {
        setSic_nightToggle(!sic_nightToggle)
        console.log('toggled');
    }
    const fun_xcDayToggle = () => {
        setXc_dayToggle(!xc_dayToggle)
        console.log('toggled');
    }
    const fun_xcNightToggle = () => {
        setXc_nightToggle(!xc_nightToggle)
        console.log('toggled');
    }

    //Landing
    const fun_autoLandingToggle = () => {
        setAutoLandingToggle(!autoLandingToggle)
        console.log('toggled');
    }
    const fun_DayLandingToggle = () => {
        setDayLandingToggle(!dayLandingToggle)
        console.log('toggled');
    }
    const fun_Day_toToggle = () => {
        setDay_toToggle(!day_toToggle)
        console.log('toggled');
    }
    const fun_fullStopToggle = () => {
        setFullStopToggle(!fullStopToggle)
        console.log('toggled');
    }
    const fun_nightLandingToggle = () => {
        setNightLandingToggle(!nightLandingToggle)
        console.log('toggled');
    }
    const fun_Night_toToggle = () => {
        setNight_toToggle(!night_toToggle)
        console.log('toggled');
    }
    const fun_touchGoToggle = () => {
        setTouchGoToggle(!touchGoToggle)
        console.log('toggled');
    }
    const fun_waterLandingToggle = () => {
        setWaterLandingToggle(!waterLandingToggle)
        console.log('toggled');
    }
    const fun_Water_toToggle = () => {
        setWater_toToggle(!water_toToggle)
        console.log('toggled');
    }
     
    //Approach
    const fun_Approach2Toggle = () => {
        setApproach2Toggle(!Approach2Toggle)
        console.log('toggled');
    }
    
    //Simu
    const fun_ST = () => {
        setSTToggle(!STToggle)
    }
    const fun_TakeOff = () => {
        setTakeOffToggle(!takeOffToggle)
    }
    const fun_Landing = () => {
        setLandingToggle(!landingToggle)
    }
    const fun_ToTotalTime = () => {
        setTO_TotalTimeToggle(!TO_totalTimeToggle)
    }
    const fun_Pf = () => {
        setPfToggle(!PFToggle)
    }
    const fun_Pm = () => {
        setPmToggle(!PMToggle)
    }
    const fun_Sf = () => {
        setSfToggle(!SFToggle)
    }

    return (
        <ConfigContext.Provider value={{
        // flight 1
        flightToggle,
        fun_Flighttoggle,
        routeToggle,
        fun_routeToggle,
        takeOffToggle1,
        fun_takeOffToggle1,
        landingToggle1,
        fun_landingToggle1,
        //flight 2
        instructorToggle,
        Pic_toggle,
        rc1Toggle,
        rc2Toggle,
        rc3Toggle,
        rc4Toggle,
        sic_toggle,
        studentToggle,
        fun_intructorToggle,
        fun_PicToggle,
        fun_Rc1,
        fun_Rc2,
        fun_Rc3,
        fun_Rc4,
        fun_SicToggle,
        fun_studentToggle,

        //Time
        totalTimeToggle,
        dayToggle,
        nightToggle,
        AiToggle,
        dualDayToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' || role === 'Cfi' ? !dualDayToggle  : dualDayToggle, 
        dualNightToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' || role === 'Cfi' ? !dualNightToggle : dualNightToggle,
        instructionalToggle : role === 'AirlineInstructor' ? !instructionalToggle : instructionalToggle,
        ifr_vfrToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' ? !ifr_vfrToggle : ifr_vfrToggle, 
        p1_us_dayToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'Cfi' ? !p1_us_dayToggle : p1_us_dayToggle,
        p1_us_nightToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'Cfi' ? !p1_us_nightToggle : p1_us_nightToggle,
        p1_ut_dayToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' || role === 'Cfi' ?  !p1_ut_dayToggle : p1_ut_dayToggle,
        p1_ut_nightToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' || role === 'Cfi' ? !p1_ut_nightToggle : p1_ut_nightToggle,
        Pic_dayToggle: role === 'AirlineFirstOfficer' ? !Pic_dayToggle : Pic_dayToggle  ,
        Pic_nightToggle: role === 'AirlineFirstOfficer' ? !Pic_nightToggle : Pic_nightToggle, 
        stlToggle: role === 'AirlineInstructor' || role === 'Cfi' || role === 'FlightCadet' || role === 'AirlineCaptain' ? !stlToggle : stlToggle , 
        siToggle : role === 'AirlineCaptain' || role === 'AirlineInstructor' || role === 'AirlineFirstOfficer' ? !siToggle : siToggle,
        sic_dayToggle : role === 'Cfi' ? !sic_dayToggle : sic_dayToggle ,
        sic_nightToggle : role === 'Cfi' ? !sic_nightToggle : sic_nightToggle ,
        xc_dayToggle : role === 'AirlineCaptain' || role === 'AirlineFirstOfficer' || role === 'AirlineInstructor' ? !xc_dayToggle : xc_dayToggle,
        xc_nightToggle : role === 'AirlineCaptain' || role === 'AirlineFirstOfficer'|| role === 'AirlineInstructor' ? !xc_nightToggle : xc_nightToggle,
        fun_ttToggle,
        fun_dayToggle,
        fun_nightToggle,
        fun_AIToggle,
        fun_dualDayToggle,
        fun_dualNightToggle,
        fun_InstructionalToggle,
        fun_IVToggle,
        fun_p1_us_dayToggle,
        fun_p1_us_nightToggle,
        fun_p1_ut_dayToggle,
        fun_p1_ut_nightToggle,
        fun_pic_dayToggle,
        fun_pic_nightToggle,
        fun_stlToggle,
        fun_siToggle,
        fun_sicDayToggle,
        fun_sicNightToggle,
        fun_xcDayToggle,
        fun_xcNightToggle,

        //Landing
        autoLandingToggle,
        dayLandingToggle,
        day_toToggle,
        fullStopToggle,
        nightLandingToggle,
        night_toToggle,
        touchGoToggle,
        waterLandingToggle,
        water_toToggle,
        fun_autoLandingToggle,
        fun_DayLandingToggle,
        fun_Day_toToggle,
        fun_fullStopToggle,
        fun_nightLandingToggle,
        fun_Night_toToggle,
        fun_touchGoToggle,
        fun_waterLandingToggle,
        fun_Water_toToggle,

        //Approach
        Approach2Toggle,
        fun_Approach2Toggle,

        //Simu
        STToggle,
        takeOffToggle,
        landingToggle,
        TO_totalTimeToggle,
        PFToggle,
        PMToggle,
        SFToggle,
        fun_ST,
        fun_TakeOff,
        fun_Landing,
        fun_ToTotalTime,
        fun_Pf,
        fun_Pm,
        fun_Sf,

        }}>
            {children}
        </ConfigContext.Provider>
    )

}

export { ConfigProvider, ConfigContext }