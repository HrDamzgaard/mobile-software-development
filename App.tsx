import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {use} from "react";
import LogCreateScreen from "./Screens/LogCreateScreen";
import CreateScreen from "./Screens/CreateScreen";
import LoginScreen from "./Screens/LoginScreen";
import ResetPasswordScreen from "./Screens/ResetPasswordScreen";
import ProfileScreen from "./Screens/ProfileScreen";

const RootStack = createNativeStackNavigator({
  screens: {
    LogCreateScreen: {
      screen: LogCreateScreen,
    },
    LoginScreen: {
      screen: LoginScreen,
    },
    CreateScreen: {
      screen: CreateScreen,
    },
    ResetPasswordScreen: {
      screen: ResetPasswordScreen
    },
    ProfileScreen: {
      screen: ProfileScreen
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
