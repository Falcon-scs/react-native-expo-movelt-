import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Dimensions,
  FlatList,
  Keyboard, Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as _ from 'lodash';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import {Feather} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MovingBlock from '../components/movingBlock';
import axios from 'axios';
import {FormInput} from 'react-native-elements';
import Loading from '../components/loading';
import MovingCompanyCard from '../components/moving-company-card';


const {width} = Dimensions.get('window');

/*
  Displays information about Jedi
*/
export default class MovingCompanies extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {navigate} = navigation;
    return {
      headerTitle: 'Moving Companies',
      title: 'Moving Companies',
      headerLeft: (
        <Feather
          style={styles.icon}
          name="menu"
          size={Metrics.icons.medium}
          color={'lightblue'}
          onPress={() => navigate('DrawerToggle')}
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      offset: 0,
      limit: 10,
      data: [],
      zipCode: null,
    };
  }

  async componentDidMount() {
    const zipCode = +(await AsyncStorage.getItem('movingCompanies/zipCode'));
    if (!_.isFinite(zipCode)) {
      return this.setState({
        isDataLoaded: true,
      });
    }
    this.setState({
      zipCode,
    }, () => this._resetData());
  }

  _renderListItem(item) {
    const {navigate} = this.props.navigation;
    return (
      <MovingCompanyCard
        jedi={item}
        onCardPressed={() => navigate('MovingCompanyScreen', {jedi: item})}
        onButtonPressed={() => Linking.openURL(item['url'])}
      />
    );
  }

  static _extractKey(item, index) {
    return index.toString();
  }

  render() {
    const {zipCode} = this.state;
    let isRequiredFieldsFilled = _.isFinite(zipCode);
    const {
      isDataLoaded,
      data,
    } = this.state;
    if (!isDataLoaded) {
      return (<Loading/>);
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.purchaseBox}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <FormInput
                value={this.zipCodeTextInputValue || _.isFinite(zipCode) ? zipCode.toString() : ''}
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

          </View>

          <View style={styles.itemList}>
            {isRequiredFieldsFilled
              ? (
                <FlatList
                  data={data}
                  renderItem={({item}) => this._renderListItem(item)}
                  keyExtractor={MovingCompanies._extractKey}
                  contentContainerStyle={{alignItems: 'center'}}
                  ListEmptyComponent={<Text>The list is empty.</Text>}
                  ItemSeparatorComponent={() => (<View style={{height: 10}}/>)}
                  ListFooterComponent={<ActivityIndicator/>}
                  onEndReached={() => this._appendData()}
                />
              )
              : (
                <View style={{alignItems: 'center'}}>
                  <Text>Please fill required fields.</Text>
                </View>
              )
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _onZipCodeChanged(zipCodeTextInputValue) {
    this.setState({zipCodeTextInputValue});
  }

  async _onSaveZipCodeButtonPressed() {
    const {zipCodeTextInputValue} = this.state;
    const zipCode = _.toInteger(zipCodeTextInputValue);
    if (!_.isFinite(zipCode)) return;
    await AsyncStorage.setItem('movingCompanies/zipCode', zipCode.toString());
    this.setState({
      offset: 0,
      zipCode,
    }, () => this._resetData());
  }

  static async _getData(zipCode, offset = 0, limit = 10) {
    const config = {
      headers: {'Authorization': 'Bearer' + ' seLNca0HOVX5jAVvi_Fz6YjBCHh7qklq2-bgXmK92gRX_37KbTBewIUjHTav4Sv1UUZtv8feAarIaqQGJqd8sdEAX_iVxucHiDRVHTXBhJ_IFLSug7ExYCwsM5HVWnYx'},
      params: {
        term: 'moving',
        location: zipCode,
        categories: 'moving,storage',
        offset,
        limit,
      },
    };
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', config);
    return response['data'];
  }

  async _resetData() {
    this.setState({
      isDataLoaded: false,
    });
    const {zipCode} = this.state;
    const rawData = await MovingCompanies._getData(zipCode);
    this.setState({
      zipCode,
      isDataLoaded: true,
      offset: 0,
      limit: 10,
      data: rawData['businesses'],
    });
  }

  async _appendData() {
    const {zipCode, data} = this.state;
    const {offset, limit} = this.state;
    const rawData = await MovingCompanies._getData(zipCode, offset, limit);
    this.setState({
      zipCode,
      offset: offset + limit,
      data: [...data, ...rawData['businesses']],
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    backgroundColor: Colors.snow,
    alignItems: 'center',
    // justifyContent: 'center',
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
    marginTop: 20,
    // height: 200,
    width: Metrics.width * .9,
    marginBottom: 16,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
    // height: Metrics.screenHeight * .6,
    // width: Metrics.screenWidth,
    // paddingTop: 10,
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
  icon: {
    marginLeft: 15,
  },
});
