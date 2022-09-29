/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeApp } from 'firebase/app';


export const app = initializeApp({
    apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
    authDomain: "auth.hexlabs.org",
});


AppRegistry.registerComponent(appName, () => App);
