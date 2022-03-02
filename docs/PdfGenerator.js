// Import React
import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Import RNPrint
//import RNPrint from 'react-native-print';

const PdfGenerator = ({navigation}) => {
  const [fromPeriod, setfromPeriod] = useState('Apr 2021');
  const [toPeriod, settoPeriod] = useState('Sep 2021');
  const [licenseHolderName, setlicenseHolderName] = useState('Nupur');

  const printPDF = async () => {
    const beforeTable =
      '<p style="text-align:center;">Flying experience for period from <strong>' +
      fromPeriod +
      '</strong> to <strong>' +
      toPeriod +
      '</strong> (Preceding 5 years/preceding 6 months/preceding 18 months) <br>Name of Licence Holder: <strong>' +
      licenseHolderName +
      '</strong> Licence Name: Licence Number: Valid upto</p>Aircrafts flown :<br><br>';
    const results = await RNHTMLtoPDF.convert({
      html:
        beforeTable +
        '<style type="text/css">    .ritz .waffle a { color: inherit; }.ritz .waffle .s0{background-color:#ffffff;text-align:center;color:#000000;font-size:10pt;vertical-align:bottom;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;padding:2px 3px 2px 3px;} td{ border: 1px #000 solid}</style><div class="ritz grid-container" dir="ltr">    <table class="waffle" cellspacing="0" cellpadding="0">        <tbody>            <tr style="height: 20px">                <td class="s0" dir="ltr" rowspan="5">Write years for year wise, Months for month wise or Aircrft for Aircrft wise </td>                <td class="s0" dir="ltr" colspan="4">SINGLE ENGINE AIRCRAFT</td>                <td class="s0" dir="ltr" colspan="9">MULTIPLE ENGINE AIRCRAFT / HELICOPTER</td>                <td class="s0" dir="ltr" colspan="3">INSTRUMENT TYPE</td>                <td class="s0" dir="ltr" rowspan="3">Instructional Flying</td>                <td class="s0" dir="ltr" rowspan="3">Remark</td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr" colspan="2">Day</td>                <td class="s0" dir="ltr" colspan="2">Night</td>                <td class="s0" dir="ltr" colspan="4">Day</td>                <td class="s0" dir="ltr" colspan="5">Night</td>                <td class="s0" dir="ltr" colspan="2">ON AIRCRAFT</td>                <td class="s0" dir="ltr" rowspan="2">Synthetic Simulated hr</td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Dual</td>                <td class="s0" dir="ltr">Solo</td>                <td class="s0" dir="ltr">Dual</td>                <td class="s0" dir="ltr">Solo</td>                <td class="s0" dir="ltr">U/T</td>                <td class="s0" dir="ltr">Co-Pilot</td>                <td class="s0" dir="ltr">PI (US)</td>                <td class="s0" dir="ltr">PIC</td>                <td class="s0" dir="ltr">U/T</td>                <td class="s0" dir="ltr">Co-Pilot</td>                <td class="s0" dir="ltr">PI (US)</td>                <td class="s0" dir="ltr">PIC</td>                <td class="s0" dir="ltr">Total</td>                <td class="s0" dir="ltr">Simulated</td>                <td class="s0" dir="ltr">Actual</td>            </tr>            <tr style="height: 20px">                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">1</td>                <td class="s0" dir="ltr">2</td>                <td class="s0" dir="ltr">3</td>                <td class="s0" dir="ltr">4</td>                <td class="s0" dir="ltr">5</td>                <td class="s0" dir="ltr">6</td>                <td class="s0" dir="ltr">7</td>                <td class="s0" dir="ltr">8</td>                <td class="s0" dir="ltr">9</td>                <td class="s0" dir="ltr">10</td>                <td class="s0" dir="ltr">11</td>                <td class="s0" dir="ltr">12</td>                <td class="s0" dir="ltr">13</td>                <td class="s0" dir="ltr">14</td>                <td class="s0" dir="ltr">15</td>                <td class="s0" dir="ltr">16</td>                <td class="s0" dir="ltr">17</td>                <td class="s0" dir="ltr">18</td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Jan 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Feb 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Mar 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Apr 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">May 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Jun 2021</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>            <tr style="height: 20px">                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>            <tr style="height: 20px">                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>            <tr style="height: 20px">                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>            <tr style="height: 20px">                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>                <td class="s0"></td>            </tr>            <tr style="height: 20px">                <td class="s0" dir="ltr">Total</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr">0:00</td>                <td class="s0" dir="ltr"></td>            </tr>        </tbody>    </table></div>',
      fileName: 'test',
      base64: true,
    });
    // await setsource(results.filePath);
    // await setshowPDF(true);
    // await RNPrint.print({filePath: results.filePath});
    navigation.navigate('ShowPDF', {
      filepath: results.filePath,
      //base64: results.base64,
    });
    console.log(results);
  };

  // const printRemotePDF = async () => {
  //   await RNPrint.print({filePath: '/data/user/0/com.sqliteproject/cache/test1901908765202913450.pdf'});
  // };

  return (
    <SafeAreaView>
      <Text>
        Print HTML as a Document from React Native App
      </Text>

      <View>
        <TouchableOpacity style={styles.buttonStyle} onPress={printPDF}>
          <Text>Click to Print PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginVertical: 10,
  },
});

export default PdfGenerator;
