import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class LeaderBoardBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
    }

    // console.log(JSON.stringify(props));
  }


  render() {
    return (
        <View style={styles.cardView}>
          <Card style={styles.card}
              title={this.props.jedi.name}
              imageStyle={{ flex: 1, alignSelf: 'stretch' }}>
              <Text style={styles.textStyles}>
              Points: {this.props.jedi.points}
              </Text>
              <Text style={styles.textStyles}>
              Ranking: {this.props.place}
              </Text>
              </Card>

        </View>
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
    alignItems: 'center'
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
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
    alignItems: 'center'
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
