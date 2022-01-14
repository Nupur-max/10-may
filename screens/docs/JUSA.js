//import liraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import DgcaLogbookStyles from '../../styles/dgcaLogbookStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton, ThemeProvider } from 'react-native-paper'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfYear,
    endOfYear,
    addYears
} from 'date-fns';
import SQLite from 'react-native-sqlite-storage';
import { ThemeContext } from '../../theme-context';


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
const JUSA = ({ navigation }) => {

    const [period, setPeriod] = useState('preDefined')
    const [fromPeriod, setfromPeriod] = useState('');
    const [toPeriod, settoPeriod] = useState('');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [licenseHolderName, setlicenseHolderName] = useState('Nupur');
    const [data, setData] = useState(null)
    const [orderStart, setOrderStart] = React.useState('')
    const [orderEnd, setOrderEnd] = React.useState('')
    const [rows, setRows] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [monthWise, setMonthWise] = React.useState([]);
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



    //-------------  Get Data from database ------------//
    const getLogbookData = async () => {
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let temData = [];
        var ordered = {};
        prePopulateddb.transaction(tx => {
            tx.executeSql('Select * from logbook INNER JOIN Aircrafts on Aircrafts.AircraftType = logbook.aircraftType WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag == "manual" ORDER BY orderedDate ASC', [], (tx, result) => {
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
                        AircraftType: result.rows.item(i).AircraftType,
                        aircraft_id: result.rows.item(i).aircraft_id,
                        Category: result.rows.item(i).Category,
                        Engine: result.rows.item(i).Engine,
                        Class: result.rows.item(i).Class,
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


    //-------- Total calculation of left page data --------//
    const totalForLeft = (monthData) => {
        var total_time = 0;
        var total_dayLanding = 0
        var total_nightLanding = 0
        var Final_SEL_time = '';
        var Final_SES_time = '';
        var Final_MEL_time = '';
        var Final_MES_time = '';
        var Final_Total_Dur = '';
        var Final_Gli_time = '';
        var Final_Hel_time = '';
        var Final_Jet_time = '';
        var Final_day_landing = '';
        var Final_night_landing = '';

        monthData[1].map(d => {
            //-------- total_Time flying hours --------//
            var Day = d.totalTime.split(":")
            var total_time1 = Number(Day[0] * 60) + Number(Day[1])
            total_time += total_time1
            var total_time_Hours = Math.floor(total_time / 60);
            var total_time_Min = total_time % 60;
            if (total_time_Hours < 10) {
                total_time_Hours = '0' + total_time_Hours;
            }
            if (total_time_Min < 10) {
                total_time_Min = '0' + total_time_Min;
            }
            Final_Total_Dur = total_time_Hours + ":" + total_time_Min;

            if (d.Class == 'SE Land') {
                Final_SEL_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Class == 'ME Land') {
                Final_MEL_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Class == 'SE Sea') {
                Final_SES_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Class == 'ME Sea') {
                Final_MES_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Engine == 'Jet') {
                Final_Jet_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Engine == 'Helicopter') {
                Final_Hel_time = total_time_Hours + ":" + total_time_Min;
            }
            if (d.Engine == 'glider') {
                Final_Gli_time = total_time_Hours + ":" + total_time_Min;
            }

            //-------- total Day Landings --------//
            var dayLanding = +d.dayLanding
            total_dayLanding += dayLanding
            Final_day_landing = total_dayLanding

            //-------- total Night Landings --------//
            var nightLanding = +d.nightLanding
            total_nightLanding += nightLanding
            Final_night_landing = total_nightLanding

            // 
        })
        let htmlContent = '<html><body>'

        htmlContent += '<tr style="height: 30px">                <td class="s0" dir="ltr" colspan="2" style="border-bottom:none;"></td>                <td class="s0" dir="ltr" colspan="3"><b>Total</b></td>                <td class="s0" dir="ltr">' + Final_Total_Dur + '</td>                <td class="s0" dir="ltr">' + Final_SEL_time + '</td>                <td class="s0" dir="ltr">' + Final_SES_time + '</td>                <td class="s0" dir="ltr">' + Final_MEL_time + '</td>                <td class="s0" dir="ltr">' + Final_MES_time + '</td>                <td class="s0" dir="ltr">' + Final_Jet_time + '</td>                <td class="s0" dir="ltr">' + Final_Hel_time + '</td>                <td class="s0" dir="ltr">' + Final_Gli_time + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + Final_day_landing + '</td>                <td class="s0" dir="ltr">' + Final_night_landing + '</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total AMT Forwarded calculation of left Page data --------//

    const amtForwardLeft = () => {
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 30px">                <td class="s0" dir="ltr" style="border-bottom:none; border-top:none" colspan="2"></td>                <td class="s0" dir="ltr" colspan="3"><b>AMT. FORWARDED</b></td><td class="s0" dir="ltr">' + totalTime_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + sel_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + ses_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + mel_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + mes_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + jet_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + hel_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + gli_array.splice(-1) + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + dayl_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + nightl_array.splice(-1) + '</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total Date calculation of left Page data --------//
    var date_total_time = 0;
    var date_total_dayLanding = 0;
    var date_total_nightLanding = 0;
    var date_Final_SEL_time = '';
    var date_Final_SES_time = '';
    var date_Final_MEL_time = '';
    var date_Final_MES_time = '';
    var date_Final_Total_Dur = '';
    var date_Final_Gli_time = '';
    var date_Final_Hel_time = '';
    var date_Final_Jet_time = '';
    var date_Final_day_landing = '';
    var date_Final_night_landing = '';

    var sel_array = ["00:00",]
    var mel_array = ["00:00",]
    var ses_array = ["00:00",]
    var mes_array = ["00:00",]
    var jet_array = ["00:00",]
    var hel_array = ["00:00",]
    var gli_array = ["00:00",]
    var dayl_array = ["0",]
    var nightl_array = ["0",]
    var totalTime_array = ["00:00",]

    const dateTotalLeft = (monthData) => {
        monthData[1].map(d => {
            //-------- total_Time flying hours --------//
            var Day = d.totalTime.split(":")
            var total_time1 = Number(Day[0] * 60) + Number(Day[1])
            date_total_time += total_time1
            var date_total_time_Hours = Math.floor(date_total_time / 60);
            var date_total_time_Min = date_total_time % 60;
            if (date_total_time_Hours < 10) {
                date_total_time_Hours = '0' + date_total_time_Hours;
            }
            if (date_total_time_Min < 10) {
                date_total_time_Min = '0' + date_total_time_Min;
            }
            date_Final_Total_Dur = date_total_time_Hours + ":" + date_total_time_Min;
            totalTime_array.push(date_Final_Total_Dur);

            if (d.Class == 'SE Land') {
                date_Final_SEL_time = date_Final_Total_Dur;
                sel_array.push(date_Final_SEL_time)
            }
            if (d.Class == 'ME Land') {
                date_Final_MEL_time = date_Final_Total_Dur;
                mel_array.push(date_Final_MEL_time)
            }
            if (d.Class == 'SE Sea') {
                date_Final_SES_time = date_Final_Total_Dur;
                ses_array.push(date_Final_SES_time)
            }
            if (d.Class == 'ME Sea') {
                date_Final_MES_time = date_Final_Total_Dur;
                mes_array.push(date_Final_MES_time)
            }
            if (d.Engine == 'Jet') {
                date_Final_Jet_time = date_Final_Total_Dur;
                jet_array.push(date_Final_Jet_time)
            }
            if (d.Engine == 'Helicopter') {
                date_Final_Hel_time = date_Final_Total_Dur;
                hel_array.push(date_Final_Hel_time)
            }
            if (d.Engine == 'glider') {
                date_Final_Gli_time = date_Final_Total_Dur;
                gli_array.push(date_Final_Gli_time)
            }

            //-------- total Day Landings --------//
            var date_dayLanding = +d.dayLanding
            date_total_dayLanding += date_dayLanding
            date_Final_day_landing = date_total_dayLanding
            dayl_array.push(date_Final_day_landing)

            //-------- total Night Landings --------//
            var date_nightLanding = +d.nightLanding
            date_total_nightLanding += date_nightLanding
            date_Final_night_landing = date_total_nightLanding
            nightl_array.push(date_Final_night_landing)

        })
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 30px">                <td class="s0" dir="ltr" colspan="2" style="border-top:none;"></td>                <td class="s0" dir="ltr" colspan="3"><b>TOTALS TO DATE</b></td>                <td class="s0" dir="ltr">' + date_Final_Total_Dur + '</td>                <td class="s0" dir="ltr">' + date_Final_SEL_time + '</td>                <td class="s0" dir="ltr">' + date_Final_SES_time + '</td>                <td class="s0" dir="ltr">' + date_Final_MEL_time + '</td>                <td class="s0" dir="ltr">' + date_Final_MES_time + '</td>                <td class="s0" dir="ltr">' + date_Final_Jet_time + '</td>                <td class="s0" dir="ltr">' + date_Final_Hel_time + '</td>                <td class="s0" dir="ltr">' + date_Final_Gli_time + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + date_Final_day_landing + '</td>                <td class="s0" dir="ltr">' + date_Final_night_landing + '</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total calculation of Right page data   --------//
    var totalNight_array = ["00:00",]
    var totalSIC_array = ["00:00",]
    var totalPIC_array = ["00:00",]
    var totalactual_array = ["00:00",]
    var totalsimu_array = ["00:00",]

    const totalForRight = (monthData) => {
        var totalNight = 0
        var totalactual_Instrument = 0
        var totalsim_instrument = 0;
        var totalFinalTime = 0
        var Final_Night_Time = ''
        var Final_PIC_Time = ''
        var Final_SIC_Time = ''
        var Total_Time = ''
        var totalactual_Instrument1 = ''
        var totalsim_instrument1 = '';


        monthData[1].map(d => {
            //--------  nightTime flying hours --------//
            var Night = d.night.split(":")
            var total_Nighttime = Number(Night[0] * 60) + Number(Night[1])
            totalNight += total_Nighttime
            var total_Night_Hours = Math.floor(totalNight / 60);
            var total_Night_Min = totalNight % 60;
            if (total_Night_Hours < 10) {
                total_Night_Hours = '0' + total_Night_Hours;
            }
            if (total_Night_Min < 10) {
                total_Night_Min = '0' + total_Night_Min;
            }
            Final_Night_Time = total_Night_Hours + ":" + total_Night_Min;
            if (isNaN(Final_Night_Time[1])) {
                Final_Night_Time = '00:00'
            }
            totalNight_array.push(Final_Night_Time)

            //--------  total_Time flying hours --------//
            var TotalTime = d.totalTime.split(":")
            var total_time = Number(TotalTime[0] * 60) + Number(TotalTime[1])
            totalFinalTime += total_time
            var total_Hours = Math.floor(totalFinalTime / 60);
            var total_Min = totalFinalTime % 60;
            if (total_Hours < 10) {
                total_Hours = '0' + total_Hours;
            }
            if (total_Min < 10) {
                total_Min = '0' + total_Min;
            }
            Total_Time = total_Hours + ":" + total_Min;

            if (d.p1 == 'Self') {
                Final_PIC_Time = Total_Time
                totalPIC_array.push(Final_PIC_Time)

            }
            if (d.p2 == 'Self') {
                Final_SIC_Time = Total_Time
                totalSIC_array.push(Final_SIC_Time)

            }

            //-------- act_instrument flying hours -------- //
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
            totalactual_array.push(totalactual_Instrument1)
            //-------- sim_instrument flying hours --------//
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
            totalsimu_array.push(totalsim_instrument1)


        })
        let htmlContent = '<html><body>'

        htmlContent += ' <tr style="height: 30px">                <td class="s0" dir="ltr">' + Final_Night_Time + '</td>                <td class="s0" dir="ltr">' + totalactual_Instrument1 + '</td>                <td class="s0" dir="ltr">' + totalsim_instrument1 + '</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">' + Final_PIC_Time + '</td>                <td class="s0" dir="ltr">' + Final_SIC_Time + '</td>                <td class="s0" dir="ltr">0:00</td>      <td class="s0" dir="ltr">0:00</td>                <td style="padding:2px 0px 2px 3px; height: 20px" rowspan="3" >I certifiy that the all entries are true <br>-------------- <br> Pilot\'s Signature</td></tr>        '
        htmlContent += '</body></html>'
        return htmlContent
    }


    //------- total calculation of amtForward Right Page data  --------//

    const amtForwardRight = () => {
        let htmlContent = '<html><body>'
        htmlContent += ' <tr style="height: 30px">                <td class="s0" dir="ltr">' + totalNight_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + totalsimu_array.splice(-1) + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalPIC_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + totalSIC_array.splice(-1) + '</td>                <td class="s0" dir="ltr"></td>      <td class="s0" dir="ltr">0:00</td></tr>        '
        htmlContent += '</body></html>'
        return htmlContent
    }


    //------- total calculation of  total to Date Right Page data  --------//
    var datetotalNight = 0
    var datetotalactual_Instrument = 0
    var datetotalsim_instrument = 0;
    var datetotalFinalTime = 0
    var dateFinal_Night_Time = 0
    var dateFinal_PIC_Time = 0
    var dateFinal_SIC_Time = 0
    var dateTotal_Time = 0
    var datetotalactual_Instrument1 = 0
    var datetotalsim_instrument1 = 0;

    const dateTotalRight = (monthData) => {
        let htmlContent = '<html><body>'
        monthData[1].map(d => {
            //-------- night flying hours --------//
            var Night = d.night.split(":")
            var total_Nighttime = Number(Night[0] * 60) + Number(Night[1])
            datetotalNight += total_Nighttime
            var total_Night_Hours = Math.floor(datetotalNight / 60);
            var total_Night_Min = datetotalNight % 60;
            if (total_Night_Hours < 10) {
                total_Night_Hours = '0' + total_Night_Hours;
            }
            if (total_Night_Min < 10) {
                total_Night_Min = '0' + total_Night_Min;
            }
            dateFinal_Night_Time = total_Night_Hours + ":" + total_Night_Min;
            if (isNaN(dateFinal_Night_Time[1])) {
                dateFinal_Night_Time = '00:00'
            }

            //--------  totaltime flying hours --------//
            var TotalTime = d.totalTime.split(":")
            var datetotal_Time = Number(TotalTime[0] * 60) + Number(TotalTime[1])
            datetotalFinalTime += datetotal_Time
            var total_Hours = Math.floor(datetotalFinalTime / 60);
            var total_Min = datetotalFinalTime % 60;
            if (total_Hours < 10) {
                total_Hours = '0' + total_Hours;
            }
            if (total_Min < 10) {
                total_Min = '0' + total_Min;
            }
            dateTotal_Time = total_Hours + ":" + total_Min;

            dateFinal_PIC_Time = d.p1 == 'Self' ? dateTotal_Time : '-';
            dateFinal_SIC_Time = d.p2 == 'Self' ? dateTotal_Time : '-';

            //--------act_instrument flying hours --------//
            var actual_Instrument = d.actual_Instrument.split(":")
            var total_actual_Instrument = Number(actual_Instrument[0] * 60) + Number(actual_Instrument[1])
            datetotalactual_Instrument += total_actual_Instrument
            var actual_Instrument_Hours = Math.floor(datetotalactual_Instrument / 60);
            var actual_Instrument_Min = datetotalactual_Instrument % 60;
            if (actual_Instrument_Hours < 10) {
                actual_Instrument_Hours = '0' + actual_Instrument_Hours;
            }
            if (actual_Instrument_Min < 10) {
                actual_Instrument_Min = '0' + actual_Instrument_Min;
            }
            datetotalactual_Instrument1 = actual_Instrument_Hours + ":" + actual_Instrument_Min;
            if (isNaN(datetotalactual_Instrument1[1])) {
                datetotalactual_Instrument1 = '00:00'
            }
            //------- sim_instrument flying hours --------//
            var sim_instrument = d.sim_instrument.split(":")
            var total_sim_instrument = Number(sim_instrument[0] * 60) + Number(sim_instrument[1])
            datetotalsim_instrument += total_sim_instrument
            var sim_instrument_Hours = Math.floor(datetotalsim_instrument / 60);
            var sim_instrument_Min = datetotalsim_instrument % 60;
            if (sim_instrument_Hours < 10) {
                sim_instrument_Hours = '0' + sim_instrument_Hours;
            }
            if (sim_instrument_Min < 10) {
                sim_instrument_Min = '0' + sim_instrument_Min;
            }
            datetotalsim_instrument1 = sim_instrument_Hours + ":" + sim_instrument_Min;
            if (isNaN(datetotalsim_instrument1)) {
                datetotalsim_instrument1 = '00:00'
            }
        })

        htmlContent += '<tr style="height: 30px">                <td class="s0" dir="ltr">' + dateFinal_Night_Time + '</td>                <td class="s0" dir="ltr">' + datetotalactual_Instrument1 + '</td>                <td class="s0" dir="ltr">' + datetotalsim_instrument1 + '</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">' + dateFinal_PIC_Time + '</td>                <td class="s0" dir="ltr">' + dateFinal_SIC_Time + '</td>                <td class="s0" dir="ltr">0:00</td>      <td class="s0" dir="ltr">0:00</td>                </tr>    '
        htmlContent += '</body></html>'
        return htmlContent
    }

    //----------- For braeking Pages of pdf -----------//
    const breakTag = () => {
        let htmlContent = '<html><body>'
        for (let i = 0; i < 25 - rows; i++) {
            htmlContent += '<span id=' + i + '><br><span>'
        }
        htmlContent += '</body></html>'
        return htmlContent

    }

    //----- combined all function to Show in pdf -----//
    const dataRes = () => {
        var platFormCss = Platform.OS === "ios" ? '.ritz .waffle .s0{padding:5px 13px}' : '.ritz .waffle .s0{padding:3px 13px}'
        let htmlContent = '<html><body>'
        Object.entries(monthWise).map((monthData, index) => {
            var pageNo = Number(page) + index
            htmlContent += '<style type="text/css"> @page { size:29.5cm 21cm; }table{"page-break-after: always;"} tr { page-break-inside:avoid !important; page-break-after:auto } .j_usa:nth-child(even) {background-color: #e0ebeb;} .ritz .waffle a { color: inherit; }.ritz .waffle .s0{text-align:center;color:#000000;font-size:10pt;vertical-align:center;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;} ' + platFormCss + ' th, td{ border: 2px #000 solid}</style><div class="ritz grid-container" dir="ltr"> <table class="waffle" cellspacing="0" cellpadding="0" style=" width:100%;">   <thead>    <tr style="height: 30px">    <th class="s0" dir="ltr" rowspan="3" style="padding:0px 50px;"><b>Date</b></th>    <th class="s0" dir="ltr" rowspan="3"><b>AIRCRAFT MAKE AND MODEL</b></th>    <th class="s0" dir="ltr" rowspan="3"><b>AIRCRAFTIDENT</b></th>    <th class="s0" dir="ltr" colspan="2"><b>ROUTE</b></th>    <th class="s0" dir="ltr" rowspan="3"><b>TOTAL DUR OF FLIGHT</b></th>    <th class="s0" dir="ltr" colspan="8" ><b>AIRCRAFT CATEGORY AND CLASS</b></th>    <th class="s0" dir="ltr" colspan="2"><b>LNDGS</b></th></tr><tr style="height: 30px">    <th class="s0" dir="ltr" rowspan="2">FROM</th>    <th class="s0" dir="ltr" rowspan="2">TO</th>    <th class="s0" dir="ltr" rowspan="2">AIRPLANE SE-LAND</th>    <th class="s0" dir="ltr" rowspan="2">AIRPLANE SE-SEA</th>    <th class="s0" dir="ltr" rowspan="2">AIRPLANE ME-LAND</th>    <th class="s0" dir="ltr" rowspan="2">AIRPLANE ME-SEA</th>    <th class="s0" dir="ltr" rowspan="2">JET</th>    <th class="s0" dir="ltr" rowspan="2">ROTORCRAFT HELICOPTER</th>    <th class="s0" dir="ltr" rowspan="2">GLIDER</th>    <th class="s0" dir="ltr" rowspan="2">PCATD</th>    <th class="s0" dir="ltr" rowspan="2">Day</th>    <th class="s0" dir="ltr" rowspan="2">NIGHT</th></tr><tr></tr> </thead><tbody>'
            monthData[1].map(d => {
                var SELand = d.Class == 'SE Land' ? d.totalTime : '';
                var SEsea = d.Class == 'SE Sea' ? d.totalTime : '';
                var MELand = d.Class == 'ME Land' ? d.totalTime : '';
                var MEsea = d.Class == 'ME Sea' ? d.totalTime : '';
                var Jet = d.Engine == 'Jet' ? d.totalTime : '';
                var Helicopter = d.Category == 'Helicopter' ? d.totalTime : ''
                var Glider = d.Category == 'glider' ? d.totalTime : ''
                htmlContent += '<tr style="height: 30px" class="j_usa">                <td class="s0" dir="ltr">' + d.date + '</td>                <td class="s0" dir="ltr">' + d.aircraftType + '</td>                <td class="s0" dir="ltr">' + d.aircraftReg + '</td>                <td class="s0" dir="ltr">' + d.from + '</td>                <td class="s0" dir="ltr">' + d.to + '</td>                <td class="s0" dir="ltr">' + d.totalTime + '</td>                <td class="s0" dir="ltr">' + SELand + '</td>                <td class="s0" dir="ltr">' + SEsea + '</td>                <td class="s0" dir="ltr">' + MELand + '</td>                <td class="s0" dir="ltr">' + MEsea + '</td>                <td class="s0" dir="ltr">' + Jet + '</td>                <td class="s0" dir="ltr">' + Helicopter + '</td>                <td class="s0" dir="ltr">' + Glider + '</td>                <td class="s0" dir="ltr">Pcatd</td>                <td class="s0" dir="ltr">' + d.dayLanding + '</td>                <td class="s0" dir="ltr">' + d.nightLanding + '</td></tr> '
            })
            for (let i = 0; i < rows - monthData[1].length; i++) {
                htmlContent += '<tr style="height: 30px" class="j_usa">                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td></tr>  '
            }
            htmlContent += totalForLeft(monthData) + '' + amtForwardLeft(monthData) + '' + dateTotalLeft(monthData) + '</tbody>' + breakTag() + '</table><p>Page' + pageNo + '-A(AutoFlightLog)</p>' + breakTag() + '<table class="waffle" cellspacing="0" cellpadding="0">' + breakTag() + '<thead><tr style="height: 30px">    <th class="s0" dir="ltr" colspan="6"><b>CONDITIONS OF FLIGHT</b></th>    <th class="s0"dir="ltr" rowspan="3"><b>FLIGHT SIMULATOR</b></th>    <th class="s0" dir="ltr" colspan="5"><b>TYPE OF PILOTING TIME</b></th>    <th class="s0" dir="ltr" rowspan="3"><b>REMARKS AND ENDORDEMENTS</b></th></tr><tr style="height: 30px">    <th class="s0" dir="ltr" rowspan="2">Night</th>    <th class="s0" dir="ltr" rowspan="2">ACTUAL INSTRUMENT</th>    <th class="s0" dir="ltr" rowspan="2">SIMULATED INSTRUMENT (HOOD)</th>    <th class="s0" dir="ltr" colspan="2">APP</th>    <th class="s0" dir="ltr" rowspan="2">CROSS COUNTRY</th>    <th class="s0" dir="ltr" rowspan="2">SOLO</th>    <th class="s0" dir="ltr" rowspan="2">PILOT IN COMMAND</th>    <th class="s0" dir="ltr" rowspan="2">SECOND IN COMMAND</th>    <th class="s0" dir="ltr" rowspan="2">DUAL RECEIVED</th>    <th class="s0" dir="ltr" rowspan="2">INSTRUCTOR</th></tr><tr><th class="s0" dir="ltr">NO.</th>    <th class="s0" dir="ltr">TYPE</th></tr></thead><tbody>'
            monthData[1].map(d => {
                var sic_Time = d.p2 == 'Self' ? d.totalTime : d.p2.slice(0, 9) + "..."
                var pic_Time = d.p1 == 'Self' ? d.totalTime : d.p1.slice(0, 9) + "..."
                var Approches = d.approach1.split(";");
                var app_Type = Approches[1]
                var app_No = Approches[0]
                htmlContent += '<tr style="height: 30px" class="j_usa">                <td class="s0" dir="ltr">' + d.night + '</td>                <td class="s0" dir="ltr">' + d.actual_Instrument + '</td>                <td class="s0" dir="ltr">' + d.sim_instrument + '</td>                <td class="s0" dir="ltr">'+app_No+'</td>                <td class="s0" dir="ltr">'+app_Type+'</td>                <td class="s0" dir="ltr">x_country</td>                <td class="s0" dir="ltr">flight sim</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + pic_Time + '</td>                <td class="s0" dir="ltr">' + sic_Time + '</td>                <td class="s0" dir="ltr">' + d.dual_day + '</td><td class="s0" dir="ltr">' + d.instructional + '</td>                <td class="s0" dir="ltr">' + d.remark + '</td></tr>'
            })
            for (let i = 0; i < rows - monthData[1].length; i++) {
                htmlContent += '            <tr style="height: 30px" class="j_usa">                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td><td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                </tr>  '
            }
            htmlContent += totalForRight(monthData) + '' + amtForwardRight(monthData) + '' + dateTotalRight(monthData) + '</tbody>    </table><p>Page' + pageNo + ' -B(AutoFlightLog)</p></div>'

        }).join(' ')
        htmlContent += '</body></html>'
        return htmlContent
    }

    //----- Print to pdf  -----//
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
            const results = await RNHTMLtoPDF.convert({
                width: 842,
                height: 595,
                html: dataRes(),
                fileName: 'jeppessen(usa)',
                directory: 'Documents',
                base64: true,
            });
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
        if(period == "preDefined"){
            if (value == null){
                alert("please Select Duration");
            }
            else {
                printPDF();
            }
        }
        else if(period == "calenderDate"){
            if (fromPeriod == ''){
                alert("Please Select Start Date")
            }
            else if (toPeriod == ''){
                alert("Please Select End Date")
            }
            else {
                printPDF();
            }
        }
    }

    return (
        <SafeAreaView style={[DgcaLogbookStyles.container, {backgroundColor:theme.backgroundColor}]}>
            <View style={DgcaLogbookStyles.header}>
                <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.goBack()} />
                <Text style={DgcaLogbookStyles.aircrafts}>Jeppessen Logbook (USA)</Text>
            </View>

            <View style={dark?DgcaLogbookStyles.DarkmainTagLine:DgcaLogbookStyles.mainTagLine}>
                <Text style={dark?DgcaLogbookStyles.DarktagLine:DgcaLogbookStyles.tagLine}>Period</Text>
            </View>

            <RadioButton.Group
                onValueChange={period => setPeriod(period)} value={period}>
                <View style={DgcaLogbookStyles.radioSection}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton
                                uncheckedColor={dark?'#fff':'#000'}
                                color={dark?'#fff':'#000'}
                                value="preDefined" />
                            <Text style={dark?DgcaLogbookStyles.DarkradioText:DgcaLogbookStyles.radioText}>Pre Defined</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 100 }}>
                            <RadioButton
                                uncheckedColor={dark?'#fff':'#000'}
                                color={dark?'#fff':'#000'}
                                value="calenderDate" />
                            <Text style={dark?DgcaLogbookStyles.DarkradioText:DgcaLogbookStyles.radioText}>Calender Date</Text>
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
                                borderColor: dark?"#fff":"#393F45",
                                marginTop: 10,
                                backgroundColor: ' #000'
                            }]}
                            textStyle={{
                                fontSize: 14,
                                color: "#266173",
                            }}
                            dropDownContainerStyle={{ borderColor: "#266173", backgroundColor: dark?'#000':'#fff' }}
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
            <View style={DgcaLogbookStyles.mainTagLine}>
                <Text style={dark?DgcaLogbookStyles.DarktagLine:DgcaLogbookStyles.tagLine}>Page details</Text>
            </View>

            <View style={DgcaLogbookStyles.mainTagLine}>
                <Text style={DgcaLogbookStyles.pageDetailText}>Number of Rows</Text>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={dark?DgcaLogbookStyles.DarkTextInputView:DgcaLogbookStyles.TextInputView}>
                    <TextInput
                        placeholder='Min. 10 - max. 25'
                        placeholderTextColor='grey'
                        keyboardType='numeric'
                        value={rows}
                        onChangeText={(text) => setRows(text)}
                        max={2}
                        style={dark?{color:'#fff',padding: 10}:{ padding: 10 }}
                    />
                </View>
            </View>

            <View style={DgcaLogbookStyles.mainTagLine}>
                <Text style={dark?DgcaLogbookStyles.DarktagLine:DgcaLogbookStyles.pageDetailText}>Start page number</Text>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={dark?DgcaLogbookStyles.DarkTextInputView:DgcaLogbookStyles.TextInputView}>
                    <TextInput
                        placeholder='Enter Number'
                        placeholderTextColor='grey'
                        keyboardType='numeric'
                        value={page}
                        onChangeText={(text) => setPage(text)}
                        max={2}
                        style={dark?{color:'#fff',padding: 10}:{ padding: 10 }}
                    />
                </View>
            </View>

            <View style={DgcaLogbookStyles.footer}>
                <TouchableOpacity onPress={() => { validate() }}>
                    <View style={DgcaLogbookStyles.button}>
                        <Text style={DgcaLogbookStyles.buttonText}>View/Download</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
     );
};

// define your styles


//make this component available to the app
export default JUSA;
