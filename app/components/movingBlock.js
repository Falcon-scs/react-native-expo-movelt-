import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Metrics from '../Themes/Metrics';
import {Button, Card} from 'react-native-elements'

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class MovingBlock extends React.Component {

  constructor(props) {
    super(props);

    //See what props our StarWarsCard renders with
    // console.log(JSON.stringify(props));
  }

  render() {
    const {jedi} = this.props;
    const name = jedi['name'];
    const imageUrl = jedi['image_url'];
    return (
      <TouchableOpacity onPress={() => console.log('pressed')}>
        <View style={styles.cardView}>
          <Card style={styles.card}
                title={name}
                image={{uri: imageUrl}}
                imageStyle={{flex: 1, alignSelf: 'stretch'}}>
            <Button
              icon={{name: 'code'}}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
              title='PURCHASE'/>
          </Card>

        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5,
  },
  pictureDetails: {
    flexDirection: 'column',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
