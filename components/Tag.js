import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';

export default class Tag extends Component<Props> {
	constructor() {
		super();
	}

	render() {
		return (
			<Text style={styles.tag}>#{this.props.tagText}</Text>
		)
	}
}

const styles = StyleSheet.create({
	tag: {
		backgroundColor: 'grey',
		borderRadius: 10,
		paddingLeft: 5,
		marginBottom: 10,
		marginLeft: 10,
	},
});
