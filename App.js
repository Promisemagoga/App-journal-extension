import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Jonurnal from './pages/journal';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';




export default function App() {
  return (
    <NavigationContainer>

      <StackNavigator/>
    {/* <View style={styles.container}>
     <Jonurnal/>
    </View> */}
    </NavigationContainer>

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
