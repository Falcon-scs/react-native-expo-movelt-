import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';




export default class Buyers extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Buyers',
    title: 'Buyers',
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
              <View style={styles.feedbackBox}>
              <Text style={styles.textStyles}>Here at MoveItMoveIt, we appreciate your usage of the app. Congrats on earning blank points. </Text>

              <View style={styles.buttonsRow}>
                <MaterialCommunityIcons style={styles.icon}
                  name="home"
                  size={Metrics.icons.large}
                  color={'lightblue'}
                  onPress={() => navigate('Home')}
                />

                <FontAwesome style={styles.icon}
                  name="shopping-cart"
                  size={Metrics.icons.large}
                  color={'lightblue'}
                  onPress={() => navigate('AllGoods')}
                />
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
      height: Metrics.screenHeight*.4,
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
    buttonsRow: {
      width: Metrics.screenWidth*.7,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
    },
})
