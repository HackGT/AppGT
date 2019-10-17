import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default LoggedOut = ({ login }) => (
    <TouchableOpacity
        onPress={login}
        style={styleguide.button}
    >
        <StyledText style={{ color: "white" }}>
            Login in begin!
        </StyledText>
    </TouchableOpacity>
);