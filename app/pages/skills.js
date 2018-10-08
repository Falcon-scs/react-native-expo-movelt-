import React, { Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import UploadSkills from '../components/uploadSkills';
import firebase from 'firebase';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


//import Main from './app/components/Main';


export default class Skills extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Post Skills',
    title: 'Post Skills',
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

  purchaseConfirmation= async (price, name) => {
    this.props.navigation.navigate('SellersThankYou', {price:price, itemName: name});
  }

  render() {
    return (
      <View style={styles.container}>
        <UploadSkills purchaseConfirmation={this.purchaseConfirmation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 15,
  }
});
