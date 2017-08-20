import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');


export default class SearchBar extends Component {
    render() {
        return (
            <GooglePlacesAutocomplete
              placeholder='Búsqueda'
              minLength={2} // minimum length of text to search
              autoFocus={true}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'    // true/false/undefined
              fetchDetails={true}
              renderDescription={(row) => row.description} // custom description render
              onPress={this.props.onPress}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyAP6haUsB4fg7p0u2n31WftiUoy4IZb1Ns',
                language: 'en',  // language of the results
                location: '18.3946723,-66.1534051'
              }}
              styles={{
                textInputContainer: {
                  marginTop: 20,
                  height: 50,
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth:0
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 50,
                  color: '#5d5d5d',
                  fontSize: 18
                },
                listView: {
                    marginTop: 10
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
              }}

              currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance'
              }}
              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            />
        );
    }
}
