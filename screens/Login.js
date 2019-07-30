import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../App";

class Login extends Component<Props> {
    static navigationOptions = {
        title: "Login",
        headerLeft: null
    };

    displayUserData = user => {
        return (
            user &&
            Object.keys(user).map((key, index) => (
                <Text key={index}>
                    {key} - {user[key]}
                </Text>
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
