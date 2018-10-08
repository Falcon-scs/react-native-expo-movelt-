import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class MovingHelp extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Moving Help',
    title: 'Moving Help',
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
      <View style={styles.container} >

        <View style = {{flex: 1}}>

          <TouchableHighlight
            style= {styles.movingCompaniesView}
            onPress={() => navigate('MovingCompanies')}>
              <View>
              <Text style = {styles.movingCompaniesText}>Moving Companies</Text>
              </View>
            </TouchableHighlight>

          <TouchableHighlight
            style= {styles.freelanceMoversView}
            onPress={() => navigate('Freelancers')}>
              <View>
              <Text style = {styles.freelanceMoversText}>Freelancers</Text>
              </View>
          </TouchableHighlight>

          <TouchableHighlight
            style= {styles.movingGroupView}
            onPress={() => navigate('Freelancers')}>
              <View>
              <Text style = {styles.movingGroupText}>Moving Group</Text>
              </View>
          </TouchableHighlight>


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
  movingCompaniesView: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movingCompaniesText: {
    color: 'white',
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },
  freelanceMoversView: {
    flex: 1,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freelanceMoversText: {
    color: 'white',
    fontSize: 30,
    padding: 26,
  },
  movingGroupView: {
    flex: 1,
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movingGroupText: {
    color: 'white',
    fontSize: 30,
    padding: 26,
  },
});
