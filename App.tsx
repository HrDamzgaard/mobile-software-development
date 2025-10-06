import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {use} from "react";
import LogCreateScreen from "./Screens/Login/StartScreen";
import CreateAccountScreen from "./Screens/Login/CreateAccountScreen";
import LoginScreen from "./Screens/Login/LoginScreen";
import ResetPasswordScreen from "./Screens/Login/ResetPasswordScreen";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import CarDetails from './Screens/CarDetails';
import { StatusBar } from 'expo-status-bar';


SplashScreen.preventAutoHideAsync(); 

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
    ProfileScreen: {
      screen: ProfileScreen
    },
    CarDetails: {
      screen: CarDetails,
      options: { headerShown: false }  
    }
  
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
   const [fontsLoaded, error] = useFonts({
     Poppins_400Regular,
     Poppins_600SemiBold,
     Poppins_700Bold,
   }); 

   useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}