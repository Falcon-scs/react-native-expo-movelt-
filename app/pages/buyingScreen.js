import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';


/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class BuyingScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'Buying Screen',
  };

  constructor(props){
    super(props);
    this.state = {
      price: '',
      itemName: '',
      description: '',
      item: '',
      sellerID: '',
      convoKey: '',
      sellerName: '',
      userID: firebase.auth().currentUser.uid,
      previousMessage: false,
      image: ''
    }
    //See what props our StarWarsCard renders with
    // console.log(JSON.stringify(props));
  }

  componentDidMount() {
    this.setState({price: this.props.navigation.state.params.item.Price, itemName: this.props.navigation.state.params.item.itemName,
    item: this.props.navigation.state.params.item, sellerID: this.props.navigation.state.params.item.id,
    description: this.props.navigation.state.params.item.description, sellerName: this.props.navigation.state.params.item.seller,
    image: this.props.navigation.state.params.item.image });

    console.log("item props: " + JSON.stringify( this.props.navigation.state.params.item));
    // this.setState({description: this.props.navigation.state.params.description})
  }

  onPressMessageSeller = async () => {
    // console.log('testing message seller');
    const { navigate } = this.props.navigation.navigate;
    console.log("testing params" + this.props.navigation.state.params.item.seller);
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'Messages',
    //   params: {item: this.props.navigation.state.params.item},
    //   action: NavigationActions.navigate({routeName: 'MessagesScreen',params: {}}),
    // });
    // this.props.navigation.dispatch(navigateAction);
     // var key =
     await this.rememberMessage();
     console.log("preAdd: " +JSON.stringify(this.state.previousMessage));
     await this.add();
     console.log("convokey: " + this.state.convoKey);
     console.log("asynckey1: " + JSON.stringify(this.state.userID+this.state.sellerID));
     console.log("asynckey2: " + JSON.stringify(this.state.sellerID+this.state.userID));
     this.props.navigation.navigate('MessagesScreen', {key: this.state.convoKey});
    //query
  }



    rememberMessage = async () => {
      try {
          const key1 = await AsyncStorage.getItem(this.state.userID+this.state.sellerID);
          console.log("key1: " + key1);
          const key2 = await AsyncStorage.getItem(this.state.sellerID+this.state.userID);
          console.log("key2: " + key2);
          if (key1 !== null ) {
            this.setState({convoKey: key1, previousMessage: true });
          }
          if (key2 !== null) {
            this.setState({convoKey: key2, previousMessage: true })
          }
      } catch (error) {
        console.log(error);
      }
    }

  add = async () => {
    // console.log(firebase.database().ref('users').child(this.state.key).child('rooms').child('roomName');
      // console.log("previousMessage: " + this.state.previousMessage);
      if (this.state.previousMessage === false) {
        console.log("enters if statement");
        var roomsList = firebase.database().ref('users').child(this.state.sellerID).child('rooms').push();
        console.log("preset rooms list");
        await roomsList.set({
          roomName: firebase.auth().currentUser.displayName,
        }).then(() => this.setState({text: ""}));

        console.log("sets initial rooms list: " + roomsList.roomName);

        roomsList = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rooms').child(roomsList.key);
        await roomsList.set({
          roomName: this.state.sellerName,
        }).then(() => this.setState({text: ""}));
        console.log("sets second room list");
        await AsyncStorage.setItem(this.state.userID+this.state.sellerID, roomsList.key);
        await AsyncStorage.setItem(this.state.sellerID+this.state.userID, roomsList.key);
        console.log("sets async items");
        await this.setState({convoKey: roomsList.key});
        console.log("rooms list key: " + roomsList.key);
        return roomsList.key;
    } else {
      return this.state.convoKey;
    }
  }

  render() {

    return (
        <View style={styles.container}>

          <Card style={styles.card}
              title={this.state.itemName}
              image={{uri: this.state.image}}
              imageProps={{ resizeMode: 'contain'}}>
              <Text style={styles.textStyles}>
              Price: ${this.state.price}
              </Text>
              <Text style={styles.textStyles}>
              Description: {this.state.description}
              </Text>
              <Text style={styles.textStyles}>
              Seller Name: { this.state.sellerName}
              </Text>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                onPress={() => this.onPressMessageSeller()}
                title='MESSAGE SELLER' />

              </Card>

        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
  },
  pictureDetails: {
    flexDirection: 'column',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
