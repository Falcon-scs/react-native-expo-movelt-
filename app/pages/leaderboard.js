import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  SectionList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import LeaderBoardBlock from '../components/leaderboardBlock';
import firebase from 'firebase';
import {Feather} from '@expo/vector-icons';
import * as _ from 'lodash';
import LoggedOut from '../components/loggedOutScreen';

const {width, height} = Dimensions.get('window');

/*
  Displays information about Jedi
*/
export default class LeaderBoard extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {navigate} = navigation;
    return {
      headerTitle: 'LeaderBoard',
      headerLeft: (
        <Feather style={styles.icon}
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
      jedisSectioned: [{title: 'Jedis', data: []}],
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

//     firebase.database().ref('leaderboard').orderByChild("points").on('child_added', (snapshot) => {
//     var childKey = snapshot.key;
//     var childData = snapshot.val();
//     childData.key = childKey;
//     var jedisList = this.state.jedisSectioned[0].data.slice();
//     jedisList.push(childData);
//     this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
//     // console.log(childData);
// });

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
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }

  componentDidMount() {
    const usersRef = firebase.database().ref('users');
    this._updateData(usersRef);
    usersRef.on('child_added', () => this._updateData(usersRef));
    usersRef.on('child_changed', () => this._updateData(usersRef));
    usersRef.on('child_removed', () => this._updateData(usersRef));
    usersRef.on('child_moved', () => this._updateData(usersRef));
  }

  async _updateData(usersRef) {
    await usersRef.orderByChild('points').limitToFirst(10).once('value', (snapshot) => {
      const users = [];
      snapshot.forEach((snapshot) => {
        users.push(snapshot.val());
      });
      this.setState({
        loading: false,
        refreshing: false,
        jedisSectioned: [{
          title: 'Jedis',
          data: _.reverse(users),
        }],
      });
    });
  }

  listItemRenderer(item, index) {
    return (
      <LeaderBoardBlock jedi={item} place={index + 1}/>
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count, start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data: []}]});
    this.appendJedis(3, 1);
  }

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

          <View style={styles.purchaseBox}>

            <Text style={styles.textStyles}>
              Here at MoveItMoveIt, we love to celebrate our users. Here are the top point getters. (Earn points via
              selling items or skills).
              Top point earners could be rewarded. :)
            </Text>

          </View>

          <View style={styles.itemList}>
            <SectionList
              sections={this.state.jedisSectioned}
              // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
              renderItem={({item, index}) => this.listItemRenderer(item, index)}
              ItemSeparatorComponent={() => (<View style={{height: 10}}/>)}
              keyExtractor={this._keyExtractor}
              contentContainerStyle={{alignItems: 'center'}}
              onRefresh={() => this.resetList()}
              refreshing={this.state.refreshing}
              removeClippedSubviews={true}
              ListFooterComponent={<ActivityIndicator/>}
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
    backgroundColor: 'powderblue',
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
    marginTop: 80,
    // height: 200,
    // width: Metrics.width*.9,
    // paddingTop: 20,

  },
  textStyles: {
    fontStyle: 'italic',
    alignItems: 'center',
    textAlign: 'center',
    // color: 'white',
  },
  itemList: {
    height: Metrics.screenHeight * .8,
    width: Metrics.screenWidth,
    paddingTop: 10,
  },
  icon: {
    marginLeft: 15,
  },
});
