import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
//import { View, Text, StyleSheet,ImageBackground } from "react-native";
import Colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as RNIap from 'react-native-iap';

const itemSubs = Platform.select({
  ios: [
    'com.aviation.AutoFlightLog.sub.Annual', // dooboolab
],
android: [
   'com.aviation_autoflight_annual'
]
});
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

const Subscribe = ({navigation}) => {
  const [products, setProducts] = useState([])
  const [purchased, setPurchased] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    initilizeIAPConnection();
}, []);

const initilizeIAPConnection = async () => {
    await RNIap.initConnection()
        .then(async (connection) => {
            console.log('IAP result', connection);
            getItems();
        })
        .catch((err) => {
            console.warn(`IAP ERROR ${err.code}`, err.message);
        });
    // await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
    //     .then(async (consumed) => {
    //         console.log('consumed all items?', consumed);
    //     }).catch((err) => {
    //         console.warn(`flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`, err.message);
    // });
};

const getItems = async () => {
    try {
        const Products = await RNIap.getSubscriptions(itemSubs);
        console.log(' IAP Su', Products);
        if (Products.length !== 0) {
            if (Platform.OS === 'android') {
                setProducts({ Products })
            } else if (Platform.OS === 'ios') {
                setProducts({ Products })
            }
            console.log("constant",products)
        }
    } catch (err) {
        console.warn("IAP error", err.code, err.message, err);
        setError(err.message);
    }
};

const getPurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const newState = { premium: false, ads: true }
    let restoredTitles = [];
    purchases.forEach(purchase => {
      switch (purchase.productId) {
      case 'com.aviation.AutoFlightLog.sub.Annual':
        newState.premium = true
        restoredTitles.push('Premium Version');
        break
      case 'com.example.coins100':
         RNIap.consumePurchaseAndroid(purchase.purchaseToken);
        CoinStore.addCoins(100);
      }
    })
    Alert.alert('Restore Successful', 'You successfully restored the following purchases: ' + restoredTitles.join(', '));
  } catch(err) {
    console.warn(err); // standardized err.code and err.message available
    Alert.alert(err.message);
  }
}

useEffect(() => {
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (purchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                try {
                    if (Platform.OS === 'ios') {
                        RNIap.finishTransactionIOS(purchase.transactionId);
                    } else if (Platform.OS === 'android') {
                         RNIap.consumeAllItemsAndroid(purchase.purchaseToken);
                        await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                    }
                    await RNIap.finishTransaction(purchase, true);
                } catch (ackErr) {
                    console.log('ackErr INAPP>>>>', ackErr);
                }
            }
        },
    );
    purchaseErrorSubscription = RNIap.purchaseErrorListener(
        (error) => {
            console.log('purchaseErrorListener INAPP>>>>', error);
        },
    );
    return (() => {
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
    });
}, []);


const requestSubscription = async (sku) => {
    try {
        await RNIap.requestSubscription(sku)
            .then(async (result) => {
                console.log('IAP req sub', result);
                if (Platform.OS === 'android') {
                    // setProductId(result.productId);
                    console.log(result.productId)
                    // can do your API call here to save the purchase details of particular user
                } else if (Platform.OS === 'ios') {
                    console.log('reciept' ,result.transactionReceipt)
                    // setProductId(result.productId);
                    // setReceipt(result.transactionReceipt);
                    // can do your API call here to save the purchase details of particular user
                }
                // setBuyIsLoading(false);
            })
            .catch((err) => {
                console.warn(`IAP req ERROR %%%%%`, err.message,);
                setError(err.message);
            });
    } catch (err) {
        console.warn(`err ${error.code}`, error.message);
        setError(err.message);
    }
};
    return (
        <ImageBackground source={require('../images/loginbg.png')}
        imageStyle={{
          resizeMode: "cover",
          opacity: 0.2,
          //alignSelf: "flex-end"
        }}
        style={styles.backgroundImage}>
        <View style={{ width: '100%', paddingHorizontal: 30 }}>
          <View style={styles.card}>
            <Text style={styles.login}>COJO</Text>
            <Text style={styles.mainLine}>App Access {'\n'} (1 year)</Text>
            <Text style={styles.mainLine}>App Access (1 year) {'\n'} Subscription</Text>
            <Text style={styles.mainLine}>1,599.00/- Rupees</Text>
            <TouchableOpacity >
              <View style={styles.button} onPress={() => requestSubscription(products.Products[0].productId)}>
                <Text style={styles.buttonText}>Subscribe Now</Text>
              </View>
            </TouchableOpacity>
            
              <View style={{flexDirection:'row'}}>
                {/* <Text style={styles.mainLine}>Don't have account? </Text> */}
                {/* <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={[styles.mainLine, styles.link]}>Signup</Text></TouchableOpacity> */}
              </View>
              <TouchableOpacity onPress={()=>getPurchases()}><Text style={[styles.mainLine, styles.link1]}>Restore Purchase</Text></TouchableOpacity>
                <Text style={styles.mainLine}>(in case, Sign in from New/ {'\n'} Second device)</Text>
            </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={[styles.mainLine, styles.link1]}>Go Back</Text></TouchableOpacity>

      </ImageBackground>
    );
  };
  
  // define your styles
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
      //height: Dimensions.get('window').height * 1.3,
    },
    fullWidth:{
      width:'100%',
    },
    card: {
      backgroundColor: '#E6FAFF',
      alignItems: 'center',
      borderRadius: 50,
      opacity: 0.9,
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 30,
      shadowOpacity: 0.5,
      shadowColor: 'black',
      elevation: 8,
    },
    login: {
      fontFamily: 'AbrilFatface-Regular',
      fontSize: 34,
      color: Colors.primary,
    },
    mainLine: {
      textAlign: 'center',
      marginTop: 15,
      fontSize: 20,
      color: Colors.accent,
    },
    alignRight: {
      alignContent: 'flex-end',
      textAlign: 'right',
      width: '100%'
    },
    button: {
      backgroundColor: Colors.primary,
      marginTop: 20,
      padding: 15,
      //alignItems: 'center',
      borderRadius: 10,
      width: '100%',
      minWidth: 300,
      maxWidth: '100%',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center'
    },
    link: {
      color: '#0d70f2',
      fontSize: 15,
      textAlign:'center',
      marginLeft: 7,
    },
    link1: {
      color: '#0d70f2',
      fontSize: 20,
      textAlign:'center',
      marginLeft: 7,
    },
    icon: {
      marginHorizontal:5,
      marginTop: 15,
      position: 'absolute',
      left: 0,
      top: 0,
    },
    inputBox: {
      flexDirection: 'row',
      marginTop:20,
      borderBottomWidth: 0.8,
      width:'100%',
      maxWidth:'100%',
      position: 'relative',
      paddingLeft: 40,
      height: 50,
    },
    textInputBox:{
      width: '100%',
      color: '#266173'
    },
  
  });


export default Subscribe;