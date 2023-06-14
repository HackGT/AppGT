# AppGT

AppGT is the offical app for HackGT on the App Store and Google Play Store. The goal of this app is to simplify every hackathon participant's experience with a simple interface by centralizing essential information. This allows important links, a custom schedule, and relevant notifications to be quickly access throughout events.

## Setup

First, make sure to read React Native's offical [Environment Setup](https://reactnative.dev/docs/environment-setup). Follow the "React Native CLI Quickstart" and select macOS, Windows, Linux and specify either iOS or Android. Following it exactly is extremely important in getting the project to run without any errors.

- Clone project and cd into AppGT
- Run `npm install` to install the dependencies (use Node 14)

### Running iOS

- `cd ios` and `pod install` to install iOS dependencies
- Run `npx react-native run-ios`

or try to run with Xcode if the above doesn't work

- `cd ios` and `pod install` to install iOS dependencies
- Open `ios/AppGT.xcworkspace` in Xcode
- Add your development account and click `Run` in the top left

### Running Android

- Open an Android emulator
- Run `npx react-native run-android`

or

- Open the android folder in Android Studio
- Click the `Run` in the top right
