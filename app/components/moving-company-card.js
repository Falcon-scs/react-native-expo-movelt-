import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';
import {Button, Card} from 'react-native-elements'


class MovingCompanyCard extends React.Component {
  static propTypes = {
    onCardPressed: PropTypes.func,
    onButtonPressed: PropTypes.func.isRequired,
    jedi: PropTypes.object.isRequired,
  };

  render() {
    const {onCardPressed, onButtonPressed, jedi} = this.props;
    const name = jedi['name'];
    const imageUrl = jedi['image_url'];
    const address = jedi['location']['display_address'].join('\n');
    const rating = jedi['rating'];
    return (
      <TouchableOpacity onPress={onCardPressed}>
        <View style={styles.card}>
          <Card
            title={name}
            image={{uri: imageUrl}}
            imageProps={{resizeMode: 'contain'}}
          >
            <Text style={styles.text}>Address: {address}</Text>
            <Text style={styles.text}>Rating: {rating} Stars</Text>
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

export default MovingCompanyCard;
