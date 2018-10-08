import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class Moving extends React.Component {

  static navigationOptions = {
    title: 'Moving',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container} >

    <View style = {{flex: 1, flexDirection: 'row'}}>

    <View style = {{flex: 1, flexDirection: 'column'}}>
          <View style = {{flex: 1, flexDirection: 'row'}}>
            <TouchableHighlight
              style= {styles.checklistView}
              onPress={() => navigate('Checklist')}>
                <View>
                <Text style = {styles.checklistText}>Checklist</Text>
                </View>
              </TouchableHighlight>
            </View>

           <View style = {{flex: 2, flexDirection: 'row'}}>
                <TouchableHighlight
                  style={styles.vehiclesView}
                  onPress={() => navigate('Vehicles')}>
                    <View>
                    <Text style = {styles.vehiclesText}>Vehicles</Text>
                    </View>
                </TouchableHighlight>
                </View>

              </View>

      <View style = {{flex: 1, flexDirection: 'column'}}>
          <View style = {{flex: 2, flexDirection: 'row'}}>
            <TouchableHighlight
              style= {styles.storageView}
              onPress={() => navigate('Storage')}>
                <View>
                <Text style = {styles.storageText}>Storage Units</Text>
                </View>
              </TouchableHighlight>
              </View>

            <View style = {{flex: 1, flexDirection: 'row'}}>
                <TouchableHighlight
                  style= {styles.movingHelpView}
                  onPress={() => navigate('MovingHelp')}>
                    <View>
                    <Text style = {styles.movingHelpText}>Moving Help</Text>
                    </View>
                  </TouchableHighlight>
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
