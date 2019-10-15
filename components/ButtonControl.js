import React, { Component } from "react";
import { ButtonGroup } from "react-native-elements";
import { colors } from "../themes";

class ButtonControl extends Component<Props> {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
    if (this.props.changeListener)
      this.props.changeListener(selectedIndex);
  }

  render() {
    const { buttons, containerStyle, buttonStyle } = this.props;
    const { selectedIndex } = this.state;

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
