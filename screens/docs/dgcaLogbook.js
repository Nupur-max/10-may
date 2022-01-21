//import liraries
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Platform, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import DgcaLogbookStyles from '../../styles/dgcaLogbookStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from '../../theme-context';
import {
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfYear,
    endOfYear,
    addYears
} from 'date-fns';
import SQLite from 'react-native-sqlite-storage';


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

// create a component
const DgcaLogBook = ({ navigation }) => {
    const [logOption, setLogOption] = useState('Logbook');
    const [period, setPeriod] = useState('preDefined')
    const [fromPeriod, setfromPeriod] = useState('');
    const [toPeriod, settoPeriod] = useState('');
    const [licenseHolderName, setlicenseHolderName] = useState('Nupur');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [orderStart, setOrderStart] = React.useState('')
    const [orderEnd, setOrderEnd] = React.useState('')
    const [rows, setRows] = React.useState(10);
    const [monthWise, setMonthWise] = React.useState([]);
    const [page, setPage] = React.useState(1)
    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const [items, setItems] = React.useState([
        {
            label: 'This Month',
            value: {
                startDate: defineds.startOfMonth,
                endDate: defineds.endOfMonth
            }
        },
        {
            label: 'This Year',
            value: {
                startDate: defineds.startOfYear,
                endDate: defineds.endOfYear
            }
        },
        {
            label: 'Last Month',
            value: {
                startDate: defineds.startOfLastMonth,
                endDate: defineds.endOfLastMonth
            }
        },
        {
            label: 'Last Year',
            value: {
                startDate: defineds.startOflastYear,
                endDate: defineds.endOflastYear
            }
        },
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
        {
            label: 'Last 5 Years', value: {
                startDate: defineds.startOflast5Year,
                endDate: defineds.endOflast5Year
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
        if (orderStart !== '00:00' || orderEnd !== '00:00') {
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

    //-------------  Get Data from database ------------//
    const getLogbookData = async () => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let temData = [];
        var ordered = {};
        prePopulateddb.transaction(tx => {
            if (logOption == 'Logbook') {
                tx.executeSql('SELECT * from logbook WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag == "server" AND aircraftReg != "SIMU" ORDER BY orderedDate ASC', [], (tx, result) => {
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
                            dayLanding: result.rows.item(i).dayLanding,
                            dayTO: result.rows.item(i).dayTO,
                            dual_day: result.rows.item(i).dual_day,
                            dual_night: result.rows.item(i).dual_night,
                            flight: result.rows.item(i).flight,
                            from: result.rows.item(i).from_nameICAO,
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
                            route: result.rows.item(i).route,
                            sic_day: result.rows.item(i).sic_day,
                            sic_night: result.rows.item(i).sic_night,
                            sim_instructional: result.rows.item(i).sim_instructional,
                            sim_instrument: result.rows.item(i).sim_instrument,
                            selected_role: result.rows.item(i).selected_role,
                            student: result.rows.item(i).student,
                            to: result.rows.item(i).to_nameICAO,
                            totalTime: result.rows.item(i).totalTime,
                            sim_type: result.rows.item(i).sim_type,
                            sim_exercise: result.rows.item(i).sim_exercise,
                            pf_time: result.rows.item(i).pf_time,
                            pm_time: result.rows.item(i).pm_time,
                            sfi_sfe: result.rows.item(i).sfi_sfe,
                            simLocation: result.rows.item(i).simLocation,
                            p1_ut_day: result.rows.item(i).p1_ut_day,
                            p1_ut_night: result.rows.item(i).p1_ut_night,
                            remark: result.rows.item(i).remark,
                            oredeDate: result.rows.item(i).orderedDate
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
            }
            else if (logOption == 'Sim') {
                tx.executeSql('SELECT * from logbook WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag == "server" AND aircraftReg = "SIMU" ORDER BY orderedDate ASC', [], (tx, result) => {
                    for (let i = 0; i <= result.rows.length; i++) {
                        temData.push({
                            id: result.rows.item(i).id,
                            tag: result.rows.item(i).tag,
                            aircraftReg: result.rows.item(i).aircraftReg,
                            user_id: result.rows.item(i).user_id,
                            date: result.rows.item(i).date,
                            from: result.rows.item(i).from_nameICAO,
                            to: result.rows.item(i).to_nameICAO,
                            outTime: result.rows.item(i).outTime,
                            inTime: result.rows.item(i).inTime,
                            aircraftType: result.rows.item(i).aircraftType,
                            sim_exercise: result.rows.item(i).sim_exercise,
                            pf_time: result.rows.item(i).pf_time,
                            pm_time: result.rows.item(i).pm_time,
                            oredeDate: result.rows.item(i).orderedDate

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
            }
            else if (logOption == 'Stl') {
                tx.executeSql('SELECT * from logbook WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag == "server" AND stl == "true" ORDER BY orderedDate ASC', [], (tx, result) => {
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
                            dayLanding: result.rows.item(i).dayLanding,
                            dayTO: result.rows.item(i).dayTO,
                            dual_day: result.rows.item(i).dual_day,
                            dual_night: result.rows.item(i).dual_night,
                            flight: result.rows.item(i).flight,
                            from: result.rows.item(i).from_nameICAO,
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
                            route: result.rows.item(i).route,
                            sic_day: result.rows.item(i).sic_day,
                            sic_night: result.rows.item(i).sic_night,
                            sim_instructional: result.rows.item(i).sim_instructional,
                            sim_instrument: result.rows.item(i).sim_instrument,
                            selected_role: result.rows.item(i).selected_role,
                            student: result.rows.item(i).student,
                            to: result.rows.item(i).to_nameICAO,
                            totalTime: result.rows.item(i).totalTime,
                            sim_type: result.rows.item(i).sim_type,
                            sim_exercise: result.rows.item(i).sim_exercise,
                            pf_time: result.rows.item(i).pf_time,
                            pm_time: result.rows.item(i).pm_time,
                            sfi_sfe: result.rows.item(i).sfi_sfe,
                            simLocation: result.rows.item(i).simLocation,
                            p1_ut_day: result.rows.item(i).p1_ut_day,
                            p1_ut_night: result.rows.item(i).p1_ut_night,
                            remark: result.rows.item(i).remark,
                            oredeDate: result.rows.item(i).orderedDate
                        });
                        setData(temData);
                        //-------- Converted Data into monthWise -------//
                        var m = parseInt(entry.date.split("-")[1]) - 1;
                        var y = parseInt(entry.date.split("-")[2]);
                        if (!ordered[months[m] + " " + [y]]) { ordered[months[m] + " " + [y]] = []; }
                        ordered[months[m] + " " + [y]].push(entry);
                        setMonthWise(ordered)
                    }
                });
            }
        });
    };

    //-------- total calculation of logbook and stl data -------// 
    const totalCalculation = (monthData) => {
        let totalDualDay = 0;
        let totalDualNight = 0;
        let totalP1_ut_day = 0;
        let totalP1_ut_night = 0;
        let totalp1_us_day = 0;
        let totalp1_us_night = 0;
        let totalsic_day = 0;
        let totalsic_night = 0;
        let totalPicDay = 0;
        let totalPicNight = 0;
        let totalsim_instrument = 0;
        let totalactual_Instrument = 0;
        let totalinstructional = 0;

        let totalDualDay1 = '';
        let totalDualNight1 = '';
        let totalP1_ut_day1 = '';
        let totalP1_ut_night1 = '';
        let totalp1_us_day1 = '';
        let totalp1_us_night1 = '';
        let totalsic_day1 = '';
        let totalsic_night1 = '';
        let totalPicDay1 = '';
        let totalPicNight1 = '';
        let totalsim_instrument1 = '';
        let totalactual_Instrument1 = '';
        let totalinstructional1 = '';

        monthData[1].map(d => {
            // -------- total day flying hours -------- //
            if (d.pic_day !== "") {
                var Day = d.pic_day.split(":")
                var total_Pic_Day = Number(Day[0] * 60) + Number(Day[1])
                totalPicDay += total_Pic_Day
                var dayHours = Math.floor(totalPicDay / 60);
                var dayMin = totalPicDay % 60;
                if (dayHours < 10) {
                    dayHours = '0' + dayHours;
                }
                if (dayMin < 10) {
                    dayMin = '0' + dayMin;
                }
                totalPicDay1 = dayHours + ":" + dayMin;
                if (isNaN(totalPicDay1[1])) {
                    totalPicDay1[1] = '0'
                }
            }

            // -------- total night flying hours -------- //
            if (d.pic_night !== "") {
                var night = d.pic_night.split(":")
                var total_Night = Number(night[0] * 60) + Number(night[1])
                totalPicNight += total_Night
                var nightHours = Math.floor(totalPicNight / 60);
                var nightMin = totalPicNight % 60;
                if (nightHours < 10) {
                    nightHours = '0' + nightHours;
                }
                if (nightMin < 10) {
                    nightMin = '0' + nightMin;
                }
                totalPicNight1 = nightHours + ":" + nightMin;
                if (isNaN(totalPicNight1[1])) {
                    totalPicNight1 = '00:00'
                }
            }
            // -------- total dual day flying hours -------- //
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
                if (isNaN(totalDualDay1[1])) {
                    totalDualDay1 = '00:00'
                }
            }

            // -------- total dual Night flying hours -------- //
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
                if (isNaN(totalDualNight1[1])) {
                    totalDualNight1 = '00:00'
                }

            }
            // -------- total p1_ut_day flying hours -------- //
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
                if (isNaN(totalP1_ut_day1[1])) {
                    totalP1_ut_day1 = '00:00'
                }
            }


            // -------- total p1_ut_night flying hours -------- //
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
                if (isNaN(totalP1_ut_night1[1])) {
                    totalP1_ut_night1 = '00:00'
                }
            }


            // -------- total p1_us_day flying hours -------- //
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
                if (isNaN(totalp1_us_day1[1])) {
                    totalp1_us_day1 = '00:00'
                }
            }

            // -------- total p1_us_night flying hours -------- //
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
                if (isNaN(totalp1_us_night1[1])) {
                    totalp1_us_night1 = '00:00'
                }
            }

            // -------- total sic_day flying hours -------- //
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
                    totalsic_day1 = '00:00'
                }
            }

            // -------- total sic_night flying hours -------- //
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
                if (isNaN(totalsic_night1[1])) {
                    totalsic_night1 = '00:00'
                }
            }


            // -------- total sim_instrument flying hours -------- //
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
                if (isNaN(totalsim_instrument1[1])) {
                    totalsim_instrument1 = '00:00'
                }
            }


            // -------- total actual_Instrument flying hours -------- //
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
                if (isNaN(totalactual_Instrument1[1])) {
                    totalactual_Instrument1 = '00:00'
                }
            }


            // -------- total instructional flying hours -------- //
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
                total_instructional = instructional_Hours + ":" + instructional_Min;
                if (isNaN(total_instructional[0])) {
                    total_instructional = '00:00'
                }
            }
        })

        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr">' + totalDualDay1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalDualNight1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalP1_ut_day1 + '</td>                <td class="s0" dir="ltr">' + totalsic_day1 + '</td>                <td class="s0" dir="ltr">' + totalp1_us_day1 + '</td>                <td class="s0" dir="ltr">' + totalPicDay1 + '</td>                <td class="s0" dir="ltr">' + totalP1_ut_night1 + '</td>                <td class="s0" dir="ltr">' + totalsic_night1 + '</td>                <td class="s0" dir="ltr">' + totalp1_us_night1 + '</td>                <td class="s0" dir="ltr">' + totalPicNight1 + '</td>                <td class="s0" dir="ltr">' + totalsim_instrument1 + '</td>                <td class="s0" dir="ltr">' + totalactual_Instrument1 + '</td>                <td class="s0" dir="ltr">' + totalinstructional1 + '</td>                <td class="s0" dir="ltr"></td>            </tr>                '
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- previous data calculation --------//
    const prevDataCalculation = () => {
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr">' + dualDay_array.splice(-1) + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + dualNight_array.splice(-1) + '</td>                                <td class="s0" dir="ltr"></td>                                <td class="s0" dir="ltr">' + P1_ut_day_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + sicDay_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + p1_us_day_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + picDay_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + P1_ut_night_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + sicNight_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + p1_us_night_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + picNight_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + simInst_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + act_array.splice(-1) + '</td>                                <td class="s0" dir="ltr">' + inst_array.splice(-1) + '</td>                                <td class="s0" dir="ltr"></td>                                           </tr>                '
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total calculation of date data --------//
    var date_totalDualDay = 0;
    var date_totalDualNight = 0;
    var date_totalP1_ut_day = 0;
    var date_totalP1_ut_night = 0;
    var date_totalp1_us_day = 0;
    var date_totalp1_us_night = 0;
    var date_totalsic_day = 0;
    var date_totalsic_night = 0;
    var date_totalPicDay = 0;
    var date_totalPicNight = 0;
    var date_totalsim_instrument = 0;
    var date_totalactual_Instrument = 0;
    var date_totalinstructional = 0;

    var date_totalDualDay1 = '';
    var date_totalDualNight1 = '';
    var date_totalP1_ut_day1 = '';
    var date_totalP1_ut_night1 = '';
    var date_totalp1_us_day1 = '';
    var date_totalp1_us_night1 = '';
    var date_totalsic_day1 = '';
    var date_totalsic_night1 = '';
    var date_totalPicDay1 = '';
    var date_totalPicNight1 = '';
    var date_totalsim_instrument1 = '';
    var date_totalactual_Instrument1 = '';
    var date_totalinstructional1 = '';

    var picDay_array = ["00:00",]
    var picNight_array = ["00:00",]
    var dualDay_array = ["00:00",]
    var dualNight_array = ["00:00",]
    var P1_ut_day_array = ["00:00",]
    var P1_ut_night_array = ["00:00",]
    var p1_us_day_array = ["00:00",]
    var p1_us_night_array = ["00:00",]
    var sicDay_array = ["00:00",]
    var sicNight_array = ["00:00",]
    var simInst_array = ["00:00",]
    var act_array = ["00:00",]
    var inst_array = ["00:00",]

    const totalDateCalculation = (monthData) => {
        monthData[1].map(d => {
            // -------- total Pic day flying hours -------- //
            if (d.pic_day !== "") {
                var Day = d.pic_day.split(":")
                var date_total_Pic_Day = Number(Day[0] * 60) + Number(Day[1])
                date_totalPicDay += date_total_Pic_Day
                var date_dayHours = Math.floor(date_totalPicDay / 60);
                var date_dayMin = date_totalPicDay % 60;
                if (date_dayHours < 10) {
                    date_dayHours = '0' + date_dayHours;
                }
                if (date_dayMin < 10) {
                    date_dayMin = '0' + date_dayMin;
                }
                date_totalPicDay1 = date_dayHours + ":" + date_dayMin;
                if (isNaN(date_totalPicDay1[1])) {
                    date_totalPicDay1[1] = '0'
                }
                picDay_array.push(date_totalPicDay1)
            }

            // -------- total Pic night flying hours -------- //
            if (d.pic_night !== "") {
                var date_night = d.pic_night.split(":")
                var date_total_Night = Number(date_night[0] * 60) + Number(date_night[1])
                date_totalPicNight += date_total_Night
                var date_nightHours = Math.floor(date_totalPicNight / 60);
                var date_nightMin = date_totalPicNight % 60;
                if (date_nightHours < 10) {
                    date_nightHours = '0' + date_nightHours;
                }
                if (date_nightMin < 10) {
                    date_nightMin = '0' + date_nightMin;
                }
                date_totalPicNight1 = date_nightHours + ":" + date_nightMin;
                if (isNaN(date_totalPicNight1[1])) {
                    date_totalPicNight1 = '00:00'
                }
                picNight_array.push(date_totalPicNight1)
            }

            // -------- total dual day flying hours -------- //
            if (d.dual_day !== "") {
                var date_dualDay = d.dual_day.split(":")
                var date_total_DualDay = Number(date_dualDay[0] * 60) + Number(date_dualDay[1])
                date_totalDualDay += date_total_DualDay
                var date_dualDayHours = Math.floor(date_totalDualDay / 60);
                var date_dualDayMin = date_totalDualDay % 60;
                if (date_dualDayHours < 10) {
                    date_dualDayHours = '0' + date_dualDayHours;
                }
                if (date_dualDayMin < 10) {
                    date_dualDayMin = '0' + date_dualDayMin;
                }
                date_totalDualDay1 = date_dualDayHours + ":" + date_dualDayMin;
                if (isNaN(date_totalDualDay1[1])) {
                    date_totalDualDay1 = '00:00'
                }
                dualDay_array.push(date_totalDualDay1)
            }

            //-------- total dual Night flying hours --------//
            if (d.dual_night !== "") {
                var date_dualNight = d.dual_night.split(":")
                var date_total_dualNight = Number(date_dualNight[0] * 60) + Number(date_dualNight[1])
                date_totalDualNight += date_total_dualNight
                var date_dualNightHours = Math.floor(date_totalDualNight / 60);
                var date_dualNightMin = date_totalDualNight % 60;
                if (date_dualNightHours < 10) {
                    date_dualNightHours = '0' + date_dualNightHours;
                }
                if (date_dualNightMin < 10) {
                    date_dualNightMin = '0' + date_dualNightMin;
                }
                date_totalDualNight1 = date_dualNightHours + ":" + date_dualNightMin;
                if (isNaN(date_totalDualNight1[1])) {
                    date_totalDualNight1 = '00:00'
                }
                dualNight_array.push(date_totalDualNight1)
            }

            //-------- total p1_ut_day flying hours --------//
            if (d.p1_ut_day !== "") {
                var date_p1_ut_day = d.p1_ut_day.split(":")
                var date_total_p1_ut_day = Number(date_p1_ut_day[0] * 60) + Number(date_p1_ut_day[1])
                date_totalP1_ut_day += date_total_p1_ut_day
                var date_P1_ut_dayHours = Math.floor(date_totalP1_ut_day / 60);
                var date_P1_ut_day_Min = date_totalP1_ut_day % 60;
                if (date_P1_ut_dayHours < 10) {
                    date_P1_ut_dayHours = '0' + date_P1_ut_dayHours;
                }
                if (date_P1_ut_day_Min < 10) {
                    date_P1_ut_day_Min = '0' + date_P1_ut_day_Min;
                }
                date_totalP1_ut_day1 = date_P1_ut_dayHours + ":" + date_P1_ut_day_Min;
                if (isNaN(date_totalP1_ut_day1[1])) {
                    date_totalP1_ut_day1 = '00:00'
                }
                P1_ut_day_array.push(date_totalP1_ut_day1)
            }

            //-------- total p1_ut_night flying hours --------//
            if (d.p1_ut_night !== "") {
                var date_p1_ut_night = d.p1_ut_night.split(":")
                var date_total_p1_ut_night = Number(date_p1_ut_night[0] * 60) + Number(date_p1_ut_night[1])
                date_totalP1_ut_night += date_total_p1_ut_night
                var date_P1_ut_night_Hours = Math.floor(date_totalP1_ut_night / 60);
                var date_P1_ut_night_Min = date_totalP1_ut_night % 60;
                if (date_P1_ut_night_Hours < 10) {
                    date_P1_ut_night_Hours = '0' + date_P1_ut_night_Hours;
                }
                if (date_P1_ut_night_Min < 10) {
                    date_P1_ut_night_Min = '0' + date_P1_ut_night_Min;
                }
                date_totalP1_ut_night1 = date_P1_ut_night_Hours + ":" + date_P1_ut_night_Min;
                if (isNaN(date_totalP1_ut_night1[1])) {
                    date_totalP1_ut_night1 = '00:00'
                }
                P1_ut_night_array.push(date_totalP1_ut_night1)
            }


            //-------- total p1_us_day flying hours --------//
            if (d.p1_us_day !== "") {
                var date_p1_us_day = d.p1_us_day.split(":")
                var date_total_p1_us_day = Number(date_p1_us_day[0] * 60) + Number(date_p1_us_day[1])
                date_totalp1_us_day += date_total_p1_us_day
                var date_p1_us_day_Hours = Math.floor(date_totalp1_us_day / 60);
                var date_p1_us_day_Min = date_totalp1_us_day % 60;
                if (date_p1_us_day_Hours < 10) {
                    date_p1_us_day_Hours = '0' + date_p1_us_day_Hours;
                }
                if (date_p1_us_day_Min < 10) {
                    date_p1_us_day_Min = '0' + date_p1_us_day_Min;
                }
                date_totalp1_us_day1 = date_p1_us_day_Hours + ":" + date_p1_us_day_Min;
                if (isNaN(date_totalp1_us_day1[1])) {
                    date_totalp1_us_day1 = '00:00'
                }
                p1_us_day_array.push(date_totalp1_us_day1)
            }

            //-------- total p1_us_night flying hours --------//
            if (d.p1_us_night !== "") {
                var date_p1_us_night = d.p1_us_night.split(":")
                var date_total_p1_us_night = Number(date_p1_us_night[0] * 60) + Number(date_p1_us_night[1])
                date_totalp1_us_night += date_total_p1_us_night
                var date_p1_us_night_Hours = Math.floor(date_totalp1_us_night / 60);
                var date_p1_us_night_Min = date_totalp1_us_night % 60;
                if (date_p1_us_night_Hours < 10) {
                    date_p1_us_night_Hours = '0' + date_p1_us_night_Hours;
                }
                if (date_p1_us_night_Min < 10) {
                    date_p1_us_night_Min = '0' + date_p1_us_night_Min;
                }
                date_totalp1_us_night1 = date_p1_us_night_Hours + ":" + date_p1_us_night_Min;
                if (isNaN(date_totalp1_us_night1[1])) {
                    date_totalp1_us_night1 = '00:00'
                }
                p1_us_night_array.push(date_totalp1_us_night1)
            }

            //-------- total sic_day flying hours --------//
            if (d.sic_day !== "") {
                var date_sic_day = d.sic_day.split(":")
                var date_total_sic_day = Number(date_sic_day[0] * 60) + Number(date_sic_day[1])
                date_totalsic_day += date_total_sic_day
                var date_sic_day_Hours = Math.floor(date_totalsic_day / 60);
                var date_sic_day_Min = date_totalsic_day % 60;
                if (date_sic_day_Hours < 10) {
                    date_sic_day_Hours = '0' + date_sic_day_Hours;
                }
                if (date_sic_day_Min < 10) {
                    date_sic_day_Min = '0' + date_sic_day_Min;
                }
                date_totalsic_day1 = date_sic_day_Hours + ":" + date_sic_day_Min;
                if (isNaN(date_totalsic_day1[1])) {
                    date_totalsic_day1 = '00:00'
                }
                sicDay_array.push(date_totalsic_day1)
            }

            //-------- total sic_night flying hours --------//
            if (d.sic_night !== "") {
                var date_sic_night = d.sic_night.split(":")
                var date_total_sic_night = Number(date_sic_night[0] * 60) + Number(date_sic_night[1])
                date_totalsic_night += date_total_sic_night
                var date_sic_night_Hours = Math.floor(date_totalsic_night / 60);
                var date_sic_night_Min = date_totalsic_night % 60;
                if (date_sic_night_Hours < 10) {
                    date_sic_night_Hours = '0' + date_sic_night_Hours;
                }
                if (date_sic_night_Min < 10) {
                    date_sic_night_Min = '0' + date_sic_night_Min;
                }
                date_totalsic_night1 = date_sic_night_Hours + ":" + date_sic_night_Min;
                if (isNaN(date_totalsic_night1[1])) {
                    date_totalsic_night1 = '00:00'
                }
                sicNight_array.push(date_totalsic_night1)
            }


            //-------- total sim_instrument flying hours --------//
            if (d.sim_instrument !== "") {
                var date_sim_instrument = d.sim_instrument.split(":")
                var total_sim_instrument = Number(date_sim_instrument[0] * 60) + Number(date_sim_instrument[1])
                date_totalsim_instrument += total_sim_instrument
                var date_sim_instrument_Hours = Math.floor(date_totalsim_instrument / 60);
                var date_sim_instrument_Min = date_totalsim_instrument % 60;
                if (date_sim_instrument_Hours < 10) {
                    date_sim_instrument_Hours = '0' + date_sim_instrument_Hours;
                }
                if (date_sim_instrument_Min < 10) {
                    date_sim_instrument_Min = '0' + date_sim_instrument_Min;
                }
                date_totalsim_instrument1 = date_sim_instrument_Hours + ":" + date_sim_instrument_Min;
                if (isNaN(date_totalsim_instrument1[1])) {
                    date_totalsim_instrument1 = '00:00'
                }
                simInst_array.push(date_totalsim_instrument1)
            }


            //-------- total actual_Instrument flying hours --------//
            if (d.actual_Instrument !== "") {
                var date_actual_Instrument = d.actual_Instrument.split(":")
                var date_total_actual_Instrument = Number(date_actual_Instrument[0] * 60) + Number(date_actual_Instrument[1])
                date_totalactual_Instrument += date_total_actual_Instrument
                var date_actual_Instrument_Hours = Math.floor(date_totalactual_Instrument / 60);
                var date_actual_Instrument_Min = date_totalactual_Instrument % 60;
                if (date_actual_Instrument_Hours < 10) {
                    date_actual_Instrument_Hours = '0' + date_actual_Instrument_Hours;
                }
                if (date_actual_Instrument_Min < 10) {
                    date_actual_Instrument_Min = '0' + date_actual_Instrument_Min;
                }
                date_totalactual_Instrument1 = date_actual_Instrument_Hours + ":" + date_actual_Instrument_Min;
                if (isNaN(date_totalactual_Instrument1[1])) {
                    date_totalactual_Instrument1 = '00:00'
                }
                act_array.push(date_totalactual_Instrument1)
            }


            //-------- total instructional flying hours --------//
            if (d.instructional !== "") {
                var date_instructional = d.instructional.split(":")
                var date_total_instructional = Number(date_instructional[0] * 60) + Number(date_instructional[1])
                date_totalinstructional += date_total_instructional

                var date_instructional_Hours = Math.floor(date_totalinstructional / 60);
                var date_instructional_Min = date_totalinstructional % 60;
                if (date_instructional_Hours < 10) {
                    date_instructional_Hours = '0' + date_instructional_Hours;
                }
                if (date_instructional_Min < 10) {
                    date_instructional_Min = '0' + date_instructional_Min;
                }
                date_totalinstructional1 = date_instructional_Hours + ":" + date_instructional_Min;
                if (isNaN(date_totalinstructional1[0])) {
                    date_total_instructional = '00:00'
                }
                inst_array.push(date_totalinstructional1)
            }
        })

        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr">' + date_totalDualDay1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + date_totalDualNight1 + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + date_totalP1_ut_day1 + '</td>                <td class="s0" dir="ltr">' + date_totalsic_day1 + '</td>                <td class="s0" dir="ltr">' + date_totalp1_us_day1 + '</td>                <td class="s0" dir="ltr">' + date_totalPicDay1 + '</td>                <td class="s0" dir="ltr">' + date_totalP1_ut_night1 + '</td>                <td class="s0" dir="ltr">' + date_totalsic_night1 + '</td>                <td class="s0" dir="ltr">' + date_totalp1_us_night1 + '</td>                <td class="s0" dir="ltr">' + date_totalPicNight1 + '</td>                <td class="s0" dir="ltr">' + date_totalsim_instrument1 + '</td>                <td class="s0" dir="ltr">' + date_totalactual_Instrument1 + '</td>                <td class="s0" dir="ltr">' + date_totalinstructional1 + '</td>                <td class="s0" dir="ltr"></td>            </tr>                '
        htmlContent += '</body></html>'
        return htmlContent
    }

    const breakTag = () => {
        let htmlContent = '<html><body>'
        for (let i = 0; i < 27 - rows; i++) {
            htmlContent += '<span id=' + i + '><br><span>'
        }
        htmlContent += '</body></html>'
        return htmlContent

    }
    // ------- Logbook and Stl data html ------- //
    const logStlDataToPrint = () => {
        var platFormcss = Platform.OS === "ios" ? '.ritz .waffle .s0{padding:0px 13px;}' : '.ritz .waffle .s0{padding:3px 13px;}'
        let htmlContent = '<html><body>'
        Object.entries(monthWise).map((monthData, index) => {
            var pageNo = Number(page) + index
            htmlContent += '<style type="text/css"> @page { size:29.5cm 21cm; }table{"page-break-after: always;"} tr { page-break-inside:avoid; page-break-after:auto } .logbook:nth-child(even) {background-color: #e0ebeb;} .ritz .waffle a { color: inherit; }.ritz .waffle .s0{text-align:center;color:#000000;font-size:10pt;vertical-align:center;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr; } ' + platFormcss + ' th, td{ border: 2px #000 solid}</style><div class="ritz grid-container" dir="ltr"><table class="waffle" cellspacing="0" cellpadding="0" style="width:100%;">       <thead>             <tr style="height: 20px">                <th class="s0" dir="ltr" rowspan="3"><b>Date</b></th>                <th class="s0" dir="ltr" colspan="6"><b>AIRCRAFT</b></th>                <th class="s0" dir="ltr" rowspan="2" colspan="1"><b>PIC/INSTR</b></th>                <th class="s0" dir="ltr" rowspan="2" colspan="1"><b>P2 / PILOT U/T</b></th>                <th class="s0" dir="ltr" colspan="6"><b>ROUTE OF FLIGHT</b></th>                <th class="s0" dir="ltr" rowspan="2" colspan="2"><b>ATD</b></th>                <th class="s0" dir="ltr" rowspan="2" colspan="2"><b>ATA</b></th>                          </tr>            <tr style="height: 20px">                <th class="s0" dir="ltr" colspan="2">Type</th>                <th class="s0" dir="ltr" colspan="2">Engine</th>                <th class="s0" dir="ltr" colspan="2">Ac ID</th>                <th class="s0" dir="ltr" colspan="3">From</th>                <th class="s0" dir="ltr" colspan="3">To</th>            </tr>           <tr style="height: 20px">                <th class="s0" dir="ltr" colspan="2">1</th>                <th class="s0" dir="ltr" colspan="2">2</th>                <th class="s0" dir="ltr" colspan="2">3</th>                <th class="s0" dir="ltr" colspan="1">4</th>                <th class="s0" dir="ltr" colspan="1">5</th>                <th class="s0" dir="ltr" colspan="3">6</th>                <th class="s0" dir="ltr" colspan="3">7</th>                <th class="s0" dir="ltr" colspan="2">8</th>                <th class="s0" dir="ltr" colspan="2">9</th>                          </tr></thead><tbody>'
            monthData[1].map(d => {
                htmlContent += '            <tr style="height: 10px;" class="logbook">                <td class="s0" dir="ltr"><b>' + d.date.slice(0, 10) + '</b></td>                <td class="s0" dir="ltr" colspan="2">' + d.aircraftType + '</td>                <td class="s0" dir="ltr" colspan="2"></td>                <td class="s0" dir="ltr" colspan="2">' + d.aircraftReg + '</td>                <td class="s0" dir="ltr" colspan="1">' + d.p1 + '</td>                <td class="s0" dir="ltr" colspan="1">' + d.p2 + '</td>                <td class="s0" dir="ltr" colspan="3">' + d.from + '</td>                <td class="s0" dir="ltr" colspan="3">' + d.to + '</td>                <td class="s0" dir="ltr" colspan="2">' + d.chocksOffTime + '</td>                <td class="s0" dir="ltr" colspan="2">' + d.chocksOnTime + '</td>                          </tr>'
            })
            for (let i = 0; i < rows - monthData[1].length; i++) {
                htmlContent += '<tr class="logbook" style="height: 20px" id=' + [i] + '>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr" colspan="2"></td>                <td class="s0" dir="ltr" colspan="2"></td>                <td class="s0" dir="ltr" colspan="2"></td>                <td class="s0" dir="ltr" colspan="1"></td>                <td class="s0" dir="ltr" colspan="1"></td>                <td class="s0" dir="ltr" colspan="3"></td>                <td class="s0" dir="ltr" colspan="3"></td>                <td class="s0" dir="ltr" colspan="2"></td>                <td class="s0" dir="ltr" colspan="2"></td>                          </tr>'
            }
            htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr" colspan="15" rowspan="3"style=text-align:left>I certify that the entries in this log are true <br /><br/>  <b>PILOT"S NAME</b>:&nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <b>PILOT SIGNATURE </b>:....................</td>                <td class="s0" dir="ltr" colspan="3">Total This Page</td>                          </tr><tr style="height: 20px"> <td class="s0" dir="ltr" colspan="3">AMT Forwarded</td> </tr><tr style="height: 20px"> <td class="s0" dir="ltr" colspan="3">Total To Date</td> </tr>            </tbody>' + breakTag() + '</table><p>Page' + pageNo + '-A(AutoFlightLog)</p><table class="waffle" cellspacing="0" cellpadding="0"> ' + breakTag() + '  <thead>            <tr style="height: 20px">                <th class="s0" dir="ltr" colspan="4"><b>SINGLE ENGINE AIRCRAFT</b></th>                <th class="s0" dir="ltr" colspan="8"><b>MULTIPLE ENGINE AIRCRAFT / HELICOPTER</b></th>                <th class="s0" dir="ltr" colspan="2" rowspan="2"><b>INSTRUMENT Flying</b></th>                <th class="s0" dir="ltr" rowspan="3"><b>Instructional Flying</b></th>                <th class="s0" dir="ltr" rowspan="3"><b>Remark</b></th>            </tr>            <tr style="height: 20px">                <th class="s0" dir="ltr" colspan="2">Day</th>                <th class="s0" dir="ltr" colspan="2">Night</th>                <th class="s0" dir="ltr" colspan="4">Day</th>                <th class="s0" dir="ltr" colspan="4">Night</td></tr>            <tr style="height: 20px">                <th class="s0" dir="ltr">Dual</th>                <th class="s0" dir="ltr">Solo</th>                <th class="s0" dir="ltr">Dual</th>                <th class="s0" dir="ltr">Solo</th>                <th class="s0" dir="ltr">U/T</th>                <th class="s0" dir="ltr">Co-Pilot</th>                <th class="s0" dir="ltr">PI (US)</th>                <th class="s0" dir="ltr">PIC</th>                <th class="s0" dir="ltr">U/T</th>                <th class="s0" dir="ltr">Co-Pilot</th>                <th class="s0" dir="ltr">PI (US)</th>                <th class="s0" dir="ltr">PIC</th>                <th class="s0" dir="ltr">Simulated</th>                <th class="s0" dir="ltr">Actual</th>            </tr></thead><tbody> '
            monthData[1].map(d => {
                htmlContent += '<tr style="height: 20px;" class="logbook">                <td class="s0" dir="ltr">' + d.dual_day + '</td>                <td class="s0" dir="ltr">-</td>               <td class="s0" dir="ltr">' + d.dual_night + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + d.p1_ut_day + '</td>                <td class="s0" dir="ltr">' + d.sic_day + '</td>                <td class="s0" dir="ltr">' + d.p1_us_day + '</td>                <td class="s0" dir="ltr">' + d.day + '</td>                <td class="s0" dir="ltr">' + d.p1_ut_night + '</td>                <td class="s0" dir="ltr">' + d.sic_night + '</td>                <td class="s0" dir="ltr">' + d.p1_us_night + '</td>                <td class="s0" dir="ltr">' + d.night + '</td>                <td class="s0" dir="ltr">' + d.sim_instrument + '</td>                <td class="s0" dir="ltr">' + d.actual_Instrument + '</td>                <td class="s0" dir="ltr">' + d.instructional + '</td>                <td class="s0" dir="ltr">' + d.remark + '</td>            </tr>'

            })
            for (let i = 0; i < rows - monthData[1].length; i++) {
                htmlContent += '<tr class="logbook" style="height: 20px" id=' + [i] + '>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>'
            } htmlContent += totalCalculation(monthData) + '' + prevDataCalculation(monthData) + '' + totalDateCalculation(monthData) + '</tbody>    </table><p>Page' + pageNo + '-A(AutoFlightLog)</p></div>'

        }).join(' ')
        htmlContent += '</body></html>'
        return htmlContent
    }

    // ---------- Simulated data To Print --------- //
    var totalStl = 0;
    var totalStlTime = '';

    const simDataToPrint = () => {
        var PF = 0;
        var PM = 0;
        var pf_pm_total = ''
        let htmlContent = '<html><body>'
        htmlContent += '<style type="text/css"> @page { size: 29.7cm 21cm; }table{"page-break-after: always;"} tr:nth-child(even) {background-color: #e0ebeb;} .ritz .waffle a { color: inherit; }.ritz .waffle .s0{text-align:center;color:#000000;font-size:10pt;vertical-align:center;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;padding:6px 13px;} th ,td{ border: 1px #000 solid}</style><div class="ritz grid-container" dir="ltr"> <table class="waffle" cellspacing="0" cellpadding="0" style="width:100%">       <thead>            <tr style="height: 20px" >                                <th class="s0" dir="ltr" colspan="5"><b>RECORD OF FLIGHT SIMULATOR  TRAINING AND PRACTICES </b></th>                </tr>                <tr style="height: 20px">                <th class="s0" dir="ltr">Date</th>                <th class="s0" dir="ltr">Type Of Simulator</th>                <th class="s0" dir="ltr">Nature of Test Examination of Practices</th>                <th class="s0" dir="ltr">Time</th>                <th class="s0" dir="ltr">Remarks/Certification</th>                </tr></head> <tbody>'
        htmlContent += data.map((d) => {
            // --------- Pf And Pm Total -------- //
            var pfTime = d.pf_time.split(":")
            var pmTime = d.pm_time.split(":")
            var total_pf = Number(pfTime[0] * 60) + Number(pfTime[1])
            var total_pm = Number(pmTime[0] * 60) + Number(pmTime[1])
            PF += total_pf
            PM += total_pm
            var total_pF_pm = PF + PM
            var PfPM_Hours = Math.floor(total_pF_pm / 60);
            var PfPm_Min = total_pF_pm % 60;
            if (PfPM_Hours < 10) {
                PfPM_Hours = '0' + PfPM_Hours;
            }
            if (PfPm_Min < 10) {
                PfPm_Min = '0' + PfPm_Min;
            }
            pf_pm_total = PfPM_Hours + ":" + PfPm_Min;
            if (isNaN(pf_pm_total[1])) {
                pf_pm_total[1] = '00:00';
            }
            // picDay_array.push(date_totalPicDay1)


            // ------- page total of stl data ------- //
            var pf_pm_totalTime = pf_pm_total.split(":");
            var splitedStl = Number(pf_pm_totalTime[0] * 60) + Number(pf_pm_totalTime[1])
            totalStl += splitedStl
            var totalStl_Hours = Math.floor(totalStl / 60);
            var totalStl_Min = totalStl % 60;
            if (totalStl_Hours < 10) {
                totalStl_Hours = '0' + PfPM_Hours;
            }
            if (totalStl_Min < 10) {
                totalStl_Min = '0' + totalStl_Min;
            }
            totalStlTime = totalStl_Hours + ":" + totalStl_Min;
            if (isNaN(totalStlTime[1])) {
                totalStlTime[1] = '00:00';
            }

            return '<tr style="height: 20px">                <td class="s0" dir="ltr">' + d.date.slice(0, 10) + '</td>                <td class="s0" dir="ltr">' + d.aircraftType + '</td>                <td class="s0" dir="ltr">' + d.sim_exercise + '</td>                <td class="s0" dir="ltr" style="width:15%"> PF: ' + d.pf_time + ' <br /> PM: ' + d.pm_time + '  <br /> Total: ' + pf_pm_total + ' </td>                <td class="s0" dir="ltr"></td>                </tr>'
        }).join(' ')
        for (let i = 0; i < 10 - data.length; i++) {
            htmlContent += '<tr style="height: 55px" id=' + [i] + '>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr" style="width:15%"></td>                <td class="s0" dir="ltr"></td>                </tr>'
        }
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr" colspan="3">Total Time</td>                <td class="s0" dir="ltr">' + totalStlTime + '</td>                <td class="s0" dir="ltr"></td>                </tr>                 </tbody>                </table>        </div>'

        htmlContent += '</body></html>'
        return htmlContent
    }

    // ------- print dat as pdf  ------- //
    const printPDF = async () => {
        if (data !== null) {
            const beforeTable =
                '<p style="text-align:center;">Flying experience for period from <strong>' +
                fromPeriod +
                '</strong> to <strong>' +
                toPeriod +
                '</strong> (Preceding 5 years/preceding 6 months/preceding 18 months) <br>Name of Licence Holder: <strong>' +
                licenseHolderName +
                '</strong> Licence Name: Licence Number: Valid upto</p>Aircrafts flown :<br><br>';

            if (logOption == 'Logbook') {

                var results = await RNHTMLtoPDF.convert({
                    width: 842,
                    height: 595,
                    html: logStlDataToPrint(),
                    fileName: 'logbook',
                    directory: 'Documents',
                    base64: true,
                });
            }
            else if (logOption == "Stl") {
                var results = await RNHTMLtoPDF.convert({
                    width: 842,
                    height: 595,
                    html: logStlDataToPrint(),
                    fileName: 'stl',
                    directory: 'Documents',
                    base64: true,
                });
            }
            else if (logOption == 'Sim') {
                var results = await RNHTMLtoPDF.convert({
                    width: 845,
                    height: 547,
                    html: simDataToPrint(),
                    fileName: 'simulated',
                    directory: 'Documents',
                    base64: true,
                });
            }
            navigation.navigate('ShowPDF', {
                filepath: results.filePath,
                base64: results.base64,
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
                    <Text style={DgcaLogbookStyles.aircrafts}>DGCA Logbook</Text>
                </View>

                <View style={dark ? DgcaLogbookStyles.DarkmainTagLine : DgcaLogbookStyles.mainTagLine}>
                    <Text style={dark ? DgcaLogbookStyles.DarktagLine : DgcaLogbookStyles.tagLine}>Logbook Option</Text>
                </View>

                <RadioButton.Group
                    onValueChange={logOption => setLogOption(logOption)} value={logOption}>
                    <View style={DgcaLogbookStyles.radioSection}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color='#256173'
                                    value="Logbook" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Logbook</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 100 }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color='#256173'
                                    value="Sim" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Sim</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton.Android
                                uncheckedColor={dark ? '#fff' : '#000'}
                                color='#256173'
                                value="Stl" />
                            <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Stl</Text>
                        </View>
                    </View>
                </RadioButton.Group>

                <View style={dark ? DgcaLogbookStyles.DarkmainTagLine : DgcaLogbookStyles.mainTagLine}>
                    <Text style={dark ? DgcaLogbookStyles.DarktagLine : DgcaLogbookStyles.tagLine}>Period</Text>
                </View>

                <RadioButton.Group
                    onValueChange={period => setPeriod(period)} value={period}>
                    <View style={DgcaLogbookStyles.radioSection}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color='#256173'
                                    value="preDefined" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Pre Defined</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 100 }}>
                                <RadioButton.Android
                                    uncheckedColor={dark ? '#fff' : '#000'}
                                    color='#256173'
                                    value="calenderDate" />
                                <Text style={dark ? DgcaLogbookStyles.DarkradioText : DgcaLogbookStyles.radioText}>Calender Date</Text>
                            </View>
                        </View>
                    </View>
                </RadioButton.Group>

                <View style={Platform.OS === 'ios' ? { paddingHorizontal: 10, paddingVertical: 20, zIndex: 888 } : { paddingHorizontal: 10, paddingVertical: 20, }}>
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
                                    backgroundColor: ' #000',

                                }]}
                                textStyle={{
                                    fontSize: 14,
                                    color: "#266173",
                                }}
                                dropDownContainerStyle={{
                                    borderColor: "#266173",
                                    backgroundColor: dark ? "#000" : "#fff",
                                    zIndex: 999,
                                }}
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
                <View style={dark ? DgcaLogbookStyles.DarkmainTagLine : DgcaLogbookStyles.mainTagLine}>
                    <Text style={dark ? DgcaLogbookStyles.DarktagLine : DgcaLogbookStyles.tagLine}>Page details</Text>
                </View>
                {logOption == "Sim" ? <></> :
                    <>
                        <View style={dark ? DgcaLogbookStyles.DarkmainTagLine : DgcaLogbookStyles.mainTagLine}>
                            <Text style={dark ? DgcaLogbookStyles.DarkpageDetailText : DgcaLogbookStyles.pageDetailText}>Number of Rows</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <View style={dark ? DgcaLogbookStyles.DarkTextInputView : DgcaLogbookStyles.TextInputView}>
                                <TextInput
                                    placeholder='Min. 10 - max. 25'
                                    placeholderTextColor='grey'
                                    keyboardType='numeric'
                                    value={rows}
                                    onChangeText={(text) => setRows(text)}
                                    max={2}
                                    style={dark ? { color: '#fff', padding: 10 } : { padding: 10 }}
                                />

                            </View>
                        </View>
                    </>
                }

                {rows < 10 ? <Text style={{ color: 'red', paddingLeft: 12 }}>Minimum number  of rows is 10</Text> : null}
                {rows > 25 ? <Text style={{ color: 'red', paddingLeft: 12 }}>Maximum number  of rows is 25</Text> : null}


                <View style={DgcaLogbookStyles.mainTagLine}>
                    <Text style={dark ? DgcaLogbookStyles.DarkpageDetailText : DgcaLogbookStyles.pageDetailText}>Start page number</Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={dark ? DgcaLogbookStyles.DarkTextInputView : DgcaLogbookStyles.TextInputView}>
                        <TextInput
                            placeholder='Enter Number'
                            placeholderTextColor='grey'
                            value={page}
                            onChangeText={(text) => setPage(text)}
                            max={2}
                            style={dark ? { color: '#fff', padding: 10 } : { padding: 10 }}
                        />
                    </View>
                </View>

                <View style={DgcaLogbookStyles.footer}>
                    <TouchableOpacity onPress={() => { validate(); }}>
                        <View style={DgcaLogbookStyles.button}>
                            <Text style={DgcaLogbookStyles.buttonText}>View/Download</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default DgcaLogBook;