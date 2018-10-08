import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import SaleBlock from '../components/saleBlock';
import { Card, ListItem, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';

const {width, height} = Dimensions.get('window');

/*
  Displays information about Jedi
*/
export default class AllGoods extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Buy Stuff',
    title: 'Buy Stuff',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'lightblue'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      hasLoggedIn: false,
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  async appendJedis(count, start) {

    firebase.database().ref('items').orderByChild("Price").on('child_added', (snapshot) => {
    var childKey = snapshot.key;
    var childData = snapshot.val();
    childData.key = childKey;
    itemName = childData.itemName.toLowerCase();
    searchTextLowercase = this.state.searchText.toLowerCase();
    var jedisList = this.state.jedisSectioned[0].data.slice();
    if ((parseInt(childData.Price) <= this.state.price) && itemName.includes(searchTextLowercase)) {
      if (this.state.currentCategory == "Click Here to Change Categories" || this.state.currentCategory == "Miscellaneous") {
        jedisList.push(childData);
      } else if (childData.category == this.state.currentCategory) {
        jedisList.push(childData);
      }
  }
    this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    // console.log(childData);
});

    // var jedisList = this.state.jedisSectioned[0].data.slice();
    // this.setState({loading: true});
    // for(i=start; i < count+start; i++) {
    //   await this.getJedi(i, jedisList);
    // }
    // this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    //do i need a for loop right here to check to see if there are duplicate values
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
    this.appendJedis(3,1);
    // console.log(this.state.jedis);
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }

  toggleModal =() => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  onPressCategory() {
    this.toggleModal();
  }

  listItemRenderer(item) {
    return (
      <SaleBlock jedi={item}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count,start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
  }

  onPressMiscellaneous = async() => {
    await this.setState({ isModalVisible: false, currentCategory: 'Miscellaneous'});
    console.log(this.state.currentCategory);

    this.resetList();
  }

  onPressElectronics = async() => {
    await this.setState({ isModalVisible: false, currentCategory: 'Electronics'});
    console.log(this.state.currentCategory);

    this.resetList();
  }

  onPressClothes = async() => {
    await this.setState({ isModalVisible: false, currentCategory: 'Clothes'});
    console.log(this.state.currentCategory);

    this.resetList();
  }

  onPressSmallItems = async() => {
    await this.setState({ isModalVisible: false, currentCategory: 'Small Items'});
    console.log(this.state.currentCategory);

    this.resetList();
  }

  purchaseItem= async (item) => {
    this.props.navigation.navigate('BuyingScreen', {item: item});
  }

  messageBlock= async (key) => {
    this.props.navigation.navigate('MessagesScreen', {key: key});
  }

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>

                <View style={styles.purchaseBox}>

                <SearchBar
                  lightTheme
                  round
                  onChangeText={(searchText) => this.setState({searchText})}
                  onClearText={console.log('')}
                  onSubmitEditing={() => this.resetList()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  containerStyle={{width: Metrics.screenWidth*.95, marginBottom: 10}}
                  placeholder='Search For Item...'
                  />

                <View style={{height: 50, width: Metrics.screenWidth*.9, justifyContent: 'center', marginBottom: 10}}>
                  <Slider
                    value={this.state.price}
                    thumbTintColor= 'lightblue'
                    minimumValue= {5}
                    maximumValue= {250}
                    value = {140}
                    step={1}
                    onValueChange={(price) => this.setState({price})}
                    onSlidingComplete={() => this.resetList()}
                   />
                  <Text>Maximum Price: ${this.state.price}</Text>
                </View>

                    <CheckBox
                      center
                      title={this.state.currentCategory}
                      iconRight
                      iconType='material'
                      checkedIcon='clear'
                      uncheckedIcon='add'
                      checkedColor='red'
                      containerStyle={{width: Metrics.screenWidth*.95}}
                      checked={this.state.checked}
                      onPress={()=> this.onPressCategory()}
                    />

                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Modal
                        isVisible={this.state.isModalVisible}
                        onBackdropPress={() => this.setState({ isModalVisible: false })}
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
                  <SectionList
                    sections={this.state.jedisSectioned}
                    // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                    renderItem={({item}) => this.listItemRenderer(item)}
                    ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
                    keyExtractor={this._keyExtractor}
                    contentContainerStyle = {{alignItems: 'center'}}
                    onRefresh = {() => this.resetList()}
                    refreshing = {this.state.refreshing}
                    removeClippedSubviews = {true}
                    ListFooterComponent = {<ActivityIndicator />}
                  />
                </View>
          </View>
      </TouchableWithoutFeedback>
    );

  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    backgroundColor: Colors.snow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: "#ff8080",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 200,
    width: Metrics.width*.9,
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
  height: Metrics.screenHeight*.6,
  width: Metrics.screenWidth,
  paddingTop: 10,
},
modalView: {
  // width: Metrics.screenWidth,
  height: Metrics.screenHeight*.6,
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
}
});
