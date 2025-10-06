import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {use} from "react";
import { userAuth, AuthProvider } from './context/AuthContext';


import LogCreateScreen from "./Screens/Login/StartScreen";
import CreateAccountScreen from "./Screens/Login/CreateAccountScreen";
import LoginScreen from "./Screens/Login/LoginScreen";
import ResetPasswordScreen from "./Screens/Login/ResetPasswordScreen";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';



const AuthStack = createNativeStackNavigator({
  screens: {
    StartScreen: {screen: LogCreateScreen},
    LoginScreen: {screen: LoginScreen},
    CreateAccountScreen: {screen: CreateAccountScreen},
    ResetPasswordScreen: {screen: ResetPasswordScreen}
  },
});


const AppStack = createNativeStackNavigator({
  screens: {
    HomeScreen: {screen: HomeScreen},
    ProfileScreen: {screen: ProfileScreen},
  },
});


function RootNav() {
  const {user, loading} = userAuth();
  if(loading) {
    return null;
  }

  const Stack = user ? AppStack : AuthStack;
  const Navigation = createStaticNavigation(Stack);
  return <Navigation />;
}

export default function App() {
  return (
    <AuthProvider>
      <ActionSheetProvider>
        <RootNav />
      </ActionSheetProvider>
    </AuthProvider>
  );
}