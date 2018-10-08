import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  DatePickerAndroid,
  DatePickerIOS,
  Dimensions,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  Picker,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TimePickerAndroid,
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
import ListEmpty from '../components/list-empty';
import VehicleCard from '../components/vehicle-card';

const {width} = Dimensions.get('window');


export default class Vehicles extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {navigate} = navigation;
    return {
      headerTitle: 'Vehicles',
      title: 'Vehicles',
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
            await AsyncStorage.removeItem('vehicles/preferences');
            navigation.replace('VehiclesScreen');
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
      data: [],
      isDataLoaded: false,

      initialPurpose: 'Personal',
      isPickUpDatePickerModalHidden: true,
      initialPickUpDate: new Date(),
      isPickUpTimePickerModalHidden: true,
      initialPickUpTime: moment(new Date()).minutes(30).toDate(),
      isDropOffDatePickerModalHidden: true,
      initialDropOffDate: new Date(),
      isDropOffTimePickerModalHidden: true,
      initialDropOffTime: moment(new Date()).minutes(30).toDate(),

      maximumPrice: 150,
    };
    this._initialize()
      .catch((error) => Alert.alert(error.toString(), ''));
  }

  async _initialize() {
    await this._initializePreferences();
    const {preferences} = this.state;
    if (Vehicles._isPreferencesValid(preferences)) {
      await this._getAndUpdateData();
    }
  }

  async _initializePreferences() {
    let preferences = await Vehicles._getPreferences();
    return new Promise((resolve) => {
      this.setState({
        preferences,
        isPreferencesLoaded: true,
      }, () => resolve());
    });
  }

  static async _getPreferences() {
    const preferences = await AsyncStorage.getItem('vehicles/preferences');
    return JSON.parse(preferences);
  }

  static _isPreferencesValid(preferences) {
    const requiredKeys = [
      'purpose',
      'pickUpLocationZipCode',
      'dropOffLocationZipCode',
      'pickUpDate',
      'pickUpTime',
      'dropOffDate',
      'dropOffTime',
    ];
    if (!_.every(requiredKeys, (key) => _.has(preferences, key))) {
      return false;
    }
    const {
      purpose,
      pickUpLocationZipCode,
      dropOffLocationZipCode,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    } = preferences;
    if (!this._isValidPurpose(purpose)) {
      return false;
    }
    if (!_.isInteger(pickUpLocationZipCode)) {
      return false;
    }
    if (!_.isInteger(dropOffLocationZipCode)) {
      return false;
    }
    if (!this._isValidDate(pickUpDate)) {
      return false;
    }
    if (!this._isValidTimeInHours(pickUpTime)) {
      return false;
    }
    if (!this._isValidDate(dropOffDate)) {
      return false;
    }
    if (!this._isValidTimeInHours(dropOffTime)) {
      return false;
    }
    return true;
  }

  static _isValidPurpose(purpose) {
    return _.isEqual(purpose, 'Personal')
      || _.isEqual(purpose, 'Business');
  }

  static _isValidDate(date) {
    const parsedDate = moment(date, 'MM/DD/YYYY');
    return _.isEqual(parsedDate.format('MM/DD/YYYY'), date);
  }

  static _isValidTimeInHours(timeInHours) {
    if (!_.isFinite(timeInHours)) return false;
    const hours = _.toInteger(timeInHours);
    const minutes = timeInHours % 1 * 60;
    const parsedTime = moment(`${hours}:${minutes}`, 'kk:mm');
    if (!_.isEqual(hours, parsedTime.get('hours'))) {
      return false;
    }
    if (!_.isEqual(minutes, parsedTime.get('minutes'))) {
      return false;
    }
    return true;
  }

  async _updateData(rawData) {
    const data = [];
    for (let i = 0; i < rawData.length; i++) {
      const price = Number.parseInt(rawData[i]['price']);
      const description = rawData[i]['description'];
      const size = rawData[i]['size'];
      const photoUri = rawData[i]['img_src'];
      const site = rawData[i]['site'];
      const vehicle = {
        description,
        price,
        size,
        photoUri,
        site,
      };
      if (!Vehicles._isVehicleValid(vehicle)) continue;
      data.push(vehicle);
    }
    this.setState({data});
  }

  static _isVehicleValid(vehicle) {
    const requiredKeys = [
      'description',
      'price',
      'size',
      'photoUri',
      'site',
    ];
    if (!_.every(requiredKeys, (key) => _.has(vehicle, key))) {
      return false;
    }
    const {
      price,
      description,
      size,
      photoUri,
      site,
    } = vehicle;
    return _.isFinite(price)
      && _.isString(description)
      && _.isString(size)
      && _.isString(photoUri)
      && _.isString(site);
  }

  async _getAndUpdateData() {
    const {preferences} = this.state;
    const {
      purpose,
      pickUpLocationZipCode,
      dropOffLocationZipCode,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    } = preferences;
    this.setState({
      isDataLoaded: false,
    });
    try {
      const rawData = await Vehicles._getRawData(
        purpose,
        pickUpLocationZipCode,
        dropOffLocationZipCode,
        pickUpDate,
        pickUpTime,
        dropOffDate,
        dropOffTime,
      );
      await this._updateData(rawData);
    } catch (error) {
      Alert.alert(error.toString(), '');
    }
    this.setState({
      isDataLoaded: true,
    });
  }

  _renderListItem(item) {
    const {navigate} = this.props.navigation;
    return (
      <VehicleCard
        vehicle={item}
        onCardPressed={() => navigate('VehicleScreen', {vehicle: item})}
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
    if (!Vehicles._isPreferencesValid(preferences)) {
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
                  style={{fontSize: 24, fontWeight: 'bold', color: 'lightblue', textAlign: 'center'}}>
                  Find Your Ideal Moving Vehicle!
                </Text>
              </View>
              <View style={styles.itemInformation}>
                <View style={styles.dateTimePickers}>
                    {this._getPickUpDatePickerModal()}
                    {this._getPickUpTimePickerModal()}
                    {this._getDropOffDatePickerModal()}
                    {this._getDropOffTimePickerModal()}
                    <Button
                      title={'Pick Up Date: ' + moment(this.state.initialPickUpDate).format('MM.DD.YYYY')}
                      color='powderblue'
                      onPress={() => this._showPickUpDatePickerModal()}
                    />
                    <Button
                      title={'Pick Up Time: ' + moment(this.state.initialPickUpTime).format('hh:mm a')}
                      color='powderblue'
                      onPress={() => this._showPickUpTimePickerModal()}
                    />
                    <Button
                      title={'Drop Off Date: ' + moment(this.state.initialDropOffDate).format('MM.DD.YYYY')}
                      color='powderblue'
                      onPress={() => this._showDropOffDatePickerModal()}
                    />
                    <Button
                      title={'Drop Off Time: ' + moment(this.state.initialDropOffTime).format('hh:mm a')}
                      color='powderblue'
                      onPress={() => this._showDropOffTimePickerModal()}
                    />
                  </View>
                <View style={styles.textInputs}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Pick Up Location Zip Code (ex: 94309)"
                    underlineColorAndroid="transparent"
                    keyboardType='numeric'
                    onChangeText={(zipCode) => this._onInitialPickUpLocationZipCodeChanged(zipCode)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Drop Off Location Zip Code (ex: 94309)"
                    underlineColorAndroid="transparent"
                    keyboardType='numeric'
                    onChangeText={(zipCode) => this._onInitialDropOffLocationZipCodeChanged(zipCode)}
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
                    Search
                  </Text>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      );
    }
    const {data, isDataLoaded} = this.state;
    if (!isDataLoaded) {
      return (<Loading/>);
    }
    const {
      pickUpLocationZipCode,
      dropOffLocationZipCode,
    } = preferences;
    const {maximumPrice} = this.state;
    const filteredData = data.filter((vehicle) => vehicle.price <= maximumPrice);
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
                value={this.state.pickUpLocationZipCode || pickUpLocationZipCode.toString()}
                placeholder="Pick Up Location Zip Code"
                containerStyle={{flex: 1}}
                onChangeText={(zipCode) => this._onPickUpLocationZipCodeChanged(zipCode)}
              />
              <Button
                title="Save"
                color="powderblue"
                onPress={() => this._onSaveZipCodeButtonPressed()}
              />
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <FormInput
                value={this.state.dropOffLocationZipCode || dropOffLocationZipCode.toString()}
                placeholder="Drop Off Location Zip Code"
                containerStyle={{flex: 1}}
                onChangeText={(zipCode) => this._onDropOffLocationZipCodeChanged(zipCode)}
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
              data={filteredData}
              renderItem={({item}) => this._renderListItem(item)}
              keyExtractor={Vehicles._extractKey}
              ItemSeparatorComponent={() => (<View style={{height: 10}}/>)}
              ListEmptyComponent={<ListEmpty/>}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _getInitialPurposePicker() {
    const {initialPurpose} = this.state;
    return Platform.select({
      ios: (
        <Picker
          selectedValue={initialPurpose}
          style={{height: 40, flex: 1}}
          itemStyle={{height: 40}}
          onValueChange={(initialPurpose) => this.setState({initialPurpose})}>
          <Picker.Item label="Personal" value="Personal" color="powderblue"/>
          <Picker.Item label="Business" value="Business" color="powderblue"/>
        </Picker>
      ),
      android: (
        <Picker
          selectedValue={initialPurpose}
          onValueChange={(initialPurpose) => this.setState({initialPurpose})}>
          <Picker.Item label="Personal" value="Personal" color="powderblue"/>
          <Picker.Item label="Business" value="Business" color="powderblue"/>
        </Picker>
      ),
    });
  }

  _getPickUpDatePickerModal() {
    if (_.isEqual(Platform.OS, 'android')) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!this.state.isPickUpDatePickerModalHidden}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <DatePickerIOS
            date={this.state.initialPickUpDate}
            mode="date"
            onDateChange={(initialPickUpDate) => this.setState({initialPickUpDate})}
          />
          <View>
            <Button
              title="Save"
              onPress={() => this._hidePickUpDatePickerModal()}
            />
          </View>
        </View>
      </Modal>
    );
  }

  async _showPickUpDatePickerModal() {
    if (_.isEqual(Platform.OS, 'ios')) {
      this.setState({isPickUpDatePickerModalHidden: false});
    } else {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.initialPickUpDate,
      });
      if (!_.isEqual(action, DatePickerAndroid.dismissedAction)) {
        this.setState({
          initialPickUpDate: new Date(+year, +month, +day),
        });
      }
    }
  }

  _hidePickUpDatePickerModal() {
    this.setState({isPickUpDatePickerModalHidden: true});
  }

  _getDropOffDatePickerModal() {
    if (_.isEqual(Platform.OS, 'android')) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!this.state.isDropOffDatePickerModalHidden}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <DatePickerIOS
            date={this.state.initialDropOffDate}
            mode="date"
            onDateChange={(initialDropOffDate) => this.setState({initialDropOffDate})}
          />
          <View>
            <Button
              title="Save"
              onPress={() => this._hideDropOffDatePickerModal()}
            />
          </View>
        </View>
      </Modal>
    );
  }

  async _showDropOffDatePickerModal() {
    if (_.isEqual(Platform.OS, 'ios')) {
      this.setState({isDropOffDatePickerModalHidden: false});
    } else {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.initialDropOffDate,
      });
      if (!_.isEqual(action, DatePickerAndroid.dismissedAction)) {
        this.setState({
          initialDropOffDate: new Date(+year, +month, +day),
        });
      }
    }
  }

  _hideDropOffDatePickerModal() {
    this.setState({isDropOffDatePickerModalHidden: true});
  }

  _getPickUpTimePickerModal() {
    if (_.isEqual(Platform.OS, 'android')) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!this.state.isPickUpTimePickerModalHidden}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <DatePickerIOS
            date={this.state.initialPickUpTime}
            mode="time"
            minuteInterval={15}
            onDateChange={(initialPickUpTime) => this.setState({initialPickUpTime})}
          />
          <View>
            <Button
              title="Save"
              onPress={() => this._hidePickUpTimePickerModal()}
            />
          </View>
        </View>
      </Modal>
    );
  }

  async _showPickUpTimePickerModal() {
    if (_.isEqual(Platform.OS, 'ios')) {
      this.setState({isPickUpTimePickerModalHidden: false});
    } else {
      const time = moment(this.state.initialPickUpTime);
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: time.hours(),
        minute: time.minutes(),
      });
      if (!_.isEqual(action, TimePickerAndroid.dismissedAction)) {
        time.hours(+hour);
        time.minutes(+minute);
        this.setState({
          initialPickUpTime: time.toDate(),
        });
      }
    }
  }

  _hidePickUpTimePickerModal() {
    this.setState({isPickUpTimePickerModalHidden: true});
  }

  _getDropOffTimePickerModal() {
    if (_.isEqual(Platform.OS, 'android')) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!this.state.isDropOffTimePickerModalHidden}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <DatePickerIOS
            date={this.state.initialDropOffTime}
            mode="time"
            minuteInterval={15}
            onDateChange={(initialDropOffTime) => this.setState({initialDropOffTime})}
          />
          <View>
            <Button
              title="Save"
              onPress={() => this._hideDropOffTimePickerModal()}
            />
          </View>
        </View>
      </Modal>
    );
  }

  async _showDropOffTimePickerModal() {
    if (_.isEqual(Platform.OS, 'ios')) {
      this.setState({isDropOffTimePickerModalHidden: false});
    } else {
      const time = moment(this.state.initialDropOffTime);
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: time.hours(),
        minute: time.minutes(),
      });
      if (!_.isEqual(action, TimePickerAndroid.dismissedAction)) {
        time.hours(+hour);
        time.minutes(+minute);
        this.setState({
          initialDropOffTime: time.toDate(),
        });
      }
    }
  }

  _hideDropOffTimePickerModal() {
    this.setState({isDropOffTimePickerModalHidden: true});
  }

  async _onSavePreferencesButtonPressed() {
    const {
      initialPurpose,
      initialPickUpLocationZipCode,
      initialDropOffLocationZipCode,
      initialPickUpDate,
      initialPickUpTime,
      initialDropOffDate,
      initialDropOffTime,
    } = this.state;
    const purpose = initialPurpose;
    const pickUpLocationZipCode = Number.parseInt(initialPickUpLocationZipCode);
    const dropOffLocationZipCode = Number.parseInt(initialDropOffLocationZipCode);
    const pickUpDate = moment(initialPickUpDate).format('MM/DD/YYYY');
    const pickUpTime = Vehicles._convertTimeToTimeInHours(moment(initialPickUpTime));
    const dropOffDate = moment(initialDropOffDate).format('MM/DD/YYYY');
    const dropOffTime = Vehicles._convertTimeToTimeInHours(moment(initialDropOffTime));
    const preferences = {
      purpose,
      pickUpLocationZipCode,
      dropOffLocationZipCode,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    };
    if (!Vehicles._isPreferencesValid(preferences)) return;
    await AsyncStorage.setItem('vehicles/preferences', JSON.stringify(preferences));
    this.setState({
      preferences,
      isPreferencesLoaded: true,
    }, () => this._getAndUpdateData());
  }

  static _convertTimeToTimeInHours(time) {
    return time.hours() + time.minutes() / 60;
  }

  _onPickUpLocationZipCodeChanged(pickUpLocationZipCode) {
    this.setState({pickUpLocationZipCode});
  }

  _onDropOffLocationZipCodeChanged(dropOffLocationZipCode) {
    this.setState({dropOffLocationZipCode});
  }

  async _onSaveZipCodeButtonPressed() {
    let pickUpLocationZipCode = Number.parseInt(this.state.pickUpLocationZipCode);
    let dropOffLocationZipCode = Number.parseInt(this.state.dropOffLocationZipCode);
    if (!_.isFinite(pickUpLocationZipCode)) {
      pickUpLocationZipCode = this.state.preferences.pickUpLocationZipCode;
    }
    if (!_.isFinite(dropOffLocationZipCode)) {
      dropOffLocationZipCode = this.state.preferences.dropOffLocationZipCode;
    }
    this.setState({isDataLoaded: false});
    const {
      purpose,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    } = this.state.preferences;
    let rawData;
    try {
      rawData = await Vehicles._getRawData(
        purpose,
        pickUpLocationZipCode,
        dropOffLocationZipCode,
        pickUpDate,
        pickUpTime,
        dropOffDate,
        dropOffTime,
      );
    } catch (error) {
      Alert.alert(error.toString(), '');
      return this.setState({isDataLoaded: true});
    }
    await this._updateData(rawData);
    const preferences = {
      purpose,
      pickUpLocationZipCode,
      dropOffLocationZipCode,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    };
    this.setState({
      preferences,
      isDataLoaded: true,
    });
  }

  _onMaximumPriceChanged(maximumPrice) {
    if (!_.isFinite(maximumPrice)) return;
    this.setState({maximumPrice});
  }

  static async _getRawData(
    purpose,
    pickUpLocationZipCode,
    dropOffLocationZipCode,
    pickUpDate,
    pickUpTime,
    dropOffDate,
    dropOffTime,
  ) {
    // Getting cache from the AsyncStorage
    const formattedDate = moment().format('DD-MM-YYYY-HH');
    const storageKey = `vehicles/raw-data-${formattedDate}-${[
      purpose,
      pickUpLocationZipCode,
      dropOffLocationZipCode,
      pickUpDate,
      pickUpTime,
      dropOffDate,
      dropOffTime,
    ].join('-')}`;
    const cachedRawData = await AsyncStorage.getItem(storageKey);
    if (!_.isNull(cachedRawData)) {
      return JSON.parse(cachedRawData);
    }

    // Request
    const credentials = 'include';
    let response = await fetch('http://moveitsquared.com/vehicle', {credentials});
    let text = await response.text();
    const re = new RegExp('name="_token" value="(.+)"');
    const matches = text.match(re);
    const csrfToken = matches[1];
    const formData = new FormData();
    formData.append('_token', csrfToken);
    formData.append('purpose', purpose);
    formData.append('pickuplocation', pickUpLocationZipCode);
    formData.append('pickupdate', pickUpDate);
    formData.append('pickuptime', pickUpTime);
    formData.append('dropofflocation', dropOffLocationZipCode);
    formData.append('dropoffdate', dropOffDate);
    formData.append('dropofftime', dropOffTime);
    response = await fetch('http://moveitsquared.com/vehicle/search', {
      credentials,
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const {status} = data;
    if (!_.isEqual(status, 'success')) {
      throw new Error('Can\'t get data from http://moveitsquared.com/vehicle.');
    }
    const rawData = data['response'];

    // Saving response to the AsyncStorage
    await AsyncStorage.setItem(storageKey, JSON.stringify(rawData));

    return rawData;
  }

  _onInitialPickUpLocationZipCodeChanged(initialPickUpLocationZipCode) {
    this.setState({initialPickUpLocationZipCode});
  }

  _onInitialDropOffLocationZipCodeChanged(initialDropOffLocationZipCode) {
    this.setState({initialDropOffLocationZipCode});
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
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dateTimePickers: {
    flex: 1.5,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInputs: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pictureBox: {
    flex: .4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
