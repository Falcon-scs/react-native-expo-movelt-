import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class VehicleBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
      convoKey: '',
      userName: '',
      sellerName: '',
      previousMessage: false,
    }

    console.log(JSON.stringify(props));
  }

  openVehicleScreen() {
    console.log('pressed');
    this.props.rentVehicle(this.props.jedi);
  }

  onPressRentVehicle = async () => {
    {//Shoould navigate to unit url} this should take the user to the website url of the block.
  }
    // this.props.navigation.navigate('StorageScreenSelected');
    //query
  }

/*
This block should render the unit image, the storage Unit company,
the unit price, and the unit size.
*/
  render() {
    return (
      <TouchableOpacity onPress={() => this.openVehicleScreen()}>
        <View style={styles.cardView}>
          <Card style={styles.card}
              title={this.props.jedi.itemName}
              image={{uri: this.props.jedi.image}}
              imageStyle={{ flex: 1}}
              imageProps={{ resizeMode: 'contain'}}>
              <Text style={styles.textStyles}>
              Price: ${this.props.jedi.Price}
              </Text>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                title='RENT STORAGE VEHICLE'
                onPress={() => this.onPressRentVehicle()}/>
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
