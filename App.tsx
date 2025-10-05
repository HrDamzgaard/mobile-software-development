import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {use} from "react";
import LogCreateScreen from "./Screens/Login/StartScreen";
import CreateAccountScreen from "./Screens/Login/CreateAccountScreen";
import LoginScreen from "./Screens/Login/LoginScreen";
import ResetPasswordScreen from "./Screens/Login/ResetPasswordScreen";
import HomeScreen from "./Screens/HomeScreen";

const RootStack = createNativeStackNavigator({
  screens: {
    StartScreen: {
      screen: LogCreateScreen,
    },
    LoginScreen: {
      screen: LoginScreen,
    },
    CreateAccountScreen: {
      screen: CreateAccountScreen,
    },
    ResetPasswordScreen: {
      screen: ResetPasswordScreen
    },
    HomeScreen: {
      screen: HomeScreen
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}