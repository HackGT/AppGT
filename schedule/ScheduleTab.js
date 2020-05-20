import React, { Component, createRef } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { CMSContext } from "../context";
import moment from "moment";
import BottomSheet from "reanimated-bottom-sheet";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCellVerticle } from "./ScheduleEventCellVerticle";
import { ScheduleDayView } from "./ScheduleDayView";
import X from "../assets/X";
import Animated from "react-native-reanimated";

export class ScheduleTab extends Component {
  bs = createRef();
  fall = new Animated.Value(1);

  static navigationOptions = {
    title: "Welcome",
  };

  state = {
    selectedEvent: null,
  };

  parse_date = (t) => {
    // parse iso-formatted string as local time
    if (!t) return "";
    let localString = t;
    if (t.slice(-1).toLowerCase() === "z") {
      localString = t.slice(0, -1);
    }
    return moment(localString);
  };

  setSelectedEvent = (event) => {
    if (event) {
      this.setState({ selectedEvent: event });
      this.bs.current.snapTo(1);
      this.bs.current.snapTo(1);
    } else {
      this.setState({ selectedEvent: null });
      this.bs.current.snapTo(0);
      this.bs.current.snapTo(0);
    }
  };

  renderInner = () => (
    <View style={styles.panel}>
      <Text>{JSON.stringify(this.state.selectedEvent)}</Text>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>✪ Add to Calendar</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
      <TouchableOpacity
        style={styles.panelClose}
        onPress={() => {
          this.setSelectedEvent();
        }}
      >
        <X />
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.underBackground}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[0, 450]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={0}
          enabledInnerScrolling={false}
          overdragResistanceFactor={8}
          callbackNode={this.fall}
        />

        <Animated.View
          style={{
            alignItems: "center",
            opacity: Animated.add(0.1, Animated.multiply(this.fall, 0.9)),
          }}
        >
          <View
            pointerEvents={this.state.selectedEvent != null ? "none" : "auto"}
          >
            <View style={styles.headerDetail}>
              <View style={styles.headerContent}>
                <WhatsHappeningNow style={styles.headerText} />
                <CMSContext.Consumer>
                  {({ events }) => {
                    return (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={events}
                        keyExtractor={({ item }) => item}
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              style={styles.cardHorizontalParent}
                              onPress={() => {
                                this.setSelectedEvent(item);
                              }}
                            >
                              <ScheduleEventCellVerticle
                                event={item}
                                highlighted
                              />
                            </TouchableOpacity>
                          );
                        }}
                      />
                    );
                  }}
                </CMSContext.Consumer>
              </View>
            </View>

            <ScheduleDayView onSelectEvent={this.setSelectedEvent} />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    left: 10,
    top: 6,
  },

  headerDetail: {
    backgroundColor: "white",
    height: 160,
  },

  headerContent: {
    top: 10,
  },

  headerHorizontalScroll: {
    marginLeft: 5,
    marginTop: 5,
  },

  cardHorizontalParent: {
    width: 300,
    left: 5,
    marginRight: 8,
    marginTop: 15,
  },

  cardItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: 100,
    borderColor: "#41D1FF",
    borderWidth: 1.2,
    borderRadius: 8,
  },

  panel: {
    padding: 20,
    height: 600,
    backgroundColor: "white",
  },

  panelHeader: {
    backgroundColor: "white",
    shadowColor: "white",
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
  },

  panelHandle: {
    width: 75,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    top: 5,
  },

  panelClose: {
    margin: 10,
    right: 0,
    position: "absolute",
  },

  panelButton: {
    borderRadius: 5,
    backgroundColor: "#41d1ff",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    width: 335,
  },

  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },

  underBackground: {
    flex: 1,
    backgroundColor: "black",
  },
});
