//import liraries
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, SafeAreaView, ScrollView } from 'react-native';
import DgcaLogbookStyles from '../../styles/dgcaLogbookStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import SQLite from 'react-native-sqlite-storage';
import { ThemeContext } from '../../theme-context';

import {
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfYear,
    endOfYear,
    addYears
} from 'date-fns';

const db = SQLite.openDatabase(
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
const defineds = {
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
    startOflast6Month: startOfMonth(addMonths(new Date(), -6)),
    endOflast6Month: endOfMonth(addMonths(new Date(), -1)),
    startOflast12Month: startOfMonth(addMonths(new Date(), -12)),
    endOflast12Month: endOfMonth(addMonths(new Date(), -1)),
    startOfYear: startOfYear(new Date()),
    endOfYear: endOfYear(new Date()),
    startOflastYear: startOfYear(addYears(new Date(), -1)),
    endOflastYear: endOfYear(addYears(new Date(), -1)),
    startOflast5Year: startOfYear(addYears(new Date(), -5)),
    endOflast5Year: endOfYear(addYears(new Date(), -1))
};

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


// create a component
const DGCA39 = ({ navigation }) => {

    const [logOption, setLogOption] = useState('Logbook');
    const [period, setPeriod] = useState('preDefined')
    const [fromPeriod, setfromPeriod] = useState('');
    const [toPeriod, settoPeriod] = useState('');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [orderStart, setOrderStart] = React.useState('')
    const [orderEnd, setOrderEnd] = React.useState('')
    const [data, setData] = React.useState(null)
    const [rows, setRows] = React.useState(12);
    const [monthWise, setMonthWise] = React.useState([]);
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const [licenseHolderName, setlicenseHolderName] = useState('');
    const [LicenceNumber, setLicenceNumber] = useState('');
    const [LicenceType, setLicenceType] = useState('');
    const [validity, setValidity] = useState('');

    const [items, setItems] = React.useState([
        {
            label: 'Last 6 Months',
            value: {
                startDate: defineds.startOflast6Month,
                endDate: defineds.endOflast6Month
            }
        },
        {
            label: 'Last 12 Months',
            value: {
                startDate: defineds.startOflast12Month,
                endDate: defineds.endOflast12Month
            }
        },
    ]);

    //--------- For PreDefined and calender date ---------//
    React.useEffect(() => {
        if (value !== null) {
            preDefinedDates();
        }
    }, [value]);

    React.useEffect(() => {
        if (orderStart !== '' || orderEnd !== '') {
            getLogbookData();
        }
    }, [orderStart, orderEnd]);

    //-------- Pre-defined dates --------//    
    const preDefinedDates = () => {
        let from = value.startDate;
        const from1 = ("0" + from.getDate()).slice(-2) + "-" + ("0" + (from.getMonth() + 1)).slice(-2) + "-" + from.getFullYear();
        const sortedFromDate = from.getFullYear() + ("0" + (from.getMonth() + 1)).slice(-2) + ("0" + from.getDate()).slice(-2);
        setfromPeriod(from1);
        setOrderStart(sortedFromDate)

        let to = value.endDate;
        const to1 = ("0" + to.getDate()).slice(-2) + "-" + ("0" + (to.getMonth() + 1)).slice(-2) + "-" + to.getFullYear();
        const sortedToDate = to.getFullYear() + ("0" + (to.getMonth() + 1)).slice(-2) + ("0" + to.getDate()).slice(-2);
        settoPeriod(to1);
        setOrderEnd(sortedToDate)
    }

    //-------- Calender dates --------//
    const calenderFrom = (date) => {
        let from = date;
        const sortedFromDate = from.slice(6, 10) + ("0" + from.slice(3, 5)).slice(-2) + ("0" + from.slice(0, 2)).slice(-2);
        setOrderStart(sortedFromDate)
    }
    const calenderTo = (date) => {
        let to = date;
        const sortedToDate = to.slice(6, 10) + ("0" + to.slice(3, 5)).slice(-2) + ("0" + to.slice(0, 2)).slice(-2);
        setOrderEnd(sortedToDate)
    }

    // React.useEffect(() => { GetUserDetails() }, []);

    const GetUserDetails = async () => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        let temData = [];
        db.transaction(tx => {
            tx.executeSql('SELECT user_id,name,email,Contact,roster_id,roster_pwd,airline_type,LicenceNumber,LicenceType,validity ,Country FROM userProfileData Where user_id = "' + user.id + '"', [], (tx, result) => {
                if (result.rows.length > 0) {
                    console.log('result', result)
                }
                else {
                    console.log('error')
                }
                for (let i = 0; i <= result.rows.length; i++) {
                    temData.push({
                        user_id: result.rows.item(i).user_id,
                        name: result.rows.item(i).name,
                        email: result.rows.item(i).email,
                        Contact: result.rows.item(i).Contact,
                        roster_id: result.rows.item(i).roster_id,
                        roster_pwd: result.rows.item(i).roster_pwd,
                        airline_type: result.rows.item(i).airline_type,
                        Lt: result.rows.item(i).LicenceType,
                        Ln: result.rows.item(i).LicenceNumber,
                        validity: result.rows.item(i).validity,
                        country: result.rows.item(i).Country
                    });
                    setValidity(result.rows.item(i).validity)
                    setLicenceType(result.rows.item(i).LicenceType)
                    setLicenceNumber(result.rows.item(i).LicenceNumber)
                    setlicenseHolderName(result.rows.item(i).name);
                }
            });
        });
    }


    //-------------  Get Data from database ------------//
    const getLogbookData = async () => {
        GetUserDetails()
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let temData = [];
        var ordered = {};
        prePopulateddb.transaction(tx => {
            tx.executeSql('SELECT * from logbook WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag = "server" ORDER BY orderedDate ASC', [], (tx, result) => {
                for (let i = 0; i <= result.rows.length; i++) {
                    temData.push({
                        id: result.rows.item(i).id,
                        tag: result.rows.item(i).tag,
                        user_id: result.rows.item(i).user_id,
                        flight_no: result.rows.item(i).flight_no,
                        date: result.rows.item(i).date,
                        day: result.rows.item(i).day,
                        actual_Instrument: result.rows.item(i).actual_Instrument,
                        aircraftReg: result.rows.item(i).aircraftReg,
                        aircraftType: result.rows.item(i).aircraftType,
                        approach1: result.rows.item(i).approach1,
                        approach2: result.rows.item(i).approach2,
                        dayLanding: result.rows.item(i).dayLanding,
                        dayTO: result.rows.item(i).dayTO,
                        dual_day: result.rows.item(i).dual_day,
                        dual_night: result.rows.item(i).dual_night,
                        flight: result.rows.item(i).flight,
                        from_airportID: result.rows.item(i).from_airportID,
                        from_altitude: result.rows.item(i).from_altitude,
                        from_city: result.rows.item(i).from_city,
                        from_country: result.rows.item(i).from_country,
                        from_dayLightSaving: result.rows.item(i).from_dayLightSaving,
                        from_source: result.rows.item(i).from_source,
                        from_lat: result.rows.item(i).from_lat,
                        from_long: result.rows.item(i).from_long,
                        from_name: result.rows.item(i).from_name,
                        from_nameIATA: result.rows.item(i).from_nameIATA,
                        from: result.rows.item(i).from_nameICAO,
                        from_timeZone: result.rows.item(i).from_timeZone,
                        from_type: result.rows.item(i).from_type,
                        fullStop: result.rows.item(i).fullStop,
                        ifr_vfr: result.rows.item(i).ifr_vfr,
                        instructional: result.rows.item(i).instructional,
                        instructor: result.rows.item(i).instructor,
                        landing: result.rows.item(i).inTime,
                        night: result.rows.item(i).night,
                        nightLanding: result.rows.item(i).nightLanding,
                        nightTO: result.rows.item(i).nightTO,
                        chocksOffTime: result.rows.item(i).offTime,
                        chocksOnTime: result.rows.item(i).onTime,
                        takeOff: result.rows.item(i).outTime,
                        p1: result.rows.item(i).p1,
                        p1_us_day: result.rows.item(i).p1_us_day,
                        p1_us_night: result.rows.item(i).p1_us_night,
                        p2: result.rows.item(i).p2,
                        pic_day: result.rows.item(i).pic_day,
                        pic_night: result.rows.item(i).pic_night,
                        stl: result.rows.item(i).stl,
                        RC1: result.rows.item(i).reliefCrew1,
                        RC2: result.rows.item(i).reliefCrew2,
                        RC3: result.rows.item(i).reliefCrew3,
                        RC4: result.rows.item(i).reliefCrew4,
                        route: result.rows.item(i).route,
                        sic_day: result.rows.item(i).sic_day,
                        sic_night: result.rows.item(i).sic_night,
                        sim_instructional: result.rows.item(i).sim_instructional,
                        sim_instrument: result.rows.item(i).sim_instrument,
                        selected_role: result.rows.item(i).selected_role,
                        student: result.rows.item(i).student,
                        to: result.rows.item(i).to_nameICAO,
                        to_lat: result.rows.item(i).to_lat,
                        to_long: result.rows.item(i).to_long,
                        totalTime: result.rows.item(i).totalTime,
                        touch_n_gos: result.rows.item(i).touch_n_gos,
                        waterLanding: result.rows.item(i).waterLanding,
                        waterTO: result.rows.item(i).waterTO,
                        x_country_day: result.rows.item(i).x_country_day,
                        x_country_night: result.rows.item(i).x_country_night,
                        x_country_day_leg: result.rows.item(i).x_country_day_leg,
                        x_country_night_leg: result.rows.item(i).x_country_night_leg,
                        sim_type: result.rows.item(i).sim_type,
                        sim_exercise: result.rows.item(i).sim_exercise,
                        pf_time: result.rows.item(i).pf_time,
                        pm_time: result.rows.item(i).pm_time,
                        sfi_sfe: result.rows.item(i).sfi_sfe,
                        simLocation: result.rows.item(i).simLocation,
                        p1_ut_day: result.rows.item(i).p1_ut_day,
                        p1_ut_night: result.rows.item(i).p1_ut_night,
                        remark: result.rows.item(i).remark,
                        autolanding: result.rows.item(i).autolanding,
                    });
                    setData(temData);
                    //-------- Converted Data into monthWise -------//
                    var entry = temData[i];
                    var m = parseInt(entry.date.split("-")[1]) - 1;
                    var y = parseInt(entry.date.split("-")[2]);
                    if (!ordered[months[m] + " " + [y]]) { ordered[months[m] + " " + [y]] = []; }
                    ordered[months[m] + " " + [y]].push(entry);
                    setMonthWise(ordered)
                }
            });

        })
    }

    //-------- Total calculation of Monthwise  data --------//
    const monthTotal = () => {
        

        let htmlContent = '<html><body>'

        Object.entries(monthWise).map((monthData) => {
            var dayDual1 = 0;
        var nightDual1 = 0;
        var daySolo1 = 0;
        var nightSolo1 = 0;
        var dayUt1 = 0;
        var daySic1 = 0;
        var dayP1us1 = 0;
        var dayPic1 = 0;
        var nightUt1 = 0;
        var nightSic1 = 0;
        var nightP1us1 = 0;
        var nightPic1 = 0;
        var totalT1 = 0;
        var simTime1 = 0;
        var actTime1 = 0;
        var synSimTime1 = 0;
        var instTime1 = 0;


            for (var i = 0; i < monthData.length; i++) {
                var previous = monthData[i - 1];
                var current = monthData[i];
                if (current != previous) {
                    var dayDual = 0;
                    var nightDual = 0;
                    var daySolo = 0;
                    var nightSolo = 0;
                    var dayUt = 0;
                    var daySic = 0;
                    var dayP1us = 0;
                    var dayPic = 0;
                    var nightUt = 0;
                    var nightSic = 0;
                    var nightP1us = 0;
                    var nightPic = 0;
                    var totalT = 0;
                    var simTime = 0;
                    var actTime = 0;
                    var synSimTime = 0;
                    var instTime = 0;
                }
            }
            monthData[1].map(d => {
                //-------- total dual Day  flying hours  --------//
                if (d.dual_day !== "") {
                    var dualD = d.dual_day.split(":")
                    var dayDualTotal = Number(dualD[0] * 60) + Number(dualD[1])
                    dayDual += dayDualTotal
                    var dayHours = Math.floor(dayDual / 60);
                    var dayMin = dayDual % 60;
                    if (dayHours < 10) {
                        dayHours = '0' + dayHours;
                    }
                    if (dayMin < 10) {
                        dayMin = '0' + dayMin;
                    }
                    dayDual1 = dayHours + ":" + dayMin;
                    if (isNaN(dayDual1[0])) {
                        dayDual1 = ''
                    }
                }

                //-------- total dual Night  flying hours --------//
                if (d.dual_night !== "") {
                    var dualN = d.dual_night.split(":")
                    var nightDualTotal = Number(dualN[0] * 60) + Number(dualN[1])
                    nightDual += nightDualTotal
                    var dualNHours = Math.floor(nightDual / 60);
                    var dayNMin = nightDual % 60;
                    if (dualNHours < 10) {
                        dualNHours = '0' + dualNHours;
                    }
                    if (dayNMin < 10) {
                        dayNMin = '0' + dayNMin;
                    }
                    nightDual1 = dualNHours + ":" + dayNMin;
                    if (isNaN(nightDual1[1])) {
                        nightDual1 = ''
                    }
                }

                //-------- total solo day  flying hours --------//
                if (d.dual_day !== "") {
                    var dayS = d.dual_day.split(":")
                    var daySoloTotal = Number(dayS[0] * 60) + Number(dayS[1])
                    daySolo += daySoloTotal
                    var daySoloHours = Math.floor(daySolo / 60);
                    var daySoloMin = daySolo % 60;
                    if (daySoloHours < 10) {
                        daySoloHours = '0' + daySoloHours;
                    }
                    if (daySoloMin < 10) {
                        daySoloMin = '0' + daySoloMin;
                    }
                    daySolo1 = daySoloHours + ":" + daySoloMin;
                    if (isNaN(daySolo1[1])) {
                        daySolo1 = ''
                    }
                }

                //-------- total Solo Night  flying hours --------//
                if (d.dual_day !== "") {
                    var nightS = d.dual_day.split(":")
                    var nightSoloTotal = Number(nightS[0] * 60) + Number(nightS[1])
                    nightSolo += nightSoloTotal
                    var nightSoloHours = Math.floor(nightSolo / 60);
                    var nightSoloMin = nightSolo % 60;
                    if (nightSoloHours < 10) {
                        nightSoloHours = '0' + nightSoloHours;
                    }
                    if (nightSoloMin < 10) {
                        nightSoloMin = '0' + nightSoloMin;
                    }
                    nightSolo1 = nightSoloHours + ":" + nightSoloMin;
                    if (isNaN(nightSolo1[1])) {
                        nightSolo1 = ''
                    }
                }

                //-------- total P1_UT Day  flying hours --------//
                if (d.p1_ut_day !== "") {
                    var dayU = d.p1_ut_day.split(":")
                    var dayUtTotal = Number(dayU[0] * 60) + Number(dayU[1])
                    dayUt += dayUtTotal
                    var dayUtHours = Math.floor(dayUt / 60);
                    var dayUtMin = dayUt % 60;
                    if (dayUtHours < 10) {
                        dayUtHours = '0' + dayUtHours;
                    }
                    if (dayUtMin < 10) {
                        dayUtMin = '0' + dayUtMin;
                    }
                    dayUt1 = dayUtHours + ":" + dayUtMin;
                    if (isNaN(dayUt1[1])) {
                        dayUt1 = ''
                    }
                }
                //-------- total P1_UT Night  flying hours --------//
                if (d.p1_ut_night !== "") {
                    var nightU = d.p1_ut_night.split(":")
                    var nightUtTotal = Number(nightU[0] * 60) + Number(nightU[1])
                    nightUt += nightUtTotal
                    var nightUtHours = Math.floor(nightUt / 60);
                    var nightUtMin = nightUt % 60;
                    if (nightUtHours < 10) {
                        nightUtHours = '0' + nightUtHours;
                    }
                    if (nightUtMin < 10) {
                        nightUtMin = '0' + nightUtMin;
                    }
                    nightUt1 = nightUtHours + ":" + nightUtMin;
                    if (isNaN(nightUt1[1])) {
                        nightUt1 = ''
                    }
                }
                //-------- total SIC Day  flying hours --------//
                if (d.sic_day !== "") {
                    var dayP2 = d.sic_day.split(":")
                    var dayP2Total = Number(dayP2[0] * 60) + Number(dayP2[1])
                    daySic += dayP2Total
                    var dayP2Hours = Math.floor(daySic / 60);
                    var dayP2Min = daySic % 60;
                    if (dayP2Hours < 10) {
                        dayP2Hours = '0' + dayP2Hours;
                    }
                    if (dayP2Min < 10) {
                        dayP2Min = '0' + dayP2Min;
                    }
                    daySic1 = dayP2Hours + ":" + dayP2Min;
                    if (isNaN(daySic1[1])) {
                        daySic1 = ''
                    }
                }
                //-------- total SIC Night  flying hours --------//
                if (d.sic_night !== "") {
                    var nightP2 = d.sic_night.split(":")
                    var nightP2Total = Number(nightP2[0] * 60) + Number(nightP2[1])
                    nightSic += nightP2Total
                    var nightP2Hours = Math.floor(nightSic / 60);
                    var nightP2Min = nightSic % 60;
                    if (nightP2Hours < 10) {
                        nightP2Hours = '0' + nightP2Hours;
                    }
                    if (nightP2Min < 10) {
                        nightP2Min = '0' + nightP2Min;
                    }
                    nightSic1 = nightP2Hours + ":" + nightP2Min;
                    if (isNaN(nightSic1[1])) {
                        nightSic1 = ''
                    }
                }
                //-------- total P1_Us Day  flying hours --------//
                if (d.p1_us_day !== "") {
                    var dayUs = d.p1_us_day.split(":")
                    var dayUsTotal = Number(dayUs[0] * 60) + Number(dayUs[1])
                    dayP1us += dayUsTotal
                    var dayUsHours = Math.floor(dayP1us / 60);
                    var dayUsMin = dayP1us % 60;
                    if (dayUsHours < 10) {
                        dayUsHours = '0' + dayUsHours;
                    }
                    if (dayUsMin < 10) {
                        dayUsMin = '0' + dayUsMin;
                    }
                    dayP1us1 = dayUsHours + ":" + dayUsMin;
                    if (isNaN(dayP1us1[1])) {
                        dayP1us1 = ''
                    }
                }
                //-------- total P1_Us Night  flying hours --------//
                if (d.p1_us_night !== "") {
                    var nightUs = d.p1_us_night.split(":")
                    var nightUsTotal = Number(nightUs[0] * 60) + Number(nightUs[1])
                    nightP1us += nightUsTotal
                    var nightUsHours = Math.floor(nightP1us / 60);
                    var nightUsMin = nightP1us % 60;
                    if (nightUsHours < 10) {
                        nightUsHours = '0' + nightUsHours;
                    }
                    if (nightUsMin < 10) {
                        nightUsMin = '0' + nightUsMin;
                    }
                    nightP1us1 = nightUsHours + ":" + nightUsMin;
                    if (isNaN(nightP1us1[1])) {
                        nightP1us1 = ''
                    }
                }

                //-------- total PIC Day  flying hours --------//
                if (d.pic_day !== "") {
                    var dayP1 = d.pic_day.split(":")
                    var dayP1Total = Number(dayP1[0] * 60) + Number(dayP1[1])
                    dayPic += dayP1Total
                    var dayP1Hours = Math.floor(dayPic / 60);
                    var dayP1Min = dayPic % 60;
                    if (dayP1Hours < 10) {
                        dayP1Hours = '0' + dayP1Hours;
                    }
                    if (dayP1Min < 10) {
                        dayP1Min = '0' + dayP1Min;
                    }
                    dayPic1 = dayP1Hours + ":" + dayP1Min;
                    if (isNaN(dayPic1[1])) {
                        dayPic1 = ''
                    }
                }

                //-------- total PIC Night  flying hours --------//
                if (d.pic_night !== "") {
                    var nightP1 = d.pic_night.split(":")
                    var nightP1Total = Number(nightP1[0] * 60) + Number(nightP1[1])
                    nightPic += nightP1Total
                    var nightP1Hours = Math.floor(nightPic / 60);
                    var nightP1Min = nightPic % 60;
                    if (nightP1Hours < 10) {
                        nightP1Hours = '0' + nightP1Hours;
                    }
                    if (nightP1Min < 10) {
                        nightP1Min = '0' + nightP1Min;
                    }
                    nightPic1 = nightP1Hours + ":" + nightP1Min;
                    if (isNaN(nightPic1[1])) {
                        nightPic1 = '00:00'
                    }
                }
                //-------- totalTime flying hours --------//
                if (d.totalTime !== "") {
                    var tTotal = d.totalTime.split(":")
                    var tTotalTotal = Number(tTotal[0] * 60) + Number(tTotal[1])
                    totalT += tTotalTotal
                    var tTotalHours = Math.floor(totalT / 60);
                    var tTotalMin = totalT % 60;
                    if (tTotalHours < 10) {
                        tTotalHours = '0' + tTotalHours;
                    }
                    if (tTotalMin < 10) {
                        tTotalMin = '0' + tTotalMin;
                    }
                    totalT1 = tTotalHours + ":" + tTotalMin;
                    if (isNaN(totalT1[1])) {
                        totalT1 = ''
                    }
                }
                //-------- total Sim_Instructional  flying hours --------//
                if (d.sim_instructional !== "") {
                    var simuTime = d.sim_instructional.split(":")
                    var simTimeTotal = Number(simuTime[0] * 60) + Number(simuTime[1])
                    simTime += simTimeTotal
                    var simTimeHours = Math.floor(simTime / 60);
                    var simTimeMin = simTime % 60;
                    if (simTimeHours < 10) {
                        simTimeHours = '0' + simTimeHours;
                    }
                    if (simTimeMin < 10) {
                        simTimeMin = '0' + simTimeMin;
                    }
                    simTime1 = simTimeHours + ":" + simTimeMin;
                    if (isNaN(simTime1[1])) {
                        simTime1 = ''
                    }
                }
                //-------- total act_Instrument  flying hours --------//
                if (d.actual_Instrument !== "") {
                    var actualTime = d.actual_Instrument.split(":")
                    var actTimeTotal = Number(actualTime[0] * 60) + Number(actualTime[1])
                    actTime += actTimeTotal
                    var actTimeHours = Math.floor(actTime / 60);
                    var actTimeMin = actTime % 60;
                    if (actTimeHours < 10) {
                        actTimeHours = '0' + actTimeHours;
                    }
                    if (actTimeMin < 10) {
                        actTimeMin = '0' + actTimeMin;
                    }
                    actTime1 = actTimeHours + ":" + actTimeMin;
                    if (isNaN(actTime1[1])) {
                        actTime1 = ''
                    }
                }
                //-------- total Instructional  flying hours --------//
                if (d.instructional !== "") {
                    var instrTime = d.instructional.split(":")
                    var instTimeTotal = Number(instrTime[0] * 60) + Number(instrTime[1])
                    instTime += instTimeTotal
                    var instTimeHours = Math.floor(instTime / 60);
                    var instTimeMin = instTime % 60;
                    if (instTimeHours < 10) {
                        instTimeHours = '0' + instTimeHours;
                    }
                    if (instTimeMin < 10) {
                        instTimeMin = '0' + instTimeMin;
                    }
                    instTime1 = instTimeHours + ":" + instTimeMin;
                    if (isNaN(instTime1[1])) {
                        instTime1 = ''
                    }
                }
            })
            htmlContent += '<tr style="height: 20px" class="dgca"> <td class="s0" dir="ltr">' + monthData[0] + '</td>                 <td class="s0" dir="ltr">' + dayDual1 + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + nightDual1 + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + dayUt1 + '</td>                <td class="s0" dir="ltr">' + daySic1 + '</td>                <td class="s0" dir="ltr">' + dayP1us1 + '</td>                <td class="s0" dir="ltr">' + dayPic1 + '</td>                <td class="s0" dir="ltr">' + nightUt1 + '</td>                <td class="s0" dir="ltr">' + nightSic1 + '</td>                <td class="s0" dir="ltr">' + nightP1us1 + '</td>                  <td class="s0" dir="ltr">' + nightPic1 + '</td>                <td class="s0" dir="ltr">' + totalT1 + '</td>       <td class="s0" dir="ltr">' + simTime1 + '</td>         <td class="s0" dir="ltr">' + actTime1 + '</td>                      <td class="s0" dir="ltr">-</td>        <td class="s0" dir="ltr">' + instTime1 + '</td>                <td class="s0" dir="ltr"></td>            </tr>  '
        })
        for (let i = 0; i < 12 - Object.keys(monthWise).length; i++) {
            htmlContent += '<tr style="height: 20px" class="dgca" id=' + i + '>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>       <td class="s0" dir="ltr"></td>         <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>        <td class="s0" dir="ltr"></td>        <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>            </tr>  '
        }
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total calculation of Page Data--------//        
    const Total = () => {
        var totalDualDay = 0;
        var totalDualNight = 0;
        var totalP1_ut_day = 0;
        var totalP1_ut_night = 0;
        var totalp1_us_day = 0;
        var totalp1_us_night = 0;
        var totalsic_day = 0;
        var totalsic_night = 0;
        var totalDay = 0;
        var totalNight = 0;
        var totalsim_instrument = 0;
        var totalactual_Instrument = 0;
        var totalinstructional = 0;
        var TotalTime = 0;

        var totalDualDay1 = '';
        var totalDualNight1 = '';
        var totalP1_ut_day1 = '';
        var totalP1_ut_night1 = '';
        var totalp1_us_day1 = '';
        var totalp1_us_night1 = '';
        var totalsic_day1 = '';
        var totalsic_night1 = '';
        var totalDay1 = '';
        var totalNight1 = '';
        var totalsim_instrument1 = '';
        var totalactual_Instrument1 = '';
        var totalinstructional1 = '';
        var Total_time1 = '';

        data.map(d => {
            //-------- total Day  flying hours --------//
            if (d.pic_day !== "") {
                var Day = d.pic_day.split(":")
                var total_Day = Number(Day[0] * 60) + Number(Day[1])
                totalDay += total_Day
                var dayHours = Math.floor(totalDay / 60);
                var dayMin = totalDay % 60;
                if (dayHours < 10) {
                    dayHours = '0' + dayHours;
                }
                if (dayMin < 10) {
                    dayMin = '0' + dayMin;
                }
                totalDay1 = dayHours + ":" + dayMin;
                if (isNaN(totalDay1[1])) {
                    totalDay1[1] = '0'
                }
            }

            //-------- totalTime  flying hours --------//
            if (d.totalTime !== "") {
            var total = d.totalTime.split(":")
            var total_time = Number(total[0] * 60) + Number(total[1])
            TotalTime += total_time
            var TotalHours = Math.floor(TotalTime / 60);
            var TotalMin = TotalTime % 60;
            if (TotalHours < 10) {
                TotalHours = '0' + TotalHours;
            }
            if (TotalMin < 10) {
                TotalMin = '0' + TotalMin;
            }
            Total_time1 = TotalHours + ":" + TotalMin;
            if (isNaN(Total_time1[1])) {
                Total_time1[1] = '0'
            }
        }


            //-------- total Night  flying hours --------//
            if (d.pic_night !== "") {
                var night = d.pic_night.split(":")
                var total_Night = Number(night[0] * 60) + Number(night[1])
                totalNight += total_Night
                var nightHours = Math.floor(totalNight / 60);
                var nightMin = totalNight % 60;
                if (nightHours < 10) {
                    nightHours = '0' + nightHours;
                }
                if (nightMin < 10) {
                    nightMin = '0' + nightMin;
                }
                totalNight1 = nightHours + ":" + nightMin;
                if (isNaN(totalNight1[0])) {
                    totalNight1 = ''
                }
            }

            //-------- total dual day  flying hours --------//
            if (d.dual_day !== "") {
                var dualDay = d.dual_day.split(":")
                var total_DualDay = Number(dualDay[0] * 60) + Number(dualDay[1])
                totalDualDay += total_DualDay
                var dualDayHours = Math.floor(totalDualDay / 60);
                var dualDayMin = totalDualDay % 60;
                if (dualDayHours < 10) {
                    dualDayHours = '0' + dualDayHours;
                }
                if (dualDayMin < 10) {
                    dualDayMin = '0' + dualDayMin;
                }
                totalDualDay1 = dualDayHours + ":" + dualDayMin;
                if (isNaN(totalDualDay1[0])) {
                    totalDualDay1 = ''
                }
            }

            //-------- total dual Night  flying hours --------//
            if (d.dual_night !== "") {
                var dualNight = d.dual_night.split(":")
                var total_dualNight = Number(dualNight[0] * 60) + Number(dualNight[1])
                totalDualNight += total_dualNight
                var dualNightHours = Math.floor(totalDualNight / 60);
                var dualNightMin = totalDualNight % 60;
                if (dualNightHours < 10) {
                    dualNightHours = '0' + dualNightHours;
                }
                if (dualNightMin < 10) {
                    dualNightMin = '0' + dualNightMin;
                }
                totalDualNight1 = dualNightHours + ":" + dualNightMin;
                if (isNaN(totalDualNight1[0])) {
                    totalDualNight1 = ''
                }
            }

            //-------- total P1_Ut Day  flying hours --------//
            if (d.p1_ut_day !== "") {
                var p1_ut_day = d.p1_ut_day.split(":")
                var total_p1_ut_day = Number(p1_ut_day[0] * 60) + Number(p1_ut_day[1])
                totalP1_ut_day += total_p1_ut_day
                var P1_ut_dayHours = Math.floor(totalP1_ut_day / 60);
                var P1_ut_day_Min = totalP1_ut_day % 60;
                if (P1_ut_dayHours < 10) {
                    P1_ut_dayHours = '0' + P1_ut_dayHours;
                }
                if (P1_ut_day_Min < 10) {
                    P1_ut_day_Min = '0' + P1_ut_day_Min;
                }
                totalP1_ut_day1 = P1_ut_dayHours + ":" + P1_ut_day_Min;
                if (isNaN(totalP1_ut_day1[0])) {
                    totalP1_ut_day1 = ''
                }
            }


            //-------- total p1_ut Night  flying hours --------//
            if (d.p1_ut_night !== "") {
                var p1_ut_night = d.p1_ut_night.split(":")
                var total_p1_ut_night = Number(p1_ut_night[0] * 60) + Number(p1_ut_night[1])
                totalP1_ut_night += total_p1_ut_night
                var P1_ut_night_Hours = Math.floor(totalP1_ut_night / 60);
                var P1_ut_night_Min = totalP1_ut_night % 60;
                if (P1_ut_night_Hours < 10) {
                    P1_ut_night_Hours = '0' + P1_ut_night_Hours;
                }
                if (P1_ut_night_Min < 10) {
                    P1_ut_night_Min = '0' + P1_ut_night_Min;
                }
                totalP1_ut_night1 = P1_ut_night_Hours + ":" + P1_ut_night_Min;
                if (isNaN(totalP1_ut_night1[0])) {
                    totalP1_ut_night1 = ''
                }
            }


            //-------- total P1_Us Day flying hours --------//
            if (d.p1_us_day !== "") {
                var p1_us_day = d.p1_us_day.split(":")
                var total_p1_us_day = Number(p1_us_day[0] * 60) + Number(p1_us_day[1])
                totalp1_us_day += total_p1_us_day
                var p1_us_day_Hours = Math.floor(totalp1_us_day / 60);
                var p1_us_day_Min = totalp1_us_day % 60;
                if (p1_us_day_Hours < 10) {
                    p1_us_day_Hours = '0' + p1_us_day_Hours;
                }
                if (p1_us_day_Min < 10) {
                    p1_us_day_Min = '0' + p1_us_day_Min;
                }
                totalp1_us_day1 = p1_us_day_Hours + ":" + p1_us_day_Min;
                if (isNaN(totalp1_us_day1[0])) {
                    totalp1_us_day1 = ''
                }
            }
            //-------- total P1_Us Night  flying hours --------//
            if (d.p1_us_night !== "") {
                var p1_us_night = d.p1_us_night.split(":")
                var total_p1_us_night = Number(p1_us_night[0] * 60) + Number(p1_us_night[1])
                totalp1_us_night += total_p1_us_night
                var p1_us_night_Hours = Math.floor(totalp1_us_night / 60);
                var p1_us_night_Min = totalp1_us_night % 60;
                if (p1_us_night_Hours < 10) {
                    p1_us_night_Hours = '0' + p1_us_night_Hours;
                }
                if (p1_us_night_Min < 10) {
                    p1_us_night_Min = '0' + p1_us_night_Min;
                }
                totalp1_us_night1 = p1_us_night_Hours + ":" + p1_us_night_Min;
                if (isNaN(totalp1_us_night1[0])) {
                    totalp1_us_night1 = ''
                }
            }
            //-------- total Sic Day flying hours --------//
            if (d.sic_day !== "") {
                var sic_day = d.sic_day.split(":")
                var total_sic_day = Number(sic_day[0] * 60) + Number(sic_day[1])
                totalsic_day += total_sic_day
                var sic_day_Hours = Math.floor(totalsic_day / 60);
                var sic_day_Min = totalsic_day % 60;
                if (sic_day_Hours < 10) {
                    sic_day_Hours = '0' + sic_day_Hours;
                }
                if (sic_day_Min < 10) {
                    sic_day_Min = '0' + sic_day_Min;
                }
                totalsic_day1 = sic_day_Hours + ":" + sic_day_Min;
                if (isNaN(totalsic_day1[1])) {
                    totalsic_day1 = ''
                }
            }

            //-------- total SIC Night  flying hours --------//
            if (d.sic_night !== "") {
                var sic_night = d.sic_night.split(":")
                var total_sic_night = Number(sic_night[0] * 60) + Number(sic_night[1])
                totalsic_night += total_sic_night
                var sic_night_Hours = Math.floor(totalsic_night / 60);
                var sic_night_Min = totalsic_night % 60;
                if (sic_night_Hours < 10) {
                    sic_night_Hours = '0' + sic_night_Hours;
                }
                if (sic_night_Min < 10) {
                    sic_night_Min = '0' + sic_night_Min;
                }
                totalsic_night1 = sic_night_Hours + ":" + sic_night_Min;
                if (isNaN(totalsic_night1[0])) {
                    totalsic_night1 = ''
                }
            }


            //-------- total sim_instrument  flying hours --------//
            if (d.sim_instrument !== "") {
                var sim_instrument = d.sim_instrument.split(":")
                var total_sim_instrument = Number(sim_instrument[0] * 60) + Number(sim_instrument[1])
                totalsim_instrument += total_sim_instrument
                var sim_instrument_Hours = Math.floor(totalsim_instrument / 60);
                var sim_instrument_Min = totalsim_instrument % 60;
                if (sim_instrument_Hours < 10) {
                    sim_instrument_Hours = '0' + sim_instrument_Hours;
                }
                if (sim_instrument_Min < 10) {
                    sim_instrument_Min = '0' + sim_instrument_Min;
                }
                totalsim_instrument1 = sim_instrument_Hours + ":" + sim_instrument_Min;
                if (isNaN(totalsim_instrument1[0])) {
                    totalsim_instrument1 = '00:00'
                }
            }


            //-------- total act_Instrument flying hours --------//
            if (d.actual_Instrument !== "") {
                var actual_Instrument = d.actual_Instrument.split(":")
                var total_actual_Instrument = Number(actual_Instrument[0] * 60) + Number(actual_Instrument[1])
                totalactual_Instrument += total_actual_Instrument
                var actual_Instrument_Hours = Math.floor(totalactual_Instrument / 60);
                var actual_Instrument_Min = totalactual_Instrument % 60;
                if (actual_Instrument_Hours < 10) {
                    actual_Instrument_Hours = '0' + actual_Instrument_Hours;
                }
                if (actual_Instrument_Min < 10) {
                    actual_Instrument_Min = '0' + actual_Instrument_Min;
                }
                totalactual_Instrument1 = actual_Instrument_Hours + ":" + actual_Instrument_Min;
                console.log(totalactual_Instrument1)
                if (isNaN(totalactual_Instrument1[0])) {
                    totalactual_Instrument1 = '00:00'
                }
            }


            //-------- total Instructional flying hours --------//
            if (d.instructional !== "") {
                var instructional = d.instructional.split(":")
                var total_instructional = Number(instructional[0] * 60) + Number(instructional[1])
                totalinstructional += total_instructional
                var instructional_Hours = Math.floor(totalinstructional / 60);
                var instructional_Min = totalinstructional % 60;
                if (instructional_Hours < 10) {
                    instructional_Hours = '0' + instructional_Hours;
                }
                if (instructional_Min < 10) {
                    instructional_Min = '0' + instructional_Min;
                }
                totalinstructional1 = instructional_Hours + ":" + instructional_Min;
                if (isNaN(total_instructional[0])) {
                    total_instructional = '00:00'
                }
            }
        })

        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 30px">                <td class="s0" dir="ltr">Total</td>                <td class="s0" dir="ltr">' + totalDualDay1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalDualNight1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalP1_ut_day1 + '</td>                <td class="s0" dir="ltr">' + totalsic_day1 + '</td>                <td class="s0" dir="ltr">' + totalp1_us_day1 + '</td>                <td class="s0" dir="ltr">' + totalDay1 + '</td>                <td class="s0" dir="ltr">' + totalP1_ut_night1 + '</td>                <td class="s0" dir="ltr">' + totalsic_night1 + '</td>                <td class="s0" dir="ltr">' + totalp1_us_night1 + '</td>                <td class="s0" dir="ltr">' + totalNight1 + '</td>       <td class="s0" dir="ltr">' + Total_time1 + '</td>         <td class="s0" dir="ltr">' + totalsim_instrument1 + '</td>                <td class="s0" dir="ltr">' + totalactual_Instrument1 + '</td>        <td class="s0" dir="ltr">-</td>        <td class="s0" dir="ltr">' + totalinstructional1 + '</td>                <td class="s0" dir="ltr"></td>            </tr>  '
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Print To Pdf --------//
    const printPDF = async () => {
        if (data !== null) {
            const beforeTable =
                '<p style="text-align:center;">Flying experience for period from <strong>' +
                fromPeriod +
                '</strong> to <strong>' +
                toPeriod +
                '</strong> (Preceding 5 years/preceding 6 months/preceding 18 months) <br>Name of Licence Holder: <strong>' +
                licenseHolderName +
                '</strong> Licence Name: <strong>' +
                LicenceType
                + '</strong> Licence Number: <strong>' +
                LicenceNumber
                + '</strong> Valid upto:<strong>' +
                validity
                + '</strong></p>Aircrafts flown :<br><br>';

            const afterTable =
                '<div><p>Note : Write P1 U/S experience seperately and do not include in CO-PILOT column</p><p>This is to Certify that I have examined the logbooks of Mr anant and the above is a true summary.</p><div style="width:100%; float:left;"><div style="width:32%; float:left; border:1px solid #000; height:100px; margin-top:20px;"></div><div style="width:33%; float:left; margin-top:100px; text-align:center"><p>Seal of the organisation</p></div><div style="width:33%; float:left;"><p>Countersigned-:................................</p><p>Name-:.........................................</p><p>Designation-:..................................</p><p>Company Name-:.........................................</p><p>Date-:.............................. </p></div></div><p>Note :Fill up seperate CA-39 form for flying in preceding 5 years/ preceding 6 months/ preceding 12 months/preceding 18 months,(as required by respective schedule-II of the Aircraft Rules ) Seperate form will beused for Helicopter flying and Aeroplane flying.This form shall be countersigned by competant authority who isauthorized to sign log book as per rule 67A of the Aircraft Rules 1937.</p></div>'
            const results = await RNHTMLtoPDF.convert({
                html:
                    beforeTable +
                    '<style type="text/css">table{"page-break-after: always;"} .dgca:nth-child(even) {background-color: #e0ebeb;} .ritz .waffle a { color: inherit; }.ritz .waffle .s0{text-align:center;color:#000000;font-size:10pt;vertical-align:center;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;padding:0px 10px;} th ,td{ border: 1px #000 solid}</style><div class="ritz grid-container" dir="ltr">    <table class="waffle" cellspacing="0" cellpadding="0">         <thead>          <tr style="height: 30px">                <th class="s0" dir="ltr" rowspan="3" style="padding:0px 30px;">Date</th>                <th class="s0" dir="ltr" colspan="4">SINGLE ENGINE AIRCRAFT</th>                <th class="s0" dir="ltr" colspan="9">MULTIPLE ENGINE AIRCRAFT / HELICOPTER</th>                <th class="s0" dir="ltr" colspan="3">INSTRUMENT TYPE</th>                <th class="s0" dir="ltr" rowspan="3">Instructional Flying</th>                <th class="s0" dir="ltr" rowspan="3">Remark</th>            </tr>            <tr style="height: 20px">                <th class="s0" dir="ltr" colspan="2">Day</th>                <th class="s0" dir="ltr" colspan="2">Night</th>                <th class="s0" dir="ltr" colspan="4">Day</th>                <th class="s0" dir="ltr" colspan="5">Night</th>                <th class="s0" dir="ltr" colspan="2">ON AIRCRAFT</th>                <th class="s0" dir="ltr" rowspan="2">Synthetic Simulated hr</th>            </tr>            <tr style="height: 20px">                <th class="s0" dir="ltr">Dual</th>                <th class="s0" dir="ltr">Solo</th>                <th class="s0" dir="ltr">Dual</th>                <th class="s0" dir="ltr">Solo</th>                <th class="s0" dir="ltr">U/T</th>                <th class="s0" dir="ltr">Co-Pilot</th>                <th class="s0" dir="ltr">PI (US)</th>                <th class="s0" dir="ltr">PIC</th>                <th class="s0" dir="ltr">U/T</th>                <th class="s0" dir="ltr">Co-Pilot</th>                <th class="s0" dir="ltr">PI (US)</th>                <th class="s0" dir="ltr">PIC</th>                <th class="s0" dir="ltr">Total</th>                <th class="s0" dir="ltr">Simulated</th>                <th class="s0" dir="ltr">Actual</th>            </tr></thead><tbody>' + monthTotal() + '' + Total() + '         </tbody>    </table></div>' + afterTable,
                fileName: 'test',
                directory: 'Documents',
                base64: true,
                width: 842,
                height: 595,
                screnName: "DGCA-39"

            });
            navigation.navigate('ShowPDF', {
                filepath: results.filePath,
                base64: results.base64,
                screnName: "DGCA-39"

            });
            setValue(null)
            settoPeriod('')
            setfromPeriod('')
        } else {
            alert("No Data Found")
        }
    };


    // ------------ Validation --------- //
    const validate = () => {
        if (period == "preDefined") {
            if (value == null) {
                alert("please Select Duration");
            }
            else {
                printPDF();
            }
        }
        else if (period == "calenderDate") {
            if (fromPeriod == '') {
                alert("Please Select Start Date")
            }
            else if (toPeriod == '') {
                alert("Please Select End Date")
            }
            else {
                printPDF();
            }
        }
    }

    return (
        <SafeAreaView style={[DgcaLogbookStyles.container, { backgroundColor: theme.backgroundColor }]}>
            <ScrollView>
                <View style={DgcaLogbookStyles.header}>
                    <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.goBack()} />
                    <Text style={DgcaLogbookStyles.aircrafts}>DGCA (CA-39)</Text>
                </View>

                <View style={DgcaLogbookStyles.mainTagLine}>
                    <Text style={dark ? DgcaLogbookStyles.DarktagLine : DgcaLogbookStyles.tagLine}>Period</Text>
                </View>

                <RadioButton.Group
                    onValueChange={period => setPeriod(period)} value={period}>
                    <View style={DgcaLogbookStyles.radioSection}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color={dark ? '#fff' : '#000'}
                                    value="preDefined" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Pre Defined</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 100 }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color={dark ? '#fff' : '#000'}
                                    value="calenderDate" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Calender Date</Text>
                            </View>
                        </View>
                    </View>
                </RadioButton.Group>
                <View style={Platform.OS === 'ios' ? { paddingHorizontal: 10, paddingVertical: 20, zIndex: 999 } : { paddingHorizontal: 10, paddingVertical: 20, }}>
                    {period == 'preDefined' ?
                        <View style={{ width: '100%' }}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder="Select Duration"
                                style={[{
                                    borderWidth: 0.2,
                                    borderColor: dark ? "#fff" : "#393F45",
                                    marginTop: 10,
                                }]}
                                textStyle={{
                                    fontSize: 14,
                                    color: "#266173",
                                }}
                                dropDownContainerStyle={{ borderColor: "#266173", backgroundColor: dark ? '#000' : '#fff' }}
                            />
                        </View>
                        :
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <DatePicker
                                    style={{ width: '48%' }}
                                    date={fromPeriod}
                                    mode="date"
                                    placeholder="From"
                                    placeholderTextColor="#266173"
                                    format="DD-MM-YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    suffixIcon={null}
                                    customStyles={{
                                        dateInput: {
                                            borderColor: '#F2F2F2',
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            width: '50%',
                                        },
                                        dateIcon: {
                                            display: 'none'
                                        },
                                    }}
                                    onDateChange={(date) => {
                                        setfromPeriod(date); calenderFrom(date)
                                    }}
                                />

                                <DatePicker
                                    style={{ width: '48%', marginLeft: 15 }}
                                    date={toPeriod}
                                    mode="date"
                                    placeholder="To"
                                    placeholderTextColor="#266173"
                                    format="DD-MM-YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    suffixIcon={null}
                                    customStyles={{
                                        dateInput: {
                                            borderColor: '#F2F2F2',
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            width: '50%',
                                        },
                                        dateIcon: {
                                            display: 'none'
                                        },
                                    }}
                                    onDateChange={(date) => {
                                        settoPeriod(date); calenderTo(date)
                                    }}
                                />
                            </View>
                        </View>
                    }
                </View>

                <View style={DgcaLogbookStyles.footer}>
                    <TouchableOpacity onPress={validate}>
                        <View style={DgcaLogbookStyles.button}>
                            <Text style={DgcaLogbookStyles.buttonText}>View/Download</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// define your styles


//make this component available to the app
export default DGCA39;
