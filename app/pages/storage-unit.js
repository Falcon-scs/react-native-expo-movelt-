import React from 'react';
import {Linking, View} from 'react-native';
import StorageCard from '../components/storage-card';

class StorageUnit extends React.Component {
  static navigationOptions = {
    headerTitle: 'Storage Unit',
    title: 'Storage Unit',
  };

  render() {
    const {params} = this.props.navigation.state;
    const {unit} = params;
    return (
      <View style={styles.storageUnit}>
        <StorageCard
          unit={unit}
          onButtonPressed={() => Linking.openURL(unit['site'])}
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

export default StorageUnit;