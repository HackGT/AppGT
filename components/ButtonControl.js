import React, { Component } from "react";
import { ButtonGroup } from "react-native-elements";
import { colors } from "../themes";

class ButtonControl extends Component<Props> {
  constructor() {
    super();
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.props.onChangeCallback(selectedIndex);
  }

  render() {
    const { buttons, containerStyle, buttonStyle, selectedIndex } = this.props;
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        buttonStyle={{
          borderRadius: 20
        }}
        containerBorderRadius={50}
        containerStyle={{
          height: 32,
          borderColor: colors.primaryBlue,
          ...containerStyle
        }}
        selectedButtonStyle={{
          backgroundColor: colors.primaryBlue,
        }}
        selectedTextStyle={{
          fontWeight: "bold",
          color: "white"
        }}
        buttonStyle={{
          padding: 6,
          ...buttonStyle
        }}
      />
    );
  }
}

export default ButtonControl;
