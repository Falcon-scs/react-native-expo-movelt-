import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, Picker, SafeAreaView, TextInput, Button,
  TouchableOpacity, Image, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { ImagePicker } from 'expo';

/*
for scaling, can use sql, or use a backend developer (firebase)


*/

import {Dimensions} from 'react-native'

const { width, height } = Dimensions.get('window')

export default class StorageInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
    }
  }

onPressUploadPicture = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  console.log(result);

  if (!result.cancelled) {
    this.setState({ image: result.uri });
  }
};

onPressTakePicture= async() => {
  console.log('candyland');
}


onPressSaveObject=() => {
  saleObject = this.state;
  console.log(saleObject);
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

  render() {
    let { image } = this.state;
    let saleObject = null;

    let contentView = null;
    if (this.state.image == null) {
        contentView = (  <Button
            onPress={()=> this.onPressUploadPicture()}
            title="Upload Picture"
            color="blue"
          />
        );
    } else {
      contentView = (
      <Image source={{ uri: image }} style={styles.picture} />
      );
    }

    return (

      <KeyboardAwareScrollView>
      <SafeAreaView style={styles.container}>

          <View style={styles.itemInformation}>

              <TextInput style={styles.inputText}
                placeholder = "Item Name"
                underlineColorAndroid = "transparent"
                onChangeText={(text) => this.setState({itemName: text})}
                onSubmitEditing={() => this.onSubmitEditingItem(this.state.searchText)}
                />

              <TextInput style={styles.inputText}
                placeholder = "Price"
                underlineColorAndroid = "transparent"
                keyboardType = 'phone-pad'
                onChangeText={(text) => this.setState({Price: text})}
                onSubmitEditing={() => this.onSubmitEditingPrice(this.state.searchText)}
                />

              <TextInput style={styles.inputText}
                placeholder = "Category"
                underlineColorAndroid = "transparent"
                onChangeText={(text) => this.setState({Category: text})}
                onSubmitEditing={() => this.onSubmitEditingCategory(this.state.searchText)}
                />

                <TextInput style={styles.inputText}
                  placeholder = "Location"
                  underlineColorAndroid = "transparent"
                  onChangeText={(text) => this.setState({Category: text})}
                  onSubmitEditing={() => this.onSubmitEditingCategory(this.state.searchText)}
                  />

                </View>


        <TouchableOpacity style={styles.postButton}
        onPress={()=> this.onPressSaveObject()}>
          <View>
            <Text style={styles.postButtonText}>
              Search
            </Text>
          </View>
        </TouchableOpacity>

      </SafeAreaView>
      </KeyboardAwareScrollView>


  );
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
    flex: 1.5,
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
  //  alignItems: 'center',
  //  justifyContent: 'space-around',
    margin: 20,
    backgroundColor: 'white',
  //  padding: 15,
  },
  pictureBox: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'white',
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
    flex: 1,
    borderStyle: 'solid',
    borderWidth: .1,
    backgroundColor: 'lightgray',
    flexDirection: 'row',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  postButton: {
    flex: .75,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 55,
    backgroundColor: 'lightgreen',
  },
  postButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  keyboardAction: {
    flex: 1,
  },
});
