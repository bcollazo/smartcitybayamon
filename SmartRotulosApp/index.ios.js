/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SearchBar from './SearchBar.js';
var Speech = require('react-native-speech');

const MAX_LAT = 18.394810;
const MIN_LAT = 18.392418;
const MAX_LNG = -66.151412;
const MIN_LNG = -66.154652;

export default class SmartRotulosApp extends Component {
  constructor() {
    super();
    this.state = {
      lat: null,
      lng: null,
      destinationLat: null,
      destinationLng: null,
      color: '#ddd'
    };
  }

  componentDidMount() {
    var self = this;
    navigator.geolocation.watchPosition(function(position) {
      var coords = position['coords'];
      self.setState({
        lat: coords['latitude'],
        lng: coords['longitude']
      });
      self.trySendingRequest();
    }, function(error) {
      console.log('error', error);
    });
  }

  trySendingRequest() {
    var latLngInBounds =
        MIN_LAT < this.state.lat && this.state.lat < MAX_LAT &&
        MIN_LNG < this.state.lng && this.state.lng < MAX_LNG;
    if (this.state.destinationLat !== null &&
        this.state.destinationLng !== null &&
        latLngInBounds) {
      // SEND REQUEST TO SERVER. latlng -> destination
      // Get color and paint or so for 5 secs.
      var data = {
        'slat': this.state.lat,
        'slng': this.state.lng,
        'tlat': this.state.destinationLat,
        'tlng': this.state.destinationLng
      };
      var self = this;
      fetch('http://localhost:5000/compute', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.json() })
      .then(function(json) {
        var i = 0;
        var interval = setInterval(function() {
          self.setState({
            color: i % 2 === 0 ? json['success'] : '#ddd'
          });
          i++;
          if (i > 11) {
            clearInterval(interval);
          }
          if (i % 2 === 1) {
            Speech.speak({
              text: json['success'],
              voice: 'en-US'
            });
          }
        }, 500);
      });
    } else {
      console.log('failed', this.state);
    }
  }

  render() {
    if (this.state.destinationLat === null || this.state.destinationLng === null) {
      var content = (
        <SearchBar
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            var location = details['geometry']['location'];
            this.setState({
              destination: data['description'],
              destinationLat: location['lat'],
              destinationLng: location['lng']
            });
            this.trySendingRequest();
          }} />
        );
    } else {
      var content = (
        <View>
          <Text style={styles.welcome2}>
            Driving to:
          </Text>
          <Text style={styles.welcome}>
           {this.state.destination}
          </Text>
        </View>
        );
    }
    return (
      <View style={[styles.container, {backgroundColor: this.state.color}]}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 42,
    textAlign: 'center',
    margin: 20,
  },
  welcome2: {
    marginTop: 180,
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SmartRotulosApp', () => SmartRotulosApp);
