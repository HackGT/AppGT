import React, { Component } from "react";
import { View, Alert, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from '../styles'
import { colors } from "../themes";
import { StyledText } from "../components";
import { faTimesCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// TODO list of completed/incomplete puzzles
// TODO score in async storage

const CHECK_ENDPOINT = 'https://qa.hack.gt/check';
const SCORE_ENDPOINT = 'https://qa.hack.gt/num_questions';

const fetchQA = (resString, endpoint) => {
    return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: resString,
        })
        .then((response) => response.json());
}

class LoggedIn extends Component<Props> {
    constructor(props) {
        super(props);
        this.getScores();
        this.state = {
            puzzle: null,
            qr: false,
            isFormVisible: false, // todo: feedback?
        };
    }

    getPayload = (details = {}) => {
        const resBody = [];
        for (property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            resBody.push(encodedKey + "=" + encodedValue);
        }
        const encodedKey = encodeURIComponent("uuid");
        const encodedValue = encodeURIComponent(this.props.user.uuid);
        resBody.push(encodedKey + "=" + encodedValue);
        return resBody.join("&");
    }

    sendInput = (inputText) => {
        this.setState({ isFormVisible: false });
        const { puzzle } = this.state;
        const resString = this.getPayload({
            "question": puzzle.slug,
            "answer": inputText,
        });

        return fetchQA(resString, CHECK_ENDPOINT)
            .then((responseJson) => {
                console.log(responseJson);
                Alert.alert(
                    'Response',
                    responseJson.message,
                    [
                        { text : 'Dismiss', onPress: () => console.log("Dismissed") },
                    ],
                    {cancelable: true},
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getScores = () => {
        const resString = this.getPayload();
        return fetchQA(resString, SCORE_ENDPOINT)
            .then((res) => {
                this.setState({ score: res.num_done });
            }).catch((error) => {
                console.error(error);
            });
    }

    handleQRCode = (e) => {
        this.setState({
            puzzle: JSON.parse(e.data),
            qr: false,
            isFormVisible: true,
        });
    }

    closeQR = () => {
        this.setState({ qr: false });
    }

    render() {
        const { score, values, isFormVisible, qr } = this.state;

        return (
                <View>
                    <View style={styleguide.card}>
                        <StyledText style={styleguide.score}>Puzzles solved: {this.state.score}</StyledText>
                    </View>
                    <View style={styleguide.card}>
                        <StyledText style={{padding: 10}}>Where to next? Splash around Lobster Beach, wander in the Mushroom Forest, sit at the Tea Party, and pick flowers in the Secret Garden!</StyledText>
                        <TouchableOpacity
                            onPress= {() => {this.setState({qr: true})}}
                            style={styleguide.button}
                        >
                            <StyledText style={{color: "white", paddingRight: 15}}>Found a Clue?</StyledText>
                            <FontAwesomeIcon color="white" icon={faCamera} size={28} />
                        </TouchableOpacity>
                        <View style={{marginTop: 22}}>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={qr}
                                onRequestClose={this.closeQR}
                            >
                                <QRCodeScanner
                                    onRead={this.handleQRCode}
                                    topContent={
                                        <StyledText style={styleguide.qr}>Scan the QR code!</StyledText>
                                    }
                                    bottomContent={
                                        <TouchableOpacity
                                            onPress={this.closeQR}
                                            style={styleguide.cancelButton}
                                        >
                                            <FontAwesomeIcon color="red" icon={faTimesCircle} size={30} />
                                        </TouchableOpacity>
                                    }
                                    topViewStyle={styles.qrTop}
                                    bottomViewStyle={{ paddingVertical: 10 }}
                                />
                            </Modal>
                        </View>
                        <DialogInput isDialogVisible={isFormVisible}
                            title={"Scavenger Hunt Response"}
                            message={values}
                            hintInput ={"Response"}
                            submitInput={this.sendInput}
                            closeDialog={() => {
                                this.setState({isFormVisible: false});
                            }}>
                        </DialogInput>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    qrTop: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
        paddingLeft: 20
    },
    qrBottom: {},
});
export default LoggedIn;
