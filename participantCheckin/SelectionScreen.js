import React, { Component } from "react";
import { Text, View, StyleSheet,ScrollView } from "react-native";
import { ThemeContext } from "../context";
import { EventSel } from "./EventSel";

export class SelectionScreen extends Component {

  state = {
    events: null
  }
  
  async componentDidMount() {
    const response = await fetch("https://keystone.dev.hack.gt/admin/api", {
        method: "POST",
        headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        },
        body: JSON.stringify({
        query: `query {
            allEvents  (orderBy: "startDate") {
              name
              endTime
              startTime
              startDate
              url
              id
            }
          }`,
        }),
    });
    const data = await response.json();
    var allEvents = data.data.allEvents;
    this.setState({events: allEvents})
    
  }

  render() {
    if(this.state.events != null) {
      var formattedEvents = [];
      this.state.events.forEach((event)=>{
        formattedEvents.push(<EventSel key={event.id} name={event.name} startTime={event.startTime} endTime={event.endTime}/>)
      })
      return (
        <ScrollView>
          <View style={[styles.eventContainer]}>
              <Text style={[styles.header]}> Pick an Event </Text>
              {formattedEvents}
          </View>
        </ScrollView>);
    } else { return (<View/>); }
  }
}


const styles = StyleSheet.create({

  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10,    
  },

  eventContainer: {
    marginHorizontal: 15,
    flex: 1
  }
});

