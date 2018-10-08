import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Dimensions,
  FlatList,
  Keyboard,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {FormInput, Slider} from 'react-native-elements';
import * as _ from 'lodash';
import moment from 'moment';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Feather} from '@expo/vector-icons';
import Loading from '../components/loading';
import StorageCard from '../components/storage-card';
import ListEmpty from '../components/list-empty';


const {width} = Dimensions.get('window');


export default class StorageUnits extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {navigate} = navigation;
    return {
      headerTitle: 'Storage Units',
      title: 'Storage Units',
      headerLeft: (
        <Feather
          style={styles.icon}
          name="menu"
          size={Metrics.icons.medium}
          color={'lightblue'}
          onPress={() => navigate('DrawerToggle')}
        />
      ),
      headerRight: (
        <Button
          title="Clear"
          color="powderblue"
          onPress={async () => {
            await AsyncStorage.removeItem('storage/preferences');
            navigation.replace('StorageUnitsScreen');
          }}
        />
      )
    };
  };


  constructor(props) {
    super(props);
    this.state = {
      preferences: null,
      isPreferencesLoaded: false,
      units: [],
      isUnitsLoaded: false,
    };
    this._initialize()
      .catch((error) => Alert.alert(error.toString(), ''));
  }

  async _initialize() {
    await this._initializePreferences();
    const {preferences} = this.state;
    if (StorageUnits._isPreferencesValid(preferences)) {
      await this._getAndUpdateUnits();
    }
  }

  async _initializePreferences() {
    let preferences = await StorageUnits._getPreferences();
    return new Promise((resolve) => {
      this.setState({
        preferences,
        isPreferencesLoaded: true,
      }, () => resolve());
    });
  }

  static async _getPreferences() {
    const preferences = await AsyncStorage.getItem('storage/preferences');
    return JSON.parse(preferences);
  }

  static _isPreferencesValid(preferences) {
    const requiredKeys = ['maximumPrice', 'zipCode'];
    if (!_.every(requiredKeys, (key) => _.has(preferences, key))) {
      return false;
    }
    const {maximumPrice, zipCode} = preferences;
    return _.isFinite(maximumPrice) && _.isFinite(zipCode);
  }

  async _updateUnits(rawUnits) {
    const {preferences} = this.state;
    if (!StorageUnits._isPreferencesValid(preferences)) return;
    const units = [];
    for (let i = 0; i < rawUnits.length; i++) {
      for (let j = 0; j < rawUnits[i].units.length; j++) {
        const price = Number.parseInt(rawUnits[i]['units'][j]['price']);
        const size = rawUnits[i]['units'][j]['size'];
        const address = rawUnits[i]['address'];
        const photoUri = rawUnits[i]['img_src'];
        const site = rawUnits[i]['site'];
        const unit = {
          price,
          size,
          address,
          photoUri,
          site,
        };
        if (!StorageUnits._isUnitValid(unit)) continue;
        units.push(unit);
      }
    }
    this.setState({units});
  }

  static _isUnitValid(unit) {
    const {price, size, address, photoUri, site} = unit;
    return _.isFinite(price)
      && _.isString(size)
      && _.isString(address)
      && _.isString(photoUri)
      && _.isString(site);
  }

  async _getAndUpdateUnits() {
    const {preferences} = this.state;
    const {zipCode} = preferences;
    this.setState({
      isUnitsLoaded: false,
    });
    try {
      const rawUnits = await StorageUnits._getRawUnits(zipCode);
      await this._updateUnits(rawUnits);
    } catch (error) {
      Alert.alert(error.toString(), '');
    }
    this.setState({
      isUnitsLoaded: true,
    });
  }

  _renderListItem(item) {
    const {navigate} = this.props.navigation;
    return (
      <StorageCard
        unit={item}
        onCardPressed={() => navigate('StorageUnitScreen', {unit: item})}
        onButtonPressed={() => Linking.openURL(item['site'])}
      />
    );
  }

  static _extractKey(item, index) {
    return index.toString();
  }

  render() {
    const {preferences, isPreferencesLoaded} = this.state;
    if (!isPreferencesLoaded) {
      return (<Loading/>);
    }
    if (!StorageUnits._isPreferencesValid(preferences)) {
      return (
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          accessible={false}
          style={{backgroundColor: 'white'}}
        >
          <KeyboardAwareScrollView>
            <SafeAreaView style={styles.preferencesContainer}>
              <View style={styles.pictureBox}>
                <Text
                style={{fontSize: 28, fontWeight: 'bold', color: 'lightblue', textAlign: 'center'}}>
                Fill Out Moving Criteria! Find Your Ideal Storage Unit!
                </Text>
              </View>
              <View style={styles.itemInformation}>
                <View style={styles.textInputs}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Max Price (per month)"
                    underlineColorAndroid="transparent"
                    keyboardType='phone-pad'
                    onChangeText={(maximumPrice) => this._onInitialMaximumPriceChanged(maximumPrice)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Zipcode (ex: 94309)"
                    underlineColorAndroid="transparent"
                    keyboardType='phone-pad'
                    onChangeText={(zipCode) => this._onInitialZipCodeChanged(zipCode)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.postButton}
                onPress={() => this._onSavePreferencesButtonPressed()}
              >
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
    const {maximumPrice, zipCode} = preferences;
    const {units, isUnitsLoaded} = this.state;
    if (!isUnitsLoaded) {
      return (<Loading/>);
    }
    const filteredUnits = units.filter((unit) => unit.price <= maximumPrice);
    return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{backgroundColor: 'white'}}
      >
        <View style={styles.container}>
          <View style={styles.purchaseBox}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <FormInput
                value={_.isUndefined(this.state.zipCodeTextInputValue)
                  ? zipCode.toString()
                  : this.state.zipCodeTextInputValue
                }
                placeholder="Zip code"
                containerStyle={{flex: 1}}
                onChangeText={(zipCode) => this._onZipCodeChanged(zipCode)}
              />
              <Button
                title="Save"
                color="powderblue"
                onPress={() => this._onSaveZipCodeButtonPressed()}
              />
            </View>
            <View
              style={{
                height: 50,
                width: Metrics.screenWidth * .9,
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Slider
                value={maximumPrice}
                thumbTintColor='lightblue'
                minimumValue={5}
                maximumValue={600}
                step={1}
                onSlidingComplete={(maximumPrice) => this._onMaximumPriceChanged(maximumPrice)}
              />
              <Text>Maximum Price: ${maximumPrice}</Text>
            </View>
          </View>
          <View style={styles.itemList}>
            <FlatList
              initialNumToRender={4}
              data={filteredUnits}
              renderItem={({item}) => this._renderListItem(item)}
              keyExtractor={StorageUnits._extractKey}
              ItemSeparatorComponent={() => (<View style={{height: 10}}/>)}
              ListEmptyComponent={<ListEmpty/>}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _onInitialMaximumPriceChanged(initialMaximumPriceTextInputValue) {
    this.setState({initialMaximumPriceTextInputValue});
  }

  _onInitialZipCodeChanged(initialZipCodeTextInputValue) {
    this.setState({initialZipCodeTextInputValue});
  }

  async _onSavePreferencesButtonPressed() {
    const {
      initialMaximumPriceTextInputValue,
      initialZipCodeTextInputValue,
    } = this.state;
    const maximumPrice = Number.parseInt(initialMaximumPriceTextInputValue);
    const zipCode = Number.parseInt(initialZipCodeTextInputValue);
    const preferences = {maximumPrice, zipCode};
    if (!StorageUnits._isPreferencesValid(preferences)) return;
    await AsyncStorage.setItem('storage/preferences', JSON.stringify(preferences));
    this.setState({
      preferences,
      isPreferencesLoaded: true,
    }, () => this._getAndUpdateUnits());
  }

  _onZipCodeChanged(zipCodeTextInputValue) {
    this.setState({zipCodeTextInputValue});
  }

  async _onSaveZipCodeButtonPressed() {
    const {zipCodeTextInputValue} = this.state;
    const zipCode = Number.parseInt(zipCodeTextInputValue);
    if (!_.isFinite(zipCode)) {
      return console.log(`Invalid zip code: ${zipCode}`);
    }
    this.setState({isUnitsLoaded: false});
    let rawUnits;
    try {
      rawUnits = await StorageUnits._getRawUnits(zipCode);
    } catch (error) {
      Alert.alert(error.toString(), '');
      return this.setState({isUnitsLoaded: true});
    }
    const preferences = {
      ...this.state.preferences,
      zipCode,
    };
    await this._updateUnits(rawUnits);
    this.setState({
      preferences,
      isUnitsLoaded: true,
    });
  }

  _onMaximumPriceChanged(maximumPrice) {
    if (!_.isFinite(maximumPrice)) return;
    const preferences = {
      ...this.state.preferences,
      maximumPrice,
    };
    this.setState({preferences});
  }

  static async _getRawUnits(zipCode) {
    // Getting cache from the AsyncStorage
    const formattedDate = moment().format('DD-MM-YYYY-HH');
    const storageKey = `storage/raw-units-${formattedDate}-${zipCode}`;
    const cachedRawUnits = await AsyncStorage.getItem(storageKey);
    if (!_.isNull(cachedRawUnits)) {
      return JSON.parse(cachedRawUnits);
    }

    // Request
    const credentials = 'include';
    let response = await fetch('http://moveitsquared.com/moving', {credentials});
    let text = await response.text();
    const re = new RegExp('name="_token" value="(.+)"');
    const matches = text.match(re);
    const csrfToken = matches[1];
    const formData = new FormData();
    formData.append('_token', csrfToken);
    formData.append('zipcode', zipCode);
    response = await fetch('http://moveitsquared.com/moving/search', {
      credentials,
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const {status} = data;
    if (!_.isEqual(status, 'success')) {
      throw new Error('Error while getting data from http://moveitsquared.com/moving.');
    }
    const rawUnits = data['response'];

    // Saving response to the AsyncStorage
    await AsyncStorage.setItem(storageKey, JSON.stringify(rawUnits));

    return rawUnits;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: '#ff8080',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
    height: Metrics.screenHeight * .6,
    width: Metrics.screenWidth,
    paddingTop: 10,
  },
  modalView: {
    height: Metrics.screenHeight * .6,
    width: Metrics.screenWidth * .75,
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
  icon: {
    marginLeft: 15,
  },
  preferencesContainer: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    marginTop: 5,
  },
  itemInformation: {
    flex: 2.5,
    flexDirection: 'column',
    margin: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputs: {
    flex: .75,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pictureBox: {
    flex: .5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  picture: {
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 20,
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
});
