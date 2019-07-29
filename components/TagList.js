import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native';

export default class TagList extends Component<Props> {
	constructor() {
		super();
	}

	render() {
		return(
		<View style={styles.container}>
        <FlatList horizontal={true}
          data={this.props.tagList}
          renderItem={({item}) => <Text style={styles.tag}>#{item.key}</Text>}
        />
      </View>)
	}
}

const styles = StyleSheet.create({
	tag: {
		backgroundColor: '#E0E0E0',
		borderRadius: 18,
		padding: 8,
		marginBottom: 10,
		marginLeft: 10,
	},
});
