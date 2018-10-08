import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, AsyncStorage, SafeAreaView } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import {Facebook} from 'expo';
import * as pages from './app/pages';
import firebase from 'firebase';

var config = {
   apiKey: "AIzaSyAjJJd4fyALGsqWOWm9Zvzbl-SNEuBD7bs",
   authDomain: "moveitmoveit-6eae6.firebaseapp.com",
   databaseURL: "https://moveitmoveit-6eae6.firebaseio.com",
   projectId: "moveitmoveit-6eae6",
   storageBucket: "moveitmoveit-6eae6.appspot.com",
   messagingSenderId: "351037547905"
 };
 firebase.initializeApp(config);

 const MessagesNav = StackNavigator({
   MessagesScreen: {screen: pages.Messages},
   MessageTableViewScreen: {screen: pages.MessagesList}
 },{
   initialRouteName: 'MessageTableViewScreen',
   title: 'Messages',
 });

const HomeNav = TabNavigator({
  LeaderBoard: { screen: pages.LeaderBoard },
  Feedback: {screen: pages.Feedback},
}, {
  // Default config for all screens
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
  initialRouteName: 'LeaderBoard',
});

const HomeStackNav = StackNavigator({
  Home: {screen: HomeNav},
}, {
  title: 'Home',
});

const VehiclesNav = StackNavigator({
  VehiclesScreen: {screen: pages.Vehicles},
  VehicleScreen: {screen: pages.Vehicle}
});

const StorageNav = StackNavigator({
  StorageUnitsScreen: {screen: pages.StorageUnits},
  StorageUnitScreen: {screen: pages.StorageUnit},
});

const AllGoodsNav = StackNavigator({
  AllGoodsScreen: {screen: pages.AllGoods},
  BuyingScreen: {screen: pages.BuyingScreen},
  MessagesScreen: {screen: pages.Messages},
});

const FlatSaleNav = StackNavigator({
  FlatSaleScreen: {screen: pages.FlatSale},
  SellersThankYou: {screen: pages.Sellers}
});

const AuctionSaleNav = StackNavigator({
  AuctionSaleScreen: {screen: pages.AuctionSale},
});

const SkillsNav = StackNavigator({
  SkillsScreen: {screen: pages.Skills},
  SellersThankYou: {screen: pages.Sellers}
});

const FreelancersNav = StackNavigator({
  FreelancersScreen: {screen: pages.Freelancers},
  SkillsPurchaseScreen: {screen: pages.SkillsPurchaseScreen},
  MessagesScreen: {screen: pages.Messages},
});

const PostGroupsNav = StackNavigator({
  PostGroupsScreen: {screen: pages.PostGroups},
  SellersThankYou: {screen: pages.Sellers}
});

const MovingGroupsNav = StackNavigator({
  FindGroupsScreen: {screen: pages.FindGroups},
  MovingGroupPurchaseScreen: {screen: pages.MovingGroupPurchaseScreen},
  MessagesScreen: {screen: pages.Messages},
});

const MovingCompaniesNav = StackNavigator({
  MovingCompaniesScreen: {screen: pages.MovingCompanies},
  MovingCompanyScreen: {screen: pages.MovingCompany}
});

const PrimaryNav = DrawerNavigator({
  Home: { screen: HomeStackNav},
  Login: { screen: pages.Login},
  Messages: {screen: MessagesNav},
  Vehicles: {screen: VehiclesNav},
  Storage: {screen: StorageNav},
  MovingCompanies: {screen: MovingCompaniesNav},
  AllGoods: {screen: AllGoodsNav},
  FlatSale: {screen: FlatSaleNav},
  Skills: {screen: SkillsNav},
  Freelancers: {screen: FreelancersNav},
  PostMovingGroup: {screen: PostGroupsNav},
  FindMovingGroups: {screen: MovingGroupsNav},
  Logout: {screen: pages.Logout},
}, {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});


export default class App extends React.Component {

  state = {
    hasDoneOnboarding: false,
    hasLoggedIn: true,
  }

  componentDidMount() {
    this.rememberOnboarding();
    // this.checkIfUserLoggedIn();
    // console.log(JSON.stringify(this.state.hasDoneOnboarding));
  }

  checkIfUserLoggedIn() {
      var _this = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // console.warn('user already logged in');
        } else {
          // console.warn('Prompt log in');
          _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
        }
      });
    }

    async logInWithFacebook() {
      //This line obtains a token. A good guide on how to set up Facebook login
      // could be found on Expo website https://docs.expo.io/versions/latest/sdk/facebook.html
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('344994569331151', {permissions: ['public_profile', 'email'],});
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const name = (await response.json()).name;
        //Signs up the user in Firebase authentication. Before being able to use
        //this make sure that you have Facebook enabled in the sign-in methods
        // in Firebase
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        var result = await firebase.auth().signInWithCredential(credential);

        //After signing in/up, we add some additional user info to the database
        //so that we can use it for other things, e.g. users needing to know
        //names of each other
        firebase.database().ref('users').child(result.uid).child('name').set(name);
      } else {
        this.logInWithFacebook();
      }
    }


  rememberOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding');
      await this.setState({hasDoneOnboarding: JSON.parse(completed)})
    } catch (error) {
      console.log(error);
    }
  }

  _onDone = async () => {
    await this.setState({hasDoneOnboarding: true});
    await AsyncStorage.setItem('onboarding', JSON.stringify(true));
    console.log(this.state.hasDoneOnboarding);
  }


  render() {
    if(this.state.hasDoneOnboarding && this.state.hasLoggedIn) {
      console.log(this.state.hasDoneOnboarding);
      return (
        <PrimaryNav />
      );
    } else {
      return (
          <pages.Onboarding onDone={this._onDone} />
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
