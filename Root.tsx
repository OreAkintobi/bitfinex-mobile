import { RootState } from './src/store';
import { AskScreen, BidScreen } from './src/screens';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { BitfinexSocket } from './src/service/websocket';
import { setConnected, setDisconnected } from './src/store/slices/websocket';

const Tab = createBottomTabNavigator();

export default function Root() {
  const isConnected = useSelector(
    (state: RootState) => state.websocket.isConnected
  );
  const dispatch = useDispatch();

  const websocketService = BitfinexSocket.getInstance(dispatch);

  useEffect(() => {
    isConnected ? websocketService.connect() : websocketService.disconnect();

    return () => {
      websocketService.disconnect();
    };
  }, [websocketService, isConnected]);

  const handleConnect = () => {
    dispatch(setConnected());
  };

  const handleDisconnect = () => {
    dispatch(setDisconnected());
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handleConnect}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDisconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              ORDER BOOK <Text style={styles.subtitle}>BTC/USD</Text>
            </Text>
            <View style={styles.precisionButtonContainer}>
              <TouchableOpacity
                onPress={() => websocketService.decreasePrecision()}
              >
                <Text style={styles.title}>.0</Text>
                <AntDesign name="arrowleft" size={12} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => websocketService.increasePrecision()}
              >
                <Text style={styles.title}>.00</Text>
                <AntDesign name="arrowright" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <Tab.Navigator>
            <Tab.Screen name="Bids" component={BidScreen} />
            <Tab.Screen name="Asks" component={AskScreen} />
          </Tab.Navigator>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1b262f',
  },
  container: {
    flex: 1,
    backgroundColor: '#1b262f',
    padding: 20,
  },
  button: {
    backgroundColor: '#1b262f',
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  subtitle: {
    color: '#657786',
  },
  precisionButtonContainer: {
    flexDirection: 'row',
  },
});
