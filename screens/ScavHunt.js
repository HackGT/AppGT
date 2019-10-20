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
                        Beardell’s friends have been kidnapped by the evil forces of creative block. Help him rescue them by completing activities!
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
