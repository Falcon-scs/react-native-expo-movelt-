import React from 'react';
import {
  Button,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ImagePicker, Permissions} from 'expo';
import * as _ from 'lodash';
import firebase from 'firebase';
import {CheckBox} from 'react-native-elements'
import Modal from 'react-native-modal';
import LoggedOut from '../components/loggedOutScreen';



/*
for scaling, can use sql, or use a backend developer (firebase)
*/


export default class UploadSale extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      image: '',
      itemName: '',
      price: '',
      description: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      imageUri: '',
      test: '',
      hasLoggedIn: false,
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

  onPressUploadPicture = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!_.isEqual(status, 'granted')) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  };

  onPressTakePicture = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    if (!_.isEqual(status, 'granted')) return;
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  };


  onPressSaveObject = async () => {
    if ((this.state.itemName !== '') && (this.state.price !== '') && (this.state.currentCategory !== 'Click Here to Change Categories')
      && (this.state.image !== '')) {
      await this.storeItem();
      console.log(this.props.navigation);
      this.props.purchaseConfirmation(this.state.price, this.state.itemName);
    } else {
      alert('Please Fill in All Categories');
    }
  };

  onSubmitEditingItem = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingPrice = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingDescription = () => {
    Keyboard.dismiss();
  };

  storeItem = async () => {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const name = user.displayName;
    const response = await fetch(this.state.image);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child('images/' + JSON.stringify(this.state.itemName) + uid);

    await ref.put(blob).then((snapshot) => {
      console.log('puts blob');

      console.log('Uploaded a data_url string!');
      const downloadURL = snapshot.downloadURL;
      console.log('downloadUrl: ' + downloadURL);
      {
        this.setState({image: downloadURL, test: 'testSuccessful'})
      }
    });

    console.log(JSON.stringify(this.state.image));
    console.log(JSON.stringify(this.state.test));


    firebase.database().ref('items').child(JSON.stringify(this.state.itemName) + uid).set({
      itemName: this.state.itemName,
      Price: this.state.price,
      category: this.state.currentCategory,
      seller: name,
      id: uid,
      description: this.state.description,
      image: this.state.image,
    });
    // const pointsRef = firebase.database().ref('users').child(uid).child('points');
    const pointsRef = firebase.database().ref(`/users/${uid}/points`);
    pointsRef.once('value', (snapshot) => {
      const points = +snapshot.val();
      const price = +this.state.price;
      pointsRef.set(points + price);
    });
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  onPressCategory() {
    this.toggleModal();
  }

  onPressMiscellaneous = async () => {
    await this.setState({isModalVisible: false, currentCategory: 'Miscellaneous'});
    console.log(this.state.currentCategory);
  };

  onPressElectronics = async () => {
    await this.setState({isModalVisible: false, currentCategory: 'Electronics'});
    console.log(this.state.currentCategory);
  };

  onPressClothes = async () => {
    await this.setState({isModalVisible: false, currentCategory: 'Clothes'});
    console.log(this.state.currentCategory);
  };

  onPressSmallItems = async () => {
    await this.setState({isModalVisible: false, currentCategory: 'Small Items'});
    console.log(this.state.currentCategory);
  };


  render() {

    let {image} = this.state;


    let contentView = null;
    if (this.state.image === '') {
      contentView =
        (<View>
          <Button
            onPress={() => this.onPressUploadPicture()}
            title="Upload Picture"
            color="lightblue"
          />
          <Button
            onPress={() => this.onPressTakePicture()}
            title="Take Picture"
            color="lightblue"/>
        </View>)

    } else {
      contentView = (
        <Image source={{uri: image}} style={styles.picture}/>
      );
    }

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.container}>

            <View style={styles.pictureBox}>
              {contentView}
            </View>

            <View style={styles.itemInformation}>

              <TextInput style={styles.inputText}
                         placeholder="Item Name"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({itemName: text})}
                         onSubmitEditing={() => this.onSubmitEditingItem(this.state.searchText)}
              />

              <TextInput style={styles.inputText}
                         placeholder="Price"
                         underlineColorAndroid="transparent"
                         keyboardType='phone-pad'
                         onChangeText={(text) => this.setState({price: text})}
                         onSubmitEditing={() => this.onSubmitEditingPrice(this.state.searchText)}
              />

              <CheckBox
                center
                title={this.state.currentCategory}
                iconRight
                iconType='material'
                uncheckedIcon='add'
                textStyle={{fontWeight: 'normal', color: 'gray'}}
                containerStyle={{width: Metrics.screenWidth * .85}}
                onPress={() => this.onPressCategory()}
              />

              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Modal
                  isVisible={this.state.isModalVisible}
                  onBackdropPress={() => this.setState({isModalVisible: false})}
                  backdropColor={'black'}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Pick a Category!
                    </Text>
                    <Button
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                      title='MISCELLANEOUS'
                      onPress={() => this.onPressMiscellaneous()}/>
                    <Button
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                      title='ELECTRONICS'
                      onPress={() => this.onPressElectronics()}/>
                    <Button
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                      title='CLOTHES'
                      onPress={() => this.onPressClothes()}/>
                    <Button
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                      title='SMALL ITEMS'
                      onPress={() => this.onPressSmallItems()}/>
                  </View>
                </Modal>
              </View>


              <TextInput style={styles.inputText}
                         placeholder="(Brief) Item Description"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({description: text})}
                         onSubmitEditing={() => this.onSubmitEditingDescription(this.state.searchText)}
              />

            </View>


            <TouchableOpacity style={styles.postButton}
                              onPress={() => this.onPressSaveObject()}>
              <View>
                <Text style={styles.postButtonText}>
                  Post
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
    padding: 20,
    marginTop: 5,
    // backgroundColor: 'white',
  },
  itemInformation: {
    flex: 1.5,
    flexDirection: 'column',
    //  alignItems: 'center',
    //  justifyContent: 'space-around',
    margin: 20,
    backgroundColor: 'white',
    //  padding: 15,
  },
  pictureBox: {
    height: Metrics.screenHeight * .3,
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
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 20,
    //  padding: 10,
  },
  inputText: {
    flex: 1,
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
  bigInputText: {
    flex: 2,
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
    flex: .7,
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
    fontSize: 40,
    fontWeight: 'bold',
  },
  keyboardAction: {
    flex: 1,
  },
  modalView: {
    // width: Metrics.screenWidth,
    height: Metrics.screenHeight * .6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
