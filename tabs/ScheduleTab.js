import React, {Component} from "react";

import {Animated, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title, Card, CardItem, Button, Container, Content, H1, H2, H3, Left, Right} from "native-base";

const HEADER_HEIGHT = 300;
const SCROLL_HEIGHT = 1;
const BLUE = "#41D1FF";

export class ScheduleTab extends Component {
  nScroll = new Animated.Value(0);
  scroll = new Animated.Value(0);

  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1]
  });
  headerFade = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: [1, 0],
  });

  tabContent = (x, i) => <View style={{height: this.state.height}}>
    <List onLayout={({nativeEvent: {layout: {height}}}) => {
      this.heights[i] = height;
      if (this.state.activeTab === i) this.setState({height})
    }}>
      {new Array(x).fill(null).map((_, i) => <Item key={i}>
          <Card style={styles.cardParent}>
            <CardItem style={styles.cardItem}>
                <Text>
                   Item {i}
                </Text>
            </CardItem>
          </Card>
          </Item>
          )}
    </List></View>;

  heights = [500, 500];
  state = {
    activeTab: 0,
    height: 500
  };

  constructor(props) {
    super(props);
    this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
  }

  render() {
    // TODO: if greater than a certain X, set SCROLL_HEIGHT to header height

    return (
      <View>
        <View>
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
        </View>

        <Animated.ScrollView
          stickyHeaderIndices={[0]} 
          scrollEventThrottle={5} 
          showsVerticalScrollIndicator={false} 
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})}>


            {/* TODO: Fade out and translate up when in future events, when in now/past events show */}
            <Animated.View style={styles.headerDetail}>
              <Text>What's Happening Now</Text>
            </Animated.View>

          <Tabs
            prerenderingSiblingsNumber={3}
            onChangeTab={({i}) => {
              this.setState({height: this.heights[i], activeTab: i})
            }}
            renderTabBar={(props) => 
            
            <Animated.View
              style={{ transform: [{translateY: this.tabY}], zIndex: 1, width: "100%", backgroundColor: "white"}}>
              <ScrollableTab {...props} style={styles.headerScrollableTab}
                             renderTab={(name, page, active, onPress, onLayout) => (
                               <TouchableOpacity key={page}
                                                 onPress={() => onPress(page)}
                                                 onLayout={onLayout}
                                                 activeOpacity={0.4}>
                                 <Animated.View
                                   style={styles.tabView}>
                                   <TabHeading scrollable
                                               style={styles.tabHeading}
                                               active={active}>
                                     <Animated.Text style={styles.tabText}>
                                       {name}
                                     </Animated.Text>
                                   </TabHeading>
                                 </Animated.View>
                               </TouchableOpacity>
                             )}
                             underlineStyle={styles.tabUnderlineStyle}/>
            </Animated.View>

            }>
            <Tab heading="Friday">
                {this.tabContent(30, 0)}
            </Tab>
            <Tab heading="Saturday">
              {this.tabContent(15, 1)}
            </Tab>
          </Tabs>

        </Animated.ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
    headerTop: {
        backgroundColor: "white"
    },
    headerTopText: {
        color: BLUE, 
        fontWeight: "bold"
    },
    
    headerDetail: {
        backgroundColor: "white", 
        height: HEADER_HEIGHT
    },

    headerScrollableTab: {
        backgroundColor: "white"
    },

    tabView: {
        flex: 1,
        height: 100,
        backgroundColor: "white",
      },

      tabHeading: {
            backgroundColor: "white",
            width: "100%"
      },
     tabText: {
        color: BLUE,
        fontSize: 14
      },
      tabUnderlineStyle: {
        backgroundColor: BLUE
      },

      cardParent: {
        width: "90%", 
        borderRadius: 10
      },
      
      cardItem: { 
          backgroundColor: "white", 
          height: 100, 
          borderColor: BLUE, 
          borderWidth: 2, 
          borderRadius: 10 
        }
  });
