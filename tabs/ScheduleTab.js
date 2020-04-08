import React, { Component, createRef, useRef } from "react";

import {
  Animated,
  Button,
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
  Card,
  CardItem,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "reanimated-bottom-sheet";

const HEADER_HEIGHT = 150;
const SCROLL_HEIGHT = 1;
const BLUE = "#41D1FF";

export class ScheduleTab extends Component {
  nScroll = new Animated.Value(0);
  scroll = new Animated.Value(0);
  bs = createRef();
  state = {
    fall: new Animated.Value(1),
  };

  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1],
  });
  headerFade = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: [1, 0],
  });

  tabContent = (x, i) => (
    <View style={{ height: this.state.height }}>
      <List
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => {
          this.heights[i] = height;
          if (this.state.activeTab === i) this.setState({ height });
        }}
      >
        {new Array(x).fill(null).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => this.bs.current.snapTo(0)}>
            <Card style={styles.cardParent}>
              <CardItem style={styles.cardItem}>
                <Text>Item {i}</Text>
              </CardItem>
            </Card>
          </TouchableOpacity>
        ))}
      </List>
    </View>
  );

  heights = [500, 500];
  state = {
    activeTab: 0,
    height: 500,
  };

  constructor(props) {
    super(props);
    this.nScroll.addListener(
      Animated.event([{ value: this.scroll }], { useNativeDriver: false })
    );
  }

  renderInner = () => (
    <View style={styles.panel}>
      <Text>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est
        laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
        cumque nihil impedit quo minus id quod maxime placeat facere possimus,
        omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
        quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
        ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
        earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
        voluptatibus maiores alias consequatur aut perferendis doloribus
        asperiores repellat. At vero eos et accusamus et iusto odio dignissimos
        ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
        quos dolores. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
        reiciendis voluptatibus maiores alias consequatur aut perferendis
        doloribus asperiores repellat.
      </Text>
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
        onPress={() => this.bs.current.snapTo(1)}
      >
        <Text>𝗫</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    // TODO: if greater than a certain X, set SCROLL_HEIGHT to header height

    return (
      <View>
        <BottomSheet
          ref={this.bs}
          snapPoints={[450, 0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
          enabledGestureInteraction={false}
        />

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
                <TouchableOpacity key={i} onPress={this._onPressButton}>
                  <Card style={styles.cardHorizontalParent}>
                    <CardItem style={styles.cardItem}>
                      <Text>Item {i}</Text>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                      // onPress={() => onPress(page)}
                      onPress={this._onPressButton}
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
    backgroundColor: "white",
    height: 100,
    borderColor: BLUE,
    borderWidth: 2,
    borderRadius: 10,
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
});
