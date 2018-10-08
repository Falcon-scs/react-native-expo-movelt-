import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import {Facebook} from 'expo';


export default class Login extends React.Component {

  static navigationOptions = {
     title: 'Login',
   };

componentDidMount() {
  this.checkIfUserLoggedIn();
}

   checkIfUserLoggedIn = async() => {
       var _this = this;
       var user = firebase.auth().currentUser;
         if (user) {
           // console.warn('user already logged in');
          await AsyncStorage.setItem("hasLoggedIn", "true");
          _this.navigate('Login');
         } else {
           // console.warn('Prompt log in');
           _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
         }
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
         await AsyncStorage.setItem("hasLoggedIn", "true");
         const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
         console.log("logincheck loginscreen " + loginCheck);
       } else {
         // this.logInWithFacebook();
       }
     }

    render() {
      const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
              <View style={styles.feedbackBox}>
              <Text style={styles.textStyles}>Here at MoveItMoveIt, we appreciate your usage of the app. </Text>

              <View style={styles.buttonsRow}>


                <View>
                <MaterialCommunityIcons style={styles.icon}
                  name="home"
                  size={Metrics.icons.large}
                  color={'lightblue'}
                  onPress={() => navigate('Home')}
                />
                </View>

              </View>

                </View>
            </View>
        );
    }
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'powderblue',
      alignItems: 'center',
      justifyContent: 'center'
    },
    feedbackBox: {
      width: Metrics.screenWidth*.9,
      height: Metrics.screenHeight*.3,
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderTopLeftRadius: Metrics.screenWidth*.05,
      borderTopRightRadius: Metrics.screenWidth*.05,
      borderBottomLeftRadius: Metrics.screenWidth*.05,
      borderBottomRightRadius: Metrics.screenWidth*.05,
      backgroundColor: 'white',
    },
    textStyles: {
      fontStyle: 'italic',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 20,
      // color: 'white',
    },
    logoutButton: {
      width: Metrics.screenWidth*.7,
      height: Metrics.screenHeight*.05,
      borderWidth: 1,
      marginBottom: 55,
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
})
