import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Onboarding from 'react-native-onboarding-swiper';

export default class OnboardingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  static propTypes = {
      onDone: PropTypes.func.isRequired
  };

  _onDone = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Onboarding
          showSkip={false}
          onDone= {this._onDone}
          pages={[
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.movingCompanyImage} />,
              title: 'MoveItMoveIt',
              subtitle: 'Welcome to MoveItMoveIt, Your One Stop Shop Moving App!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.storageUnitImage} />,
              title: 'Moving',
              subtitle: 'You can find the lowest priced storage units and moving companies in your area!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.vehicleImage} />,
              title: 'Messages',
              subtitle: 'You can even find the lowest priced moving vehicles near you!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.buyStuffImage} />,
              title: 'Buy Things',
              subtitle: 'On the app its super easy to buy and sell stuff!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.freelancerImage} />,
              title: 'Freelancers',
              subtitle: 'You can even find freelancers to help you with anything!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.login} />,
              title: 'Login',
              subtitle: 'For full app functionality, it is best to login. However, you can still use the app without logging in and can login at any time.',
            },
          ]}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    height: Metrics.screenHeight*.35,
    width: Metrics.screenWidth*.5,
    borderRadius: 15
  },
});
