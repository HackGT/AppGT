import React, { Component } from "react";
import { ButtonGroup } from "react-native-elements";


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
    this.props.onChangeIndex(selectedIndex);
  }

  render() {
    const { buttons } = this.props;
    const { selectedIndex } = this.state;

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{ height: this.props.height }}
      />
    );
  }
}

export default ButtonControl;
