import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { AuthContext } from "../context";
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
            <ScrollView style={styleguide.wrapperView}>
                <View style={styleguide.titleView}>
                    <StyledText style={styleguide.title}>HackGT6: Scavenger Hunt</StyledText>
                </View>
                <View style={styleguide.card}>
                    <StyledText style={{ fontWeight: "bold" }}>
                        Help Beardell save his friends!
                    </StyledText>
                    <StyledText>
                        Don’t be deceived: while everything seems great at first, something is not quite right … Help Beardell explore different regions and get to the bottom of the mysterious events happening around Wonderland.
                    </StyledText>
                </View>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        if (!user) return <LoggedOut login={login} />;
                        return <LoggedIn user={user} logout={logout} />;
                    }}
                </AuthContext.Consumer>
                <Spacer />
            </ScrollView>
        );
    }
}

export default ScavHunt;
