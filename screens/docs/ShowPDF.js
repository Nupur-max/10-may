import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import PDFView from 'react-native-view-pdf';
import Colors from '../../components/colors';
// Import RNPrint
import RNPrint from 'react-native-print';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DgcaLogbookStyles from '../../styles/dgcaLogbookStyles';
import { ThemeContext } from '../../theme-context';


const ShowPDF = ({ route, navigation }) => {
  const resources = {
    file:  route.params.filepath,
    base64: route.params.base64,
  };
  const resourceType = Platform.OS === 'ios' ? 'base64':'file';

  const printPDF = async () => {
    await RNPrint.print({
      filePath: resources.file,
      isLandscape: true
    });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#000'}}>
    <View style={{ flex: 1 }}>
      {/* Some Controls to change PDF resource */}
      <View style={DgcaLogbookStyles.header}>
        <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} style={{ padding: 6 }} onPress={() => navigation.navigate('Docs')} />
        <Text style={DgcaLogbookStyles.aircrafts}>Back</Text>
      </View>
      <View style={{ flex: 1 , backgroundColor:'#000'}}>
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={resources[resourceType]}
        resourceType={resourceType}
        onError={error => console.log('Cannot render PDF', error)}
      />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={printPDF}>
          <View style={DgcaLogbookStyles.button}>
            <Text style={DgcaLogbookStyles.buttonText}>Download</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    marginTop: 20,
    width: Dimensions.get('window').width * 0.5,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
});

export default ShowPDF;
