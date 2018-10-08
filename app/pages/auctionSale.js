import React, { Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SaleBlock from '../components/saleBlock';
import UploadSale from '../components/uploadSale';
import firebase from 'firebase';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


export default class AuctionSale extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Auction Sale',
    title: 'Auction Sale',
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      <UploadSale/>
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
});
