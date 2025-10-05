import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './screens/ProfileScreen';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';


const RootStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
  }
});

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Profile" component={ProfileScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
