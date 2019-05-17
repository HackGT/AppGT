import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Navbar } from './../components';

export default class DefaultScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
        <Navbar
          navigation={this.props.navigation}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
