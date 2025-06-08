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

## Setup Issues

You may run into one or multiple issues while trying to run this app for the first time. This is not an extensive list of issues, but in case you do run into some of these, we hope this will help.

### Android Setup Issues

**"Installed Build Tools revision 31.0.0 is corrupted"**
- Go to <button><a href="https://stackoverflow.com/questions/68387270/android-studio-error-installed-build-tools-revision-31-0-0-is-corrupted?page=1&tab=scoredesc#tab-top">this</a></button> link
- Scroll down to the checked answer
- Follow instructions based on your PC's OS
- Reload your IDE, and re-run the Android app

**“Execution failed for task ‘:app:validateSigningDebug’”**

- Navigate through terminal to `AppGT/android/app`
- Run this line in the terminal:
  ```
  keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
  ```
- Answer the questions as prompted & type 'y' when prompted `[no]:`
- Hit enter & rebuild project