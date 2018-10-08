import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, Picker, SafeAreaView, TextInput, Button,
  TouchableOpacity, Image, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { ImagePicker } from 'expo';
import { GiftedChat } from 'react-native-gifted-chat'

/*
for scaling, can use sql, or use a backend developer (firebase)
*/

import {Dimensions} from 'react-native'

const { width, height } = Dimensions.get('window')

export default class ChatMessenger extends React.Component {

  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}
