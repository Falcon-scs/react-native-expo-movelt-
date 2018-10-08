import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight, WebView} from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class VehiclesScreen extends React.Component {

  static navigationOptions = {
    title: 'Vehicles Screen',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container} >
      <Text> Vehicles Screen </Text>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  checklistView: {
    flex: 1,
    backgroundColor: 'salmon',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderRightWidth: 1,
  },
  checklistText: {
    color: 'white',
    fontSize: 25,
    alignItems: 'center',
    padding: 26,
  },
  vehiclesView: {
    flex: 1,
    backgroundColor: 'blanchedalmond',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
  },
  vehiclesText: {
    color: 'white',
    fontSize: 25,
    padding: 26,
  },
  movingHelpView: {
    flex: 1,
    backgroundColor: 'indianred',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderStyle: 'solid',
   borderTopWidth: 1,
  },
  movingHelpText: {
    color: 'white',
    fontSize: 25,
    padding: 26,
  },
  storageView: {
    flex: 1,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
   borderTopWidth: 1,
  },
  storageText: {
    color: 'white',
    fontSize: 25,
    padding: 26,
  },
});
