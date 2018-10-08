import React, { Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import UploadGroups from '../components/uploadGroups';
import firebase from 'firebase';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


//import Main from './app/components/Main';


export default class Groups extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Post Moving Group',
    title: 'Post Moving Group',
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
        <UploadGroups purchaseConfirmation={this.purchaseConfirmation}/>
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
