//import liraries
import React from 'react';
import { View, Text, Platform, Touchable, TouchableOpacity } from 'react-native';
import {Logbook,configuration} from '../../styles/styles';
import {  Switch } from 'react-native-paper';
import { ThemeContext } from '../../theme-context';
import { ParamsContext } from '../../params-context';
import { ConfigContext } from '../../config-Context';
import { ScrollView } from 'react-native-gesture-handler';
import { DisplayContext } from '../../display-context';

// create a component
const Configuration = ({navigation,route}) => {

    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const { datee, Dateform, DateFormat, role, roleChecked } = React.useContext(DisplayContext);
    const { 
            //flight 1
            flightToggle, 
            fun_Flighttoggle,
            routeToggle,
            fun_routeToggle,

            // flight2
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
            dualDayToggle,
            dualNightToggle,
            instructionalToggle,
            ifr_vfrToggle,
            p1_us_dayToggle,
            p1_us_nightToggle,
            p1_ut_dayToggle,
            p1_ut_nightToggle,
            Pic_dayToggle,
            Pic_nightToggle,
            stlToggle,
            siToggle,
            sic_dayToggle,
            sic_nightToggle,
            xc_dayToggle,
            xc_nightToggle,
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
            //simu
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
          } = React.useContext(ConfigContext);
    
          const [, setConfigParams] = React.useContext(ParamsContext);
    
   
const rolewise = role == 'AirlineCaptain' ? !flightToggle : flightToggle
    
    return (
        <ScrollView style={[Logbook.container, {backgroundColor: theme.backgroundColor}]}>
        <View >
            {/* <Text>{route.params.from}</Text> */}
            <View style={configuration.headerView}>
                <View style={configuration.saveTextView}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Text style={configuration.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {route.params.from === 'flight1' ?
            <View>
                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Flight</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Flighttoggle} 
                    value = {flightToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Route</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_routeToggle} value = {routeToggle} />
                </View>
                </View>
            </View> : null}

            {route.params.from === 'flight2' ?
            <View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Instructor</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_intructorToggle} value = {instructorToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>PIC/P1</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_PicToggle} value = {Pic_toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Relief Crew 1</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Rc1} value = {rc1Toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Relief Crew 2</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Rc2} value = {rc2Toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Relief Crew 3</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Rc3} value = {rc3Toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Relief Crew 4</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Rc4} value = {rc4Toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>SIC/P2</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_SicToggle} value = {sic_toggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Student</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_studentToggle} value = {studentToggle} />
                </View>
                </View>

            </View> : null}

            {route.params.from === 'simu' ? 
            <View>
                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Simulator Type</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_ST} 
                    value = {STToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>To</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_TakeOff} value = {takeOffToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>On</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Landing} value = {landingToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Total Time</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_ToTotalTime} value = {TO_totalTimeToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>PF Hours</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Pf} value = {PFToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>PM Hours</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Pm} value = {PMToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>SFI/SFE</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Sf} value = {SFToggle} />
                </View>
                </View>
            </View> : null}

            {route.params.from === 'Time'?
            <View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Total Time</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onValueChange={fun_ttToggle} value = {totalTimeToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Day</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_dayToggle} value = {dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Night</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_nightToggle} value = {nightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Actual Instrument</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_AIToggle} value = {AiToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Dual (Day)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_dualDayToggle} value = {dualDayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Dual (Night)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_dualNightToggle} value = {dualNightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Instructional</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_InstructionalToggle} value = {instructionalToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>IFR/VFR</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_IVToggle} value = {ifr_vfrToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>P1 U/S (Day)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_p1_us_dayToggle} value = {p1_us_dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>P1 U/S (Night)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_p1_us_nightToggle} value = {p1_us_nightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>P1 U/T (Day)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_p1_ut_dayToggle} value = {p1_ut_dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> P1 U/T (Night)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_p1_ut_nightToggle} value = {p1_ut_nightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> PIC (Day)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_pic_dayToggle} value = {Pic_dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> PIC (Night)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_pic_nightToggle} value = {Pic_nightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> STL</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_stlToggle} value = {stlToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> Simulated Instrument</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_siToggle} value = {siToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> SIC (Day)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_sicDayToggle} value = {sic_dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> SIC (Night)</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_sicNightToggle} value = {sic_nightToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}> XC (Day)/ Legs</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_xcDayToggle} value = {xc_dayToggle} />
            </View>
            </View>

            <View style={Logbook.fieldWithoutBottom}>
            <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
            <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>XC (Night)/ Legs</Text>
            <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                thumbColor={dark ? "#fff" : "#256173"}
                onChange={fun_xcNightToggle} value = {xc_nightToggle} />
            </View>
            </View>

            </View> :null}

            {route.params.from === 'landing'?
                <View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>AutoLanding</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_autoLandingToggle} value = {autoLandingToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Day Landing</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_DayLandingToggle} value = {dayLandingToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Day T/O</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Day_toToggle} value = {day_toToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Full Stop</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_fullStopToggle} value = {fullStopToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Night Landing</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_nightLandingToggle} value = {nightLandingToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Night T/O</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Night_toToggle} value = {night_toToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Touch & GO's</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_touchGoToggle} value = {touchGoToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Water Landing</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_waterLandingToggle} value = {waterLandingToggle} />
                </View>
                </View>

                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Water T/O</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onChange={fun_Water_toToggle} value = {water_toToggle} />
                </View>
                </View>

            </View>: null}

            {route.params.from === 'Approach' ? 
            <View>
                
                <View style={Logbook.fieldWithoutBottom}>
                <View style={{...Logbook.fields, ...{paddingTop:10, paddingBottom:5}}}>
                <Text style={{...Logbook.fieldText, ...{lineHeight:35,}}}>Approach 2</Text>
                <Switch trackColor={{ false: "#5f9ea0", true: Platform.OS === 'ios'? "#8fbc8f":"#ccc" }}
                    thumbColor={dark ? "#fff" : "#256173"}
                    onValueChange={fun_Approach2Toggle} value = {Approach2Toggle} />
                </View>
                </View>

            </View> : null}

        </View>  
        </ScrollView>
    );
};

// define your style

//make this component available to the app
export default Configuration;
