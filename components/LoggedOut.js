import React, { Component } from "react";
import {
  TouchableOpacity,
} from "react-native";
import { styleguide } from "../styles";
import { StyledText } from "../components";

export default LoggedOut = ({ login }) => (
    <TouchableOpacity
        onPress={login}
        style={styleguide.button}
    >
        <StyledText style={{ color: "white" }}>
            Login to begin!
        </StyledText>
    </TouchableOpacity>
);