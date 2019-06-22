import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';

export default class Navbar extends Component<Props> {
  render() {
    const { navigate } = this.props.navigation;
    const buttonProps = [{title: 'Home', navTo: 'Home'}, {title: 'Schedule', navTo: 'Schedule'}, {title: 'Workshops', navTo: 'Workshops'}];
    return (
      <View style={styles.bottom}>
        {
          buttonProps.map((props, i) =>
            <View style={styles.buttonView} key={i}>
              <Button
                title={props.title}
                styles={styles.button}
                key = {i}
                onPress={() => navigate(props.navTo)}
              />
            </View>
          )
        }
      </View>
    )
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
