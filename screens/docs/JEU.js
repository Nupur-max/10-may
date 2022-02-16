//import liraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native';
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
import BackupStyle from '../../styles/backupStyles';

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
const JEU = ({ navigation }) => {

    const [period, setPeriod] = useState('preDefined')
    const [fromPeriod, setfromPeriod] = useState('');
    const [toPeriod, settoPeriod] = useState('');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [licenseHolderName, setlicenseHolderName] = useState('');
    const [data, setData] = useState(null)
    // const [pdfData, setPdfData] = useState([])

    const [orderStart, setOrderStart] = React.useState('')
    const [orderEnd, setOrderEnd] = React.useState('')
    const [rows, setRows] = React.useState(10);
    const [loader, setLoader] = React.useState(false);
    const [loadData, setLoadData] = React.useState(false);
    const [page, setPage] = React.useState(1);
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
        if (loadData == true) {
            printPDF();
        }
    }, [loadData]);

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
        if(rows < 10){
            alert("Minimum number  of rows is 10")
        }
        else if (rows > 25){
            alert("Maximum number  of rows is 25")
        }
        else {
        setLoader(true)
        let user = await AsyncStorage.getItem('userdetails');
        user = JSON.parse(user);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let temData = [];
        prePopulateddb.transaction(tx => {
            tx.executeSql('Select * from logbook  WHERE user_id == "' + user.id + '" AND orderedDate BETWEEN "' + orderStart + '" AND "' + orderEnd + '" AND tag == "server" ORDER BY orderedDate ASC', [], (tx, result) => {
                
                if(result.rows.length <= 0){
                    setLoader(false)
                    alert("no data found")
                }
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
                    if(i+1===result.rows.length){
                        setLoadData(true)
                    }
                }
            });
        })
    }
        
    }

    //-------- Total calculation of left page data --------//
    const leftPageTotal = (monthData) => {
        let total_time = 0;
        let total_dayLanding = 0;
        let total_nightLanding = 0;
        let Final_Total_Time = '';
        let Final_day_landing = '';
        let Final_night_landing = '';

        monthData.map(d => {
            if(d.aircraftReg !== "SIMU"){
            //-------- total_Time flying hours --------//
            let Day = d.totalTime.split(":")
            let total_time1 = Number(Day[0] * 60) + Number(Day[1])
            total_time += total_time1
            let total_time_Hours = Math.floor(total_time / 60);
            let total_time_Min = total_time % 60;
            if (total_time_Hours < 10) {
                total_time_Hours = '0' + total_time_Hours;
            }
            if (total_time_Min < 10) {
                total_time_Min = '0' + total_time_Min;
            }
            Final_Total_Time = total_time_Hours + ":" + total_time_Min;

            //-------- total Day Landings --------//
            let dayLanding = +d.dayLanding
            total_dayLanding += dayLanding
            Final_day_landing = total_dayLanding

            //-------- total Night Landings --------//
            let nightLanding = +d.nightLanding
            total_nightLanding += nightLanding
            Final_night_landing = total_nightLanding
        }
        })
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr" style="border-bottom:none; border-top:none" colspan=5"></td> <td class="s0" dir="ltr" colspan="4"><b>TOTALS THIS PAGE</b></td>                    <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + Final_Total_Time + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + Final_day_landing + '</td>                <td class="s0" dir="ltr">' + Final_night_landing + '</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Previous Total calculation of left Page data --------//
    const prevTotalLeft = () => {
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr" style="border-bottom:none; border-top:none" colspan=5"></td>                <td class="s0" dir="ltr" colspan="4"><b>TOTAL FROM PREVIOUS PAGES</b></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalTime_array.splice(-1) + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + dayl_array.splice(-1) + '</td>                <td class="s0" dir="ltr">' + nightl_array.splice(-1) + '</td>                              </tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total Time calculation of left Page data --------// 
    var totalTime_array = ["00:00",]
    var dayl_array = ["0",]
    var nightl_array = ["0",]
    var time_total_time = 0;
    var time_total_dayLanding = 0
    var time_total_nightLanding = 0
    var time_Final_Total_Time = ''
    var time_Final_day_landing = ''
    var time_Final_night_landing = ''

    const leftPageTotalTime = (monthData) => {
        monthData.map(d => {
            if(d.aircraftReg !== "SIMU"){
            //-------- total_Time flying hours --------//
            let time_Day = d.totalTime.split(":")
            let time_total_time1 = Number(time_Day[0] * 60) + Number(time_Day[1])
            time_total_time += time_total_time1
            let time_total_time_Hours = Math.floor(time_total_time / 60);
            let time_total_time_Min = time_total_time % 60;
            if (time_total_time_Hours < 10) {
                time_total_time_Hours = '0' + time_total_time_Hours;
            }
            if (time_total_time_Min < 10) {
                time_total_time_Min = '0' + time_total_time_Min;
            }
            time_Final_Total_Time = time_total_time_Hours + ":" + time_total_time_Min;
            totalTime_array.push(time_Final_Total_Time)


            //-------- total Day Landings --------//
            let time_dayLanding = +d.dayLanding
            time_total_dayLanding += time_dayLanding
            time_Final_day_landing = time_total_dayLanding
            dayl_array.push(time_Final_day_landing)

            //-------- total Night Landings --------//
            let time_nightLanding = +d.nightLanding
            time_total_nightLanding += time_nightLanding
            time_Final_night_landing = time_total_nightLanding
            nightl_array.push(time_Final_night_landing)
        }
        })
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr" style="border-top:none" colspan="5"></td>                <td class="s0" dir="ltr" colspan="4"><b> TOTALS TIME</b></td>                    <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + time_Final_Total_Time + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + time_Final_day_landing + '</td>                <td class="s0" dir="ltr">' + time_Final_night_landing + '</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //-------- Total calculation of Right page data   --------//
    const rightPageTotal = (monthData) => {
        var totalNight = 0
        var totalFinalTime = 0
        var Final_Night_Time = ''
        var Final_PIC_Time = 0
        var Final_SIC_Time = '';
        var Total_Time = '';
        var TotalInst = '';
        var totalDur = 0
        var final_TotalDur = ''

        monthData.map(d => {
            if(d.aircraftReg !== "SIMU"){
            //--------  NightTime flying hours --------//
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
            Final_Night_Time = total_Night_Hours + ":" + total_Night_Min
            if (isNaN(Final_Night_Time[1])) {
                Final_Night_Time = '00:00'
            }

            //-------- PIC and SIC total Time --------//
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
            if (isNaN(Total_Time[1])) {
                Total_Time = '00:00'
            }
            Final_PIC_Time = d.p1 == 'Self' ? total_Hours + ":" + total_Min : '-';
            Final_SIC_Time = d.p2 == 'Self' ? total_Hours + ":" + total_Min : '-';

            //-------- Instructional total Time --------//
            var TotalInstTime = d.instructional.split(":")
            var total_inst = Number(TotalInstTime[0] * 60) + Number(TotalInstTime[1])
            TotalInst += total_inst
            var total_Inst_Hours = Math.floor(TotalInst / 60);
            var total_Inst_Min = TotalInst % 60;
            if (total_Inst_Hours < 10) {
                total_Inst_Hours = '0' + total_Inst_Hours;
            }
            if (total_Inst_Min < 10) {
                total_Inst_Min = '0' + total_Inst_Min;
            }
            TotalInst = total_Inst_Hours + ":" + total_Inst_Min;
            if (isNaN(TotalInst[1])) {
                TotalInst = '00:00'
            }
        }
        else if (d.aircraftReg == "SIMU") {
            //--------  Duration flying hours --------//
            var Dur = d.totalTime.split(":")
            var total_Dur = Number(Dur[0] * 60) + Number(Dur[1])
            totalDur += total_Dur
            var total_Dur_Hours = Math.floor(totalDur / 60);
            var total_Dur_Min = totalDur % 60;
            if (total_Dur_Hours < 10) {
                total_Dur_Hours = '0' + total_Dur_Hours;
            }
            if (total_Dur_Min < 10) {
               total_Dur_Min = '0' + total_Dur_Min;
            }
            final_TotalDur = total_Dur_Hours + ":" + total_Dur_Min;
            if (isNaN(final_TotalDur[1])) {
                final_TotalDur = '00:00'
            }
        }
        })
        let htmlContent = '<html><body>'

        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr">' + Final_Night_Time + '</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">' + Final_PIC_Time + '</td>                <td class="s0" dir="ltr">' + Final_SIC_Time + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + TotalInst + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + final_TotalDur + '</td>                <td style="padding:0px 3px; font-size:8px" rowspan="3">I certifiy that the all entries are true <br> -------------- <br> Pilot\'s Signature</td></tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //---------- total from Previous page calculation of right data --------//
    const fromPrevRight = () => {
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">                <td class="s0" dir="ltr">'+totalNight_array.splice(-1)+'</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">'+totalPIC_array.splice(-1)+'</td>                <td class="s0" dir="ltr">'+totalSIC_array.splice(-1)+'</td>                <td class="s0" dir="ltr"dual</td>                <td class="s0" dir="ltr">'+instructor_array.splice(-1)+'</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">'+date_final_Dur.splice(-1)+'</td>                </tr>'
        htmlContent += '</body></html>'
        return htmlContent
    }

    //------- total calculation of  total to Time Right Page data  --------//
    var time_totalNight = 0
    var time_totalFinalTime = 0
    var time_Final_Night_Time = ''
    var time_Final_PIC_Time = 0
    var time_Final_SIC_Time = '';
    var time_Total_Time = '';
    var time_TotalInst = '';
    var date_totalDur = 0 
    var date_total_Dur = ""

    var totalNight_array = ["00:00",]
    // ifr
    var totalPIC_array = ["00:00",]
    var totalSIC_array = ["00:00",]
    // dual
    var instructor_array = ["00:00",]
    var totalSession_array = ["00:00",]
    var date_final_Dur = ["00:00"]

    const rightPageTotalTime = (monthData) => {
        monthData.map(d => {
            if(d.aircraftReg !== "SIMU"){
            //-------- night flying hours --------//
            var time_Night = d.night.split(":")
            var time_total_Nighttime = Number(time_Night[0] * 60) + Number(time_Night[1])
            time_totalNight += time_total_Nighttime
            var time_total_Night_Hours = Math.floor(time_totalNight / 60);
            var time_total_Night_Min = time_totalNight % 60;
            if (time_total_Night_Hours < 10) {
                time_total_Night_Hours = '0' + time_total_Night_Hours;
            }
            if (time_total_Night_Min < 10) {
                time_total_Night_Min = '0' + time_total_Night_Min;
            }
            time_Final_Night_Time = time_total_Night_Hours + ":" + time_total_Night_Min
            if (isNaN(time_Final_Night_Time[1])) {
                time_Final_Night_Time = '00:00'
            }
            totalNight_array.push(time_Final_Night_Time)

            //-------- PIC and SIC total Time -------//
            var time_TotalTime = d.totalTime.split(":")
            var time_total_time = Number(time_TotalTime[0] * 60) + Number(time_TotalTime[1])
            time_totalFinalTime += time_total_time
            var time_total_Hours = Math.floor(time_totalFinalTime / 60);
            var time_total_Min = time_totalFinalTime % 60;
            if (time_total_Hours < 10) {
                time_total_Hours = '0' + time_total_Hours;
            }
            if (time_total_Min < 10) {
                time_total_Min = '0' + time_total_Min;
            }
            time_Total_Time = time_total_Hours + ":" + time_total_Min;
            totalSession_array.push(time_Total_Time)

            if (isNaN(time_Total_Time[1])) {
                time_Total_Time = '00:00'
            }
            if( d.p1 == 'Self'){
            time_Final_PIC_Time = time_Total_Time ;
            totalPIC_array.push(time_Final_PIC_Time)
            }
            if(d.p2 == 'Self'){
            time_Final_SIC_Time =  time_Total_Time;
            totalSIC_array.push(time_Final_SIC_Time)
        }
            //--------- Instructional total Time --------//
            var time_TotalInstTime = d.instructional.split(":")
            var time_total_inst = Number(time_TotalInstTime[0] * 60) + Number(time_TotalInstTime[1])
            time_TotalInst += time_total_inst
            var time_time_total_Inst_Hours = Math.floor(time_TotalInst / 60);
            var time_time_total_Inst_Min = time_TotalInst % 60;
            if (time_time_total_Inst_Hours < 10) {
                time_time_total_Inst_Hours = '0' + time_time_total_Inst_Hours;
            }
            if (time_time_total_Inst_Min < 10) {
                time_time_total_Inst_Min = '0' + time_time_total_Inst_Min;
            }
            time_TotalInst = time_time_total_Inst_Hours + ":" + time_time_total_Inst_Min;
            if (isNaN(time_TotalInst[1])) {
                time_TotalInst = '00:00'
            }
            instructor_array.push(time_TotalInst)
        }
        else if (d.aircraftReg == "SIMU") {
            //--------  Duration flying hours --------//
            var duration = d.totalTime.split(":")
            var total_duration = Number(duration[0] * 60) + Number(duration[1])
            date_totalDur += total_duration
            var Dur_Hours = Math.floor(date_totalDur / 60);
            var Dur_Min = date_totalDur % 60;
            if (Dur_Hours < 10) {
                Dur_Hours = '0' + Dur_Hours;
            }
            if (Dur_Min < 10) {
                Dur_Min = '0' + Dur_Min;
            }
            date_total_Dur = Dur_Hours + ":" + Dur_Min;
            if (isNaN(date_total_Dur[1])) {
                date_total_Dur = '00:00'
            }
            date_final_Dur.push(date_total_Dur)
        }
        })
        let htmlContent = '<html><body>'
        htmlContent += '<tr style="height: 20px">       <td class="s0" dir="ltr">' + time_Final_Night_Time + '</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">' + time_Final_PIC_Time + '</td>                <td class="s0" dir="ltr">' + time_Final_SIC_Time + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + time_TotalInst + '</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">-</td>                <td class="s0" dir="ltr">' + date_total_Dur + '</td>                </tr>'
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
    const dataToPrint = () => {
        const chunkSize = Number(rows)
        var pdfData = []
        for (var k = 0; k < data.length; k += chunkSize) {
            const chunk = data.slice(k, k + chunkSize);
            pdfData.push(chunk)
        }
        var platForm = Platform.OS === "ios" ? '<br><br> ' : chunkSize <= 18 ? '<br><br><br>' :'<br><br>'
        var platFormCss = Platform.OS === "ios" ? '.ritz .waffle .s0{padding:0px 9px}' : '.ritz .waffle .s0{padding:0px 9px}'
        let htmlContent = '<html><body>'
        pdfData.map((monthData, index) => {
            var pageNo = Number(page) + index
            var page1 =  '<p>Page' + pageNo + '-A(AutoFlightLog)</p>' 
            var page2 =  '<p>Page' + pageNo + '-B(AutoFlightLog)</p>' 
            var brTag = Platform.OS == "ios" ? '<br><br><br>' : '<br><br><br>'
            htmlContent += '<style type="text/css"> @page { size:29.5cm 21cm; }table{"page-break-after: always;"} tr { page-break-inside:avoid !important; page-break-after:auto } .j_ue:nth-child(even) {background-color: #e0ebeb;} .ritz .waffle a { color: inherit; }.ritz .waffle .s0{text-align:center;color:#000000;font-size:10pt;vertical-align:center;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;} ' + platFormCss + ' td{ border: 2px #000 solid}</style><div class="ritz grid-container" dir="ltr"><table class="waffle" cellspacing="0" cellpadding="0">                   <tr style="height: 20px">                <td class="s0" dir="ltr" rowspan="2">DATE (DD/MM/YY)</td>                <td class="s0" dir="ltr" colspan="2">DEPARTURE</td>                <td class="s0" dir="ltr" colspan="2">ARRIVAL</td>                <td class="s0" dir="ltr" colspan="2">AIRCRAFT</td>                <td class="s0" dir="ltr" colspan="2">SP</td>                <td class="s0" dir="ltr" rowspan="2">MULTI- PILOT</td>                <td class="s0" dir="ltr" rowspan="2">TOTAL TIME OF FLIGHT</td>                		<td class="s0" dir="ltr" rowspan="2">NAME PIC</td>                 <td class="s0" dir="ltr" colspan="2">LANDINGS</td>             </tr> <tr style="height: 20px">                <td class="s0" dir="ltr">PLACE</td>                <td class="s0" dir="ltr">TIME</td>                <td class="s0" dir="ltr">PLACE</td>                <td class="s0" dir="ltr">TIME</td>                <td class="s0" dir="ltr">MAKE & MODEL</td>        <td class="s0" dir="ltr">REGISTRATION</td>                <td class="s0" dir="ltr">SE</td>                <td class="s0" dir="ltr">ME</td>                <td class="s0" dir="ltr">DAY</td>                <td class="s0" dir="ltr">NIGHT</td>           </tr><tbody>'
            monthData.map(d => {
                if(d.aircraftReg !== "SIMU"){
                var SEtime = d.Class == "SE" ? d.totalTime : '';
                var MEtime = d.Class == "ME" ? d.totalTime : '';
                }
                else{
                    var SEtime = ""
                    var MEtime = ""
                }

                var totalDuration = d.aircraftReg !== "SIMU" ? d.totalTime : ""

                htmlContent += '<tr  class="j_ue" style="height: 20px">                <td class="s0" dir="ltr">' + d.date + '</td>                <td class="s0" dir="ltr">' + d.from + '</td>                <td class="s0" dir="ltr">' + d.chocksOffTime + '</td>                <td class="s0" dir="ltr">' + d.to + '</td>                <td class="s0" dir="ltr">' + d.chocksOnTime + '</td>                <td class="s0" dir="ltr">' + d.aircraftType + '</td>                <td class="s0" dir="ltr">' + d.aircraftReg + '</td>                <td class="s0" dir="ltr">' + SEtime + '</td>                <td class="s0" dir="ltr">' + MEtime + '</td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + totalDuration + '</td>             <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr">' + d.dayLanding + '</td>                <td class="s0" dir="ltr">' + d.nightLanding + '</td>      </tr>'
            })
            for (let i = 0; i < rows - monthData.length; i++) {
                htmlContent += '<tr class="j_ue" style="height: 20px" id=' + [i] + '>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td> <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                </tr>'
            }
            htmlContent += leftPageTotal(monthData) + prevTotalLeft(monthData) + leftPageTotalTime(monthData) + '        </tbody> ' + breakTag() + ' '+brTag+' </table>'+page1+'<table class="waffle" cellspacing="0" cellpadding="0" >' + breakTag() + '   '+platForm+'         <tr style="height: 20px">                <td class="s0" dir="ltr" colspan="2">OPERATIONAL CONDITION</td>                <td class="s0" dir="ltr" colspan="4">PILOT FUNCTION</td>                <td class="s0" dir="ltr" colspan="3">SYNTHETIC TRAINING DEVICES SESSION</td>                <td class="s0" dir="ltr" rowspan="2">REMARKS AND ENDORSMENTS</td>             </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">NIGHT</td>                <td class="s0" dir="ltr">IFR</td>                <td class="s0" dir="ltr">PILOT-IN-COMMAND</td>                <td class="s0" dir="ltr">CO- PILOT</td>                <td class="s0" dir="ltr">DUAL</td>        <td class="s0" dir="ltr">INSTRUCTOR</td>                <td class="s0" dir="ltr">DATE (DD/MM/YY)</td>                <td class="s0" dir="ltr">&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;&nbsp;</td>                <td class="s0" dir="ltr">TOTAL TIME OF SESSION</td>           </tr> <tbody>'
            monthData.map(d => {
                var totalSim = d.aircraftReg == 'SIMU' ? d.totalTime : ""  ;
                if(d.aircraftReg !== "SIMU"){
                var dataDate =  d.date
                var dataType =  d.aircraftType
                var sic_Time = d.p2 == 'Self' ? d.totalTime : d.p2.slice(0, 10) + '...'
                var pic_Time = d.p1 == 'Self' ? d.totalTime : d.p1.slice(0, 10) + '...'
                }
                else{
                    var sic_Time = ""
                    var pic_Time = ""
                    var dataDate =  ""
                    var dataType = ""
                }

                htmlContent += '<tr class="j_ue" style="height: 20px">                <td class="s0" dir="ltr">' + d.night + '</td>                <td class="s0" dir="ltr">' + d.ifr_vfr + '</td>                <td class="s0" dir="ltr">' + pic_Time + '</td>                <td class="s0" dir="ltr" style="width: 90px">' + sic_Time + '</td>                <td class="s0" dir="ltr">' + d.dual_day  + '</td>                <td class="s0" dir="ltr">' + d.instructional + '</td>                <td class="s0" dir="ltr">' + dataDate + '</td>                <td class="s0" dir="ltr">'+ dataType +'</td>                <td class="s0" dir="ltr">' + totalSim + '</td>                <td class="s0" dir="ltr"></td>  </tr>'
            })
            for (let i = 0; i < rows - monthData.length; i++) {
                htmlContent += '<tr class="j_ue" style="height: 20px" id=' + i + '>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                <td class="s0" dir="ltr"></td>                </tr> '
            }
            htmlContent += rightPageTotal(monthData) + fromPrevRight(monthData) + rightPageTotalTime(monthData) + '       </tbody>    </table>'+page2+'</div>'
        }).join(' ')
        htmlContent += '</body></html>'
        return htmlContent
    }
    //----- Print to pdf  -----//
    const printPDF = async () => {
        // setLoader(true)
        // if (data !== null) {
        //     const beforeTable =
        //         '<p style="text-align:center;">Flying experience for period from <strong>' +
        //         fromPeriod +
        //         '</strong> to <strong>' +
        //         toPeriod +
        //         '</strong> (Preceding 5 years/preceding 6 months/preceding 18 months) <br>Name of Licence Holder: <strong>' +
        //         licenseHolderName +
        //         '</strong> Licence Name: Licence Number: Valid upto</p>Aircrafts flown :<br><br>';
            const results = await RNHTMLtoPDF.convert({
                width: 842,
                height: 595,
                html: dataToPrint(),
                fileName: 'jeppessen(eu)',
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
            setLoader(false)
            setLoadData(false)
        // }
        // else {
        //     alert("No Data Found")
        //     setLoader(false)
        // }
    };

    // ------------ Validation --------- //
    const validate = () => {
        if(period == "preDefined"){
            if (value == null){
                alert("please Select Duration");
                setLoader(false)
            }
            else {
                getLogbookData();
            }
        }
        else if(period == "calenderDate"){
            if (fromPeriod == ''){
                alert("Please Select Start Date")
                setLoader(false)
            }
            else if (toPeriod == ''){
                alert("Please Select End Date")
                setLoader(false)
            }
            else {
                getLogbookData();
            }
        }
    }


    return (
        <SafeAreaView style={[DgcaLogbookStyles.container, {backgroundColor:theme.backgroundColor}]}>
            <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? "padding" : null}>
            <ScrollView>
            <View style={DgcaLogbookStyles.header}>
                <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.goBack()} />
                <Text style={DgcaLogbookStyles.aircrafts}>Jeppessen Logbook (EU)</Text>
            </View>

            <View style={dark?DgcaLogbookStyles.DarkmainTagLine:DgcaLogbookStyles.mainTagLine}>
                <Text style={dark?DgcaLogbookStyles.DarktagLine:DgcaLogbookStyles.tagLine}>Period</Text>
            </View>

            <RadioButton.Group
                onValueChange={period => setPeriod(period)} value={period}>
                <View style={DgcaLogbookStyles.radioSection}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton.Android
                                uncheckedColor={dark?'#fff':'#000'}
                                color={dark?'#fff':'#000'}
                                value="preDefined" />
                            <Text style={dark?DgcaLogbookStyles.DarkradioText:DgcaLogbookStyles.radioText}>Pre Defined</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 100 }}>
                            <RadioButton.Android
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
                <Text style={DgcaLogbookStyles.pageDetailText}>Start page number</Text>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={dark?DgcaLogbookStyles.DarkTextInputView:DgcaLogbookStyles.TextInputView}>
                    <TextInput
                        placeholder='add Page Number'
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
                <TouchableOpacity onPress={validate}>
                    <View style={DgcaLogbookStyles.button}>
                        <Text style={DgcaLogbookStyles.buttonText}>View/Download</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {loader ===true ?
                      <View style={BackupStyle.centeredView}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={loader}
                      >
                        <View style={BackupStyle.centeredView}>
                          <View style={BackupStyle.modalView}>
                            <ActivityIndicator color={'#fff'} />
                            <Text style={{ color: '#fff' }}>Please Wait ....</Text>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    :  null
                    }

        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// define your styles


//make this component available to the app
export default JEU;
