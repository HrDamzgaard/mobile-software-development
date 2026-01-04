import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { userAuth, AuthProvider } from './context/AuthContext';
import AppHeader from './component/AppHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
import BookingConfirmation from './Screens/BookingConfirmation';
import BookingHistoryScreen from './Screens/BookingHistoryScreen';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

SplashScreen.preventAutoHideAsync();

const AuthStack = createNativeStackNavigator({
  screens: {
    StartScreen: {
      screen: LogCreateScreen,
      options: { title: ' Start ' },
    },
    LoginScreen: {
      screen: LoginScreen,
      options: { title: ' Login ' },
    },
    CreateAccountScreen: {
      screen: CreateAccountScreen,
      options: { title: ' Create Account ' },
    },
    ResetPasswordScreen: {
      screen: ResetPasswordScreen,
      options: { title: ' Reset Password ' },
    },
  },
});

const AppDrawer = createDrawerNavigator({
  screens: {
    HomeScreen: {
      screen: HomeScreen,
      options: {
        title: ' Home ',
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        title: ' Profile ',
        drawerItemStyle: { display: 'none' },
      },
    },
    CarDetails: {
      screen: CarDetails,
      options: {
        title: ' Car Details ',
        drawerItemStyle: { display: 'none' },
      },
    },
    BookingConfirmation: {
      screen: BookingConfirmation,
      options: {
        title: ' Booking Confirmation ',
        drawerItemStyle: { display: 'none' },
      },
    },
    BookingHistory: {
      screen: BookingHistoryScreen,
      options: {
        title: ' Booking History ',
        drawerItemStyle: { display: 'none' },
      },
    },
  },
  screenOptions: {
    header: (props) => <AppHeader {...props} />,
  },
});

function RootNav() {
  const { user, loading } = userAuth();
  if (loading) return null;

  const Stack = user ? AppDrawer : AuthStack;
  const Navigation = createStaticNavigation(Stack);
  return <Navigation />;
}

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

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ActionSheetProvider>
          <RootNav />
        </ActionSheetProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
