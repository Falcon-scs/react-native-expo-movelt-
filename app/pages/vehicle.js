import React from 'react';
import {Linking, View} from 'react-native';
import VehicleCard from '../components/vehicle-card';

class Vehicle extends React.Component {
  static navigationOptions = {
    headerTitle: 'Vehicle',
    title: 'Vehicle',
  };

  render() {
    const {params} = this.props.navigation.state;
    const {vehicle} = params;
    return (
      <View style={styles.storageUnit}>
        <VehicleCard
          vehicle={vehicle}
          onButtonPressed={() => Linking.openURL(vehicle['site'])}
        />
      </View>
    );
  }
}

const styles = {
  storageUnit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Vehicle;