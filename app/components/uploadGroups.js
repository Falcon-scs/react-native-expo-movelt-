import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, Picker, SafeAreaView, TextInput,
  TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, Button, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { ImagePicker } from 'expo';
import firebase from 'firebase';
import LoggedOut from '../components/loggedOutScreen';


import {Dimensions} from 'react-native'

const { width, height } = Dimensions.get('window')

export default class UploadGroups extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      itemName: '',
      price: '',
      hasLoggedIn: false,
      numberOfMonths: '',
      description: '',
    }
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }

onPressSaveObject=() => {
  saleObject = this.state;
  this.storeItem();
  console.log(this.props.navigation);
}

onSubmitEditingItem=() => {
  Keyboard.dismiss();
}

onSubmitEditingPrice=() => {
  Keyboard.dismiss();
}

onSubmitEditingCategory=() => {
  Keyboard.dismiss();
}

onPressSaveObject=() => {
  saleObject = this.state;
    if ((this.state.itemName != "") && (this.state.price != "") && (this.state.numberOfMonths != "")) {
    this.storeItem();
    console.log(this.props.navigation);
    this.props.purchaseConfirmation(this.state.price, this.state.itemName);
  } else {
    alert("Please Fill in All Categories");
  }
}

storeItem() {
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var name = user.displayName;
  firebase.database().ref('groups').child(JSON.stringify(this.state.itemName) + uid).set({
    sizeStorageUnit: this.state.itemName,
    Price: this.state.price,
    seller: name,
    id: uid,
    description: this.state.description,
    photo: user.photoURL,
    numberOfMonths: this.state.numberOfMonths,
  });
  const pointsRef = firebase.database().ref(`/users/${uid}/points`);
  pointsRef.once('value', (snapshot) => {
    const points = +snapshot.val();
    const price = +this.state.price;
    pointsRef.set(points + price);
  });
}

purchaseConfirmation= async (price, name) => {
  this.props.navigation.navigate('SellersThankYou', {price:price, itemName: name});
}

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <KeyboardAwareScrollView>
        <SafeAreaView style={styles.container}>

        <View style={styles.feedbackBox}>
          <Text style={styles.textStyles}>
          Find Your Moving Group! Post the size unit that you are looking for and find some buddies!
           </Text>
         </View>

        <View style={styles.itemInformation}>

            <TextInput style={styles.inputText}
              placeholder = "Size Storage Unit (Ex: 10x10)"
              underlineColorAndroid = "transparent"
              onChangeText={(text) => this.setState({itemName: text})}
              onSubmitEditing={() => this.onSubmitEditingItem()}
              />

            <TextInput style={styles.inputText}
              placeholder = "Max Price per Month"
              underlineColorAndroid = "transparent"
              keyboardType = 'phone-pad'
              onChangeText={(text) => this.setState({price: text})}
              onSubmitEditing={() => this.onSubmitEditingItem()}
              />

              <TextInput style={styles.inputText}
                placeholder = "Number of Months"
                underlineColorAndroid = "transparent"
                keyboardType = 'phone-pad'
                onChangeText={(text) => this.setState({numberOfMonths: text})}
                onSubmitEditing={() => this.onSubmitEditingItem()}
                />

              <TextInput style={styles.inputText}
                placeholder = "Description (Optional)"
                underlineColorAndroid = "transparent"
                onChangeText={(text) => this.setState({description: text})}
                onSubmitEditing={() => this.onSubmitEditingItem()}
                />

              </View>


          <TouchableOpacity style={styles.postButton}
          onPress={()=> this.onPressSaveObject()}>
            <View>
              <Text style={styles.postButtonText}>
                Find Moving Group!
              </Text>
            </View>
          </TouchableOpacity>

        </SafeAreaView>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>


  );
  }
}
}

const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 40,
    marginTop: 5,
    backgroundColor: 'white',
  },
  itemInformation: {
    flex: 2,
    flexDirection: 'column',
  //  alignItems: 'center',
  //  justifyContent: 'space-around',
    margin: 20,
    backgroundColor: 'white',
  //  padding: 15,
  },
  pictureBox: {
    height: Metrics.screenHeight *.3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 70,
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: .5,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    //  padding: 10,
  },
    picture: {
    height: Metrics.screenHeight *.5,
    width: Metrics.screenWidth * .9,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    //  padding: 10,
  },
  inputText: {
    flex: 1.1,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  postButton: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 55,
    backgroundColor: 'lightblue',
  },
  postButtonText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  keyboardAction: {
    flex: 1,
  },
  feedbackBox: {
    flex: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    // borderStyle: 'solid',
    // borderWidth: 0.5,
    // borderTopLeftRadius: Metrics.screenWidth*.05,
    // borderTopRightRadius: Metrics.screenWidth*.05,
    // borderBottomLeftRadius: Metrics.screenWidth*.05,
    // borderBottomRightRadius: Metrics.screenWidth*.05,
    backgroundColor: 'white',
  },
  textStyles: {
    fontStyle: 'italic',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    // color: 'white',
  },
});
