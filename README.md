# AppGT

AppGT is the offical app for HackGT on the App Store and Google Play Store. The goal of this app is to simplify every hackathon participant's experience with a simple interface by centralizing essential information. This allows important links, a custom schedule, and relevant notifications to be quickly access throughout events.

## Setup

First, make sure to read React Native's offical [Getting Started documentation](https://facebook.github.io/react-native/docs/getting-started.html). Follow the "React Native CLI Quickstart" and select macOS, Windows, Linux and specify either iOS or Android. Following it exactly is extremely important in getting the project to run without any errors.

* Clone project and cd into AppGT
* Run `npm install`

### Running iOS

* `cd ios` and `pod install` to install iOS dependencies 
* Run `react-native run-ios` 

or 

* `cd ios` and `pod install` to install iOS dependencies 
* Open `ios/AppGT.xcworkspace` in Xcode
* Add your development account and click `Run` in the top left

### Running Android

* Open an Android emulator  
* Run `react-native run-android`

or 

* Open the android folder in Android Studio
* Click the `Run` in the top right


### Current Status

#### Screen 1: "Welcome to HackGT 6"
This is a relatively static page that just pulls important information from CMS. It contains 3 sections/cards: General Info, "Frequently Asked Questions," and "Social Media." 
There is 1 style bug: We cannot get the font inside the cards to match the same font in the rest of the app.

#### Screen 2: Schedule
This page contains the schedule of all the events during hackgt. This has the feature of being able to star and unstar events which puts them on or removes them from "My Schedule." It also allows you to search through all of the events. All of the information on the event cards are pulled from CMS. The last feature is that a modal (popup) with more information on the event pops up when you click on the event card. 
A major bug: this page of the app is relatively slow when clicking on different.
A minor bug: the font is too large for some of the titles that the titles overlap to too many lines.

