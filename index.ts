import { registerRootComponent } from 'expo';

import Navigate from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => Navigate);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Navigate);
