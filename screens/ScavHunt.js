import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { AuthContext } from "../App";
import { styleguide } from '../styles'
import { colors } from "../themes";
import { StyledText, LoggedIn, LoggedOut, Spacer } from "../components";


class ScavHunt extends Component<Props> {

    static navigationOptions = {
        title: "ScavHunt",
        headerLeft: null
    };

    render() {
        return (
            <View style={styleguide.wrapperView}>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        if (!user) return <LoggedOut login={login} />;
                        return <LoggedIn user={user} logout={logout} />;
                    }}
                </AuthContext.Consumer>
                <Spacer />
            </View>
        );
    }
}

export default ScavHunt;
