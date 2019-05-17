import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';

export default class Navbar extends Component<Props> {
  render() {
      const { navigation: navigate } = this.props;
      const buttonProps = [{title: 'Schedule', navTo: 'Home'}, {title: 'Workshops', navTo: 'Workshops'}];
      return (
          <View style={styles.bottom}>
            buttonProps.map(props =>
              <View style={styles.buttonView}>
                <Button
                  title={props.title}
                  styles={styles.button}
                  onPress={() => navigate('Home')}
                />
            );
          </View>
      );
  }
}

const styles= StyleSheet.create({
  bottom: {
      flex: 1,
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10
  },

  buttonView: {
      flex: 1,
  },

  text: {
      color: 'white',
  },

  button: {
      justifyContent: 'center',
      alignItems: 'center',
  }
});
