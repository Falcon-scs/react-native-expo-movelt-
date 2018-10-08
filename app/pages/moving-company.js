import React from 'react';
import {Linking, View} from 'react-native';
import MovingCompanyCard from '../components/moving-company-card';

class MovingCompany extends React.Component {
  static navigationOptions = {
    headerTitle: 'Moving Company',
    title: 'Moving Company',
  };

  render() {
    const {params} = this.props.navigation.state;
    const {jedi} = params;
    return (
      <View style={styles.storageUnit}>
        <MovingCompanyCard
          jedi={jedi}
          onButtonPressed={() => Linking.openURL(jedi['url'])}
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

export default MovingCompany;