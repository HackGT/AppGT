import React, { Component } from "react";
import { View, Button } from "react-native";
import { AuthContext } from "../App";
import { StyledText } from "../components";
class Login extends Component<Props> {
    static navigationOptions = {
        title: "Login",
        headerLeft: null
    };

    displayUserData = user => {
        return (
            user &&
            Object.keys(user).map((key, index) => (
                <StyledText key={index}>
                    {key} - {user[key]}
                </StyledText>
            ))
        );
    };

    render() {
        return (
            <View>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        return (
                            <View>
                                {this.displayUserData(user)}
                                <Button
                                    onPress={user ? logout : login}
                                    title={user ? "Logout" : "Login"}
                                />
                            </View>
                        );
                    }}
                </AuthContext.Consumer>
            </View>
        );
    }
}

export default Login;
