import React, { Component, createRef } from "react";

import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import {
  List,
  ListItem as Item,
  ScrollableTab,
  Tab,
  TabHeading,
  Tabs,
  ListItem,
} from "native-base";
import { CMSContext } from "../context";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "reanimated-bottom-sheet";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCellVerticle } from "./ScheduleEventCellVerticle";
import Svg, { Circle } from "react-native-svg";

const HEADER_HEIGHT = 160;
const SCROLL_HEIGHT = 1;
const BLUE = "#41D1FF";

export class ScheduleTab extends Component {
  nScroll = new Animated.Value(0);
  scroll = new Animated.Value(0);
  bs = createRef();
  state = {
    fall: new Animated.Value(1),
    selectedEvent: null,
    activeTab: 0,
    height: 500,
  };

  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1],
  });
  headerFade = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: [1, 0],
  });

  parse_date = (t) => {
    // parse iso-formatted string as local time
    if (!t) return "";
    let localString = t;
    if (t.slice(-1).toLowerCase() === "z") {
      localString = t.slice(0, -1);
    }
    return moment(localString);
  };

  tabContent = (i) => (
    <View style={{ height: this.state.height }}>
      <CMSContext.Consumer>
        {({ events, infoBlocks }) => {
          const curLen = events.length;
          const curData = events;

          return (
            <ScrollView
              onLayout={({
                nativeEvent: {
                  layout: { height },
                },
              }) => {
                this.heights[i] = height;
                if (this.state.activeTab === i) this.setState({ height });
              }}
            >
              {new Array(curLen).fill(null).map((_, i) => {
                const radius = 7;
                const size = radius * 2;
                const highlightColor = i >= 4 && i < 8 ? "#41D1FF" : "#F2F2F2";

                if (i % 4 == 0) {
                  return (
                    <View flexDirection="row" style={{ height: 40 }}>
                      <View
                        flexDirection="row"
                        style={{
                          width: "15%",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <Svg height={size} width={size}>
                          <Circle
                            cx={radius}
                            cy={radius}
                            r={radius}
                            fill={highlightColor}
                          />
                        </Svg>
                      </View>
                      <View
                        style={{
                          height: "80%",
                          top: 5,
                          width: 100,
                          backgroundColor: "#F2F2F2",
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            padding: 6,
                            textAlign: "center",
                          }}
                        >
                          {i}:00 PM
                        </Text>
                      </View>
                    </View>
                  );
                }

                return (
                  <View flexDirection="row">
                    <View
                      flexDirection="row"
                      style={{
                        width: "15%",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 1.5,
                          height: "100%",
                          backgroundColor: highlightColor,
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.cardParent}
                      onPress={() => {
                        this.setState({ selectedEvent: curData[i] });
                        this.bs.current.snapTo(1);
                        this.bs.current.snapTo(1);
                      }}
                    >
                      <ScheduleEventCellVerticle event={curData[i]} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          );
        }}
      </CMSContext.Consumer>
    </View>
  );

  heights = [500, 500];

  constructor(props) {
    super(props);
    this.nScroll.addListener(
      Animated.event([{ value: this.scroll }], { useNativeDriver: false })
    );
  }

  renderInner = () => (
    <View style={styles.panel}>
      <Text>{JSON.stringify(this.state.selectedEvent)}</Text>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>✪ Add to Calendar</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.panelHeader}>
      <View style={styles.panelPlaceholder} />
      <View style={styles.panelHandle} />
      <TouchableOpacity
        style={styles.panelClose}
        onPress={() => {
          this.bs.current.snapTo(0);
          this.bs.current.snapTo(0);
        }}
      >
        <Text>𝗫</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    // TODO: if greater than a certain X, set SCROLL_HEIGHT to header height

    return (
      <View style={styles.underBackground}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[0, 450]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={0}
          enabledGestureInteraction={false}
        />

        <Animated.ScrollView
          stickyHeaderIndices={[0]}
          scrollEventThrottle={5}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.nScroll } } }],
            { useNativeDriver: true }
          )}
        >
          {/* TODO: Fade out and translate up when in future events, when in now/past events show */}
          <Animated.View style={styles.headerDetail}>
            <View style={styles.headerContent}>
              <WhatsHappeningNow style={styles.headerText} />
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={styles.headerHorizontalScroll}
              >
                <CMSContext.Consumer>
                  {({ events, infoBlocks }) => {
                    const curLen = events.length;
                    const curData = events;

                    return (
                      <View flexDirection="row">
                        {new Array(curLen).fill(null).map((_, i) => {
                          return (
                            <TouchableOpacity
                              style={styles.cardHorizontalParent}
                              onPress={() => {
                                this.setState({ selectedEvent: curData[i] });
                                this.bs.current.snapTo(1);
                                this.bs.current.snapTo(1);
                              }}
                            >
                              <ScheduleEventCellVerticle event={curData[i]} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  }}
                </CMSContext.Consumer>
              </ScrollView>
            </View>
          </Animated.View>

          <Tabs
            prerenderingSiblingsNumber={3}
            onChangeTab={({ i }) => {
              this.setState({ height: this.heights[i], activeTab: i });
            }}
            renderTabBar={(props) => (
              <Animated.View
                style={{
                  transform: [{ translateY: this.tabY }],
                  zIndex: 1,
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <ScrollableTab
                  {...props}
                  style={styles.headerScrollableTab}
                  renderTab={(name, page, active, onPress, onLayout) => (
                    <TouchableOpacity
                      key={page}
                      onPress={() => onPress(page)}
                      onLayout={onLayout}
                      activeOpacity={0.4}
                    >
                      <Animated.View style={styles.tabView}>
                        <TabHeading
                          scrollable
                          style={styles.tabHeading}
                          active={active}
                        >
                          <Animated.Text style={styles.tabText}>
                            {name}
                          </Animated.Text>
                        </TabHeading>
                      </Animated.View>
                    </TouchableOpacity>
                  )}
                  underlineStyle={styles.tabUnderlineStyle}
                />
              </Animated.View>
            )}
          >
            <Tab heading="Friday">{this.tabContent(0)}</Tab>
            <Tab heading="Saturday">{this.tabContent(1)}</Tab>
          </Tabs>
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerTop: {
    backgroundColor: "white",
  },
  headerTopText: {
    color: BLUE,
    fontWeight: "bold",
  },

  headerText: {
    left: 10,
  },

  headerDetail: {
    backgroundColor: "white",
    height: HEADER_HEIGHT,
  },

  headerContent: {
    top: 10,
  },

  headerHorizontalScroll: {
    marginLeft: 5,
  },

  headerScrollableTab: {
    backgroundColor: "white",
  },

  tabView: {
    flex: 1,
    height: 100,
    backgroundColor: "white",
  },

  tabHeading: {
    backgroundColor: "white",
    width: "100%",
  },
  tabText: {
    color: BLUE,
    fontSize: 14,
  },
  tabUnderlineStyle: {
    backgroundColor: BLUE,
  },

  cardHorizontalParent: {
    width: 300,
    left: 5,
    marginRight: 8,
    marginTop: 15,
  },

  cardParent: {
    padding: 8,
    width: "85%",
    borderRadius: 8,
  },

  cardItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: 100,
    borderColor: BLUE,
    borderWidth: 1.2,
    borderRadius: 8,
  },

  panelContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  panel: {
    paddingHorizontal: 20,
    height: 600,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  panelHeader: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 35,
  },

  panelPlaceholder: {
    width: 31,
    height: 31,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    alignSelf: "center",
  },

  panelHandle: {
    width: 75,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    alignSelf: "center",
  },

  panelClose: {
    width: 31,
    height: 31,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 5,
  },

  panelTitle: {
    fontSize: 27,
    height: 35,
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
    backgroundColor: "white",
  },
});
