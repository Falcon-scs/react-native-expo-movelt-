import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';
import {Button, Card} from 'react-native-elements'


export default class StorageCard extends React.Component {
  static propTypes = {
    onCardPressed: PropTypes.func,
    onButtonPressed: PropTypes.func.isRequired,
    unit: PropTypes.shape({
      price: PropTypes.number.isRequired,
      size: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      photoUri: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {onCardPressed, onButtonPressed, unit} = this.props;
    const {price, size, address, photoUri,} = unit;
    return (
      <TouchableOpacity onPress={onCardPressed}>
        <View style={styles.card}>
          <Card
            title={address}
            image={{uri: photoUri}}
            imageProps={{resizeMode: 'contain'}}
          >
            <Text style={styles.text}>Price: ${price}</Text>
            <Text style={styles.text}>Size: {size}</Text>
            <Button
              icon={{name: 'code'}}
              backgroundColor='#03A9F4'
              buttonStyle={styles.button}
              title='RENT STORAGE UNIT'
              onPress={onButtonPressed}/>
          </Card>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
    marginTop: 5,
  },
});
