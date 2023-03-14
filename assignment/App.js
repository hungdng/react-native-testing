/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DashboardScreen from './src/screens/Dashboard';
import MovieDetailScreen from './src/screens/MovieDetail';
import {SCREEN_NAME} from './src/constants/screens';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREEN_NAME.dasboard}
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAME.movieDetail}
        component={MovieDetailScreen}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      </SafeAreaView>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
