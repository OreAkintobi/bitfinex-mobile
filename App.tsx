import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';

import React from 'react';
import Root from './Root';

export default function App() {
  return (
    <Provider store={store}>
      <Root />
      <StatusBar style="auto" />
    </Provider>
  );
}
