import React, { Component } from "react";

import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import {
  Header,
  List,
  ListItem as Item,
  ScrollableTab,
  Tab,
  TabHeading,
  Tabs,
  Title,
  Card,
  CardItem,
  Button,
  Container,
  Content,
  H1,
  H2,
  H3,
  Left,
  Right,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { CMSContext } from "../context";
import moment from "moment";

const HEADER_HEIGHT = 150;
const SCROLL_HEIGHT = 1;
const BLUE = "#41D1FF";

export class ScheduleTab extends Component {
  nScroll = new Animated.Value(0);
  scroll = new Animated.Value(0);

  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1],
  });
  headerFade = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: [1, 0],
  });

  parse_date = t => {
    // parse iso-formatted string as local time
    if (!t) return "";
    let localString = t;
    if (t.slice(-1).toLowerCase() === "z") {
      localString = t.slice(0, -1);
    }
    return moment(localString);
  };

  tabContent = (i) => {
    return (
      <View>
        <CMSContext.Consumer>
          {({ events, infoBlocks }) => {
            const curLength = events.length;
            const curData = events;
            
            return (
              <List>
                {
                  new Array(curLength).fill(null).map((_, i) => 
                  {
                    const title = curData[i].title;
                    const location = curData[i].area != null ? curData[i].area.name + " • " : "";
                    const start = this.parse_date(curData[i].start_time).format("hh:mm A");
                    const end = this.parse_date(curData[i].end_time).format("hh:mm A")
                    return (
                      <Item key={i}>
                        <Card style={styles.cardParent}>
                          <CardItem style={styles.cardItem}>
                            <Text>
                              {title}
                            </Text>
                            <Text>
                              {location}{start} - {end}
                            </Text>
                          </CardItem>
                        </Card>
                      </Item>
                    )})
                }
              </List>
            );
          }}
        </CMSContext.Consumer>
      </View>
    );
  };

  state = {
    activeTab: 0,
  };

  constructor(props) {
    super(props);
    this.nScroll.addListener(
      Animated.event([{ value: this.scroll }], { useNativeDriver: false })
    );
  }

  render() {
    // TODO: if greater than a certain X, set SCROLL_HEIGHT to header height
    return (
      <View>
        {/* <View>
          <Header style={styles.headerTop} hasTabs>
            <Left>
            <Title>
              <Text style={styles.headerTopText}>
                HackGT
              </Text>
            </Title>
            </Left>

            <Right>
            <Button>
                <Text>Search</Text>
            </Button>
            </Right>
          </Header>
        </View> */}

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
            <Text>What's Happening Now</Text>
            <ScrollView horizontal={true}>
              {new Array(20).fill(null).map((_, i) => (
                <Item key={i}>
                  <Card style={styles.cardHorizontalParent}>
                    <CardItem style={styles.cardItem}>
                      <Text>Item {i}</Text>
                    </CardItem>
                  </Card>
                </Item>
              ))}
            </ScrollView>
          </Animated.View>

          <Tabs
            prerenderingSiblingsNumber={3}
            onChangeTab={({ i }) => {
              this.setState({ activeTab: i });
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
            <Tab heading="Friday">{this.tabContent(30, 0)}</Tab>
            <Tab heading="Saturday">{this.tabContent(15, 1)}</Tab>
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

  headerDetail: {
    backgroundColor: "white",
    height: HEADER_HEIGHT,
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
    width: 200,
    borderRadius: 10,
  },
  cardParent: {
    width: "100%",
    borderRadius: 10,
  },

  cardItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: 100,
    borderColor: BLUE,
    borderWidth: 2,
    borderRadius: 10,
  },
});
